using Microsoft.AspNetCore.Mvc;
using Home4Paws.API.DataManager;
using Home4Paws.API.Services.Auth;
using Home4Paws.API.Models.Auth;

namespace Home4Paws.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DevController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IAuthService _authService;
        private readonly ILogger<DevController> _logger;
        private readonly IWebHostEnvironment _environment;

        public DevController(
            IUserRepository userRepository, 
            IAuthService authService,
            ILogger<DevController> logger, 
            IWebHostEnvironment environment)
        {
            _userRepository = userRepository;
            _authService = authService;
            _logger = logger;
            _environment = environment;
        }

        /// <summary>
        /// Reset password for a user (Development only)
        /// </summary>
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            // Only allow in development
            if (!_environment.IsDevelopment())
            {
                return NotFound();
            }

            try
            {
                var user = await _userRepository.GetUserByEmailAsync(request.Email);
                if (user == null)
                {
                    return BadRequest(new { success = false, message = "User not found" });
                }

                // Hash the new password properly
                var newPasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword, workFactor: 12);
                
                // Update password hash in database
                await _userRepository.UpdatePasswordHashAsync(user.Id, newPasswordHash);

                _logger.LogInformation("Password reset for user: {Email}", request.Email);

                return Ok(new { 
                    success = true, 
                    message = "Password reset successfully",
                    userId = user.Id,
                    hashLength = newPasswordHash.Length
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resetting password for user: {Email}", request.Email);
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// List all users (Development only)
        /// </summary>
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            if (!_environment.IsDevelopment())
            {
                return NotFound();
            }

            try
            {
                // This would require adding a GetAllUsers method to IUserRepository
                return Ok(new { message = "Development endpoint - user listing would go here" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting users");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Health check endpoint
        /// </summary>
        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { 
                status = "healthy",
                environment = _environment.EnvironmentName,
                timestamp = DateTime.UtcNow
            });
        }

        /// <summary>
        /// Create a test user (Development only)
        /// </summary>
        [HttpPost("create-test-user")]
        public async Task<IActionResult> CreateTestUser([FromBody] CreateTestUserRequest request)
        {
            // Only allow in development
            if (!_environment.IsDevelopment())
            {
                return NotFound();
            }

            try
            {
                _logger.LogInformation("🧪 Creating test user: {Email}", request.Email);

                // Use the existing SignupRequest model
                var signupRequest = new SignupRequest
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Email = request.Email,
                    Password = request.Password,
                    ConfirmPassword = request.Password,
                    AgreeToTerms = true
                };

                // Use the AuthService to create the user
                var result = await _authService.SignupAsync(signupRequest, "127.0.0.1");

                if (result.Success)
                {
                    _logger.LogInformation("✅ Test user created successfully: {Email}", request.Email);
                    
                    return Ok(new { 
                        success = true, 
                        message = "Test user created successfully",
                        userId = result.User?.Id,
                        email = result.User?.Email,
                        name = $"{result.User?.FirstName} {result.User?.LastName}",
                        tokens = result.Tokens
                    });
                }
                else
                {
                    _logger.LogWarning("❌ Failed to create test user: {Email} - {Message}", request.Email, result.Message);
                    return BadRequest(new { 
                        success = false, 
                        message = result.Message,
                        errors = result.Errors 
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Error creating test user: {Email}", request.Email);
                return BadRequest(new { 
                    success = false, 
                    message = ex.Message 
                });
            }
        }
    }

    public class CreateTestUserRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class ResetPasswordRequest
    {
        public string Email { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}