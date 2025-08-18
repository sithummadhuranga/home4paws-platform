using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(corsBuilder =>
    {
        var allowedOrigins = builder.Configuration.GetSection("CorsSettings:AllowedOrigins").Get<string[]>()
            ?? new[] { "http://localhost:3000" };

        corsBuilder
            .WithOrigins(allowedOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Configure JSON options
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

// Add Entity Framework with PostgreSQL (Supabase)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (!string.IsNullOrEmpty(connectionString))
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
    {
        options.UseNpgsql(connectionString, npgsqlOptions =>
        {
            npgsqlOptions.EnableRetryOnFailure(maxRetryCount: 3);
        });

        // Add detailed logging in development
        if (builder.Environment.IsDevelopment())
        {
            options.EnableSensitiveDataLogging();
            options.EnableDetailedErrors();
        }
    });
}

// Add health checks
builder.Services.AddHealthChecks()
    .AddNpgSql(connectionString ?? "", name: "database");

var app = builder.Build();

// Enhanced environment logging with clear branding
var logger = app.Services.GetRequiredService<ILogger<Program>>();
var environmentBadge = app.Environment.IsDevelopment() ? "🔧 DEVELOPMENT" : "🚀 PRODUCTION";
var appName = builder.Configuration.GetValue<string>("ApplicationSettings:ApplicationName", "Home4Paws Platform");

logger.LogInformation("═══════════════════════════════════════════════════════");
logger.LogInformation("🐾 {AppName}", appName);
logger.LogInformation("{EnvironmentBadge} Environment: {Environment}", environmentBadge, app.Environment.EnvironmentName.ToUpper());
logger.LogInformation("📊 Database: {DatabaseStatus}", !string.IsNullOrEmpty(connectionString) ? "✅ Configured" : "❌ Not Configured");
logger.LogInformation("🌐 Base URL: {BaseUrl}", builder.Configuration.GetValue<string>("ExternalServices:BaseUrl"));
logger.LogInformation("═══════════════════════════════════════════════════════");

// Configure the HTTP request pipeline
var enableSwagger = builder.Configuration.GetValue<bool>("Features:EnableSwagger", false);

if (app.Environment.IsDevelopment() || enableSwagger)
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Home4Paws API v1");
        options.RoutePrefix = "swagger";
        options.DocumentTitle = $"🐾 Home4Paws API - {app.Environment.EnvironmentName.ToUpper()}";
        
        // Customize Swagger UI based on environment
        if (app.Environment.IsDevelopment())
        {
            options.DefaultModelsExpandDepth(-1);
            options.DisplayRequestDuration();
        }
    });
    logger.LogInformation("📖 Swagger UI: ✅ Enabled at /swagger");
}
else
{
    logger.LogInformation("📖 Swagger UI: ❌ Disabled (Production Mode)");
}

if (app.Environment.IsProduction())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
    logger.LogInformation("🔒 Security: ✅ HSTS and Exception Handling enabled");
}

app.UseHttpsRedirection();
app.UseCors();

// Health check endpoints
app.MapHealthChecks("/health");
app.MapGet("/health/database", async (ApplicationDbContext dbContext) =>
{
    try
    {
        await dbContext.Database.CanConnectAsync();
        return Results.Ok(new { 
            status = "healthy", 
            database = "connected",
            environment = app.Environment.EnvironmentName,
            timestamp = DateTime.UtcNow
        });
    }
    catch (Exception ex)
    {
        return Results.Problem(
            detail: ex.Message,
            statusCode: 503,
            title: "Database connection failed"
        );
    }
})
.WithName("DatabaseHealth")
.WithOpenApi();

// Enhanced API info endpoint
app.MapGet("/api/info", (IConfiguration config, IWebHostEnvironment env) => new
{
    Application = new
    {
        Name = config.GetValue<string>("ApplicationSettings:ApplicationName", "Home4Paws Platform"),
        Version = config.GetValue<string>("ApplicationSettings:Version", "1.0.0"),
        Environment = env.EnvironmentName,
        Schema = env.IsDevelopment() ? "development" : "production"
    },
    Configuration = new
    {
        DatabaseConfigured = !string.IsNullOrEmpty(connectionString),
        BaseUrl = config.GetValue<string>("ExternalServices:BaseUrl"),
        Features = new
        {
            EnableSwagger = config.GetValue<bool>("Features:EnableSwagger"),
            EnableDetailedErrors = config.GetValue<bool>("Features:EnableDetailedErrors"),
            EnableChatbot = config.GetValue<bool>("Features:EnableChatbot"),
            EnableFileUpload = config.GetValue<bool>("Features:EnableFileUpload")
        }
    },
    Runtime = new
    {
        Timestamp = DateTime.UtcNow,
        MachineName = Environment.MachineName,
        ProcessId = Environment.ProcessId
    }
})
.WithName("GetApiInfo")
.WithOpenApi()
.WithSummary("Get comprehensive API information and configuration");

// Sample endpoint for testing - remove in production
if (app.Environment.IsDevelopment())
{
    var summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    app.MapGet("/weatherforecast", () =>
    {
        var forecast = Enumerable.Range(1, 5).Select(index =>
            new WeatherForecast
            (
                DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                Random.Shared.Next(-20, 55),
                summaries[Random.Shared.Next(summaries.Length)]
            ))
            .ToArray();
        return forecast;
    })
    .WithName("GetWeatherForecast")
    .WithOpenApi()
    .WithSummary("Development testing endpoint - returns mock weather data");
    
    logger.LogInformation("🌤️  Weather Forecast: ✅ Development endpoint enabled");
}

logger.LogInformation("🎯 Home4Paws API started successfully!");
app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

// Basic DbContext for now - you'll expand this with your actual entities
public class ApplicationDbContext : DbContext
{
    private readonly IWebHostEnvironment _environment;

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IWebHostEnvironment environment) : base(options)
    {
        _environment = environment;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configure schema based on environment
        var schema = _environment.IsDevelopment() ? "development" : "production";
        modelBuilder.HasDefaultSchema(schema);
    }

    // TODO: Add your DbSets here as you create entities
    // public DbSet<User> Users { get; set; }
    // public DbSet<Pet> Pets { get; set; }
    // public DbSet<Adoption> Adoptions { get; set; }
}
