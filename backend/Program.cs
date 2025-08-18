var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline based on environment and feature flags
var enableSwagger = builder.Configuration.GetValue<bool>("Features:EnableSwagger", false);

if (app.Environment.IsDevelopment() || enableSwagger)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (app.Environment.IsProduction())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
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
.WithOpenApi();

// Add endpoint to check current environment and configuration
app.MapGet("/api/environment", (IConfiguration config, IWebHostEnvironment env) => new 
{
    Environment = env.EnvironmentName,
    ApplicationName = config["ApplicationSettings:ApplicationName"],
    Version = config["ApplicationSettings:Version"],
    Features = new
    {
        EnableSwagger = config.GetValue<bool>("Features:EnableSwagger"),
        EnableDetailedErrors = config.GetValue<bool>("Features:EnableDetailedErrors"),
        EnableChatbot = config.GetValue<bool>("Features:EnableChatbot"),
        EnableFileUpload = config.GetValue<bool>("Features:EnableFileUpload")
    }
})
.WithName("GetEnvironmentInfo")
.WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
