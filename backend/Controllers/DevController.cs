using Microsoft.AspNetCore.Mvc;
using Home4Paws.API.DataManager;

namespace Home4Paws.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DevController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<DevController> _logger;
        private readonly IWebHostEnvironment _environment;

        public DevController(IUserRepository userRepository, ILogger<DevController> logger, IWebHostEnvironment environment)
        {
            _userRepository = userRepository;
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
    }

    public class ResetPasswordRequest
    {
        public string Email { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}