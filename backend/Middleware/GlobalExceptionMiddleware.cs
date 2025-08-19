using System.Net;
using System.Text.Json;

namespace Home4Paws.API.Middleware
{
    public class GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger, IWebHostEnvironment environment)
    {
        private readonly RequestDelegate _next = next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger = logger;
        private readonly IWebHostEnvironment _environment = environment;

        // Cached JsonSerializerOptions to avoid creating new instances
        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            
            var response = new
            {
                success = false,
                message = "An error occurred while processing your request.",
                errors = new List<string>(),
                timestamp = DateTime.UtcNow
            };

            switch (exception)
            {
                case ArgumentNullException:
                case ArgumentException:
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    response = response with 
                    { 
                        message = "Invalid request parameters.",
                        errors = [exception.Message]
                    };
                    break;

                case UnauthorizedAccessException:
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    response = response with 
                    { 
                        message = "Unauthorized access.",
                        errors = ["You are not authorized to perform this action."]
                    };
                    break;

                case KeyNotFoundException:
                    context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                    response = response with 
                    { 
                        message = "Resource not found.",
                        errors = [exception.Message]
                    };
                    break;

                case InvalidOperationException:
                    context.Response.StatusCode = (int)HttpStatusCode.Conflict;
                    response = response with 
                    { 
                        message = "Operation cannot be completed.",
                        errors = [exception.Message]
                    };
                    break;

                default:
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    
                    // Only show detailed error in development
                    if (_environment.IsDevelopment())
                    {
                        response = response with 
                        { 
                            message = exception.Message,
                            errors = [exception.StackTrace ?? "No stack trace available"]
                        };
                    }
                    else
                    {
                        response = response with 
                        { 
                            message = "An internal server error occurred.",
                            errors = ["Please try again later or contact support."]
                        };
                    }
                    break;
            }

            var jsonResponse = JsonSerializer.Serialize(response, JsonOptions);
            await context.Response.WriteAsync(jsonResponse);
        }
    }
}