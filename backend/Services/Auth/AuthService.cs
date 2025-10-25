using BCrypt.Net;
using Home4Paws.API.DataManager;
using Home4Paws.API.Helpers;
using Home4Paws.API.Models.Auth;
using Home4Paws.API.Models.Entities;

namespace Home4Paws.API.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtHelper _jwtHelper;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            IUserRepository userRepository, 
            JwtHelper jwtHelper, 
            ILogger<AuthService> logger)
        {
            _userRepository = userRepository;
            _jwtHelper = jwtHelper;
            _logger = logger;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request, string ipAddress)
        {
            try
            {
                _logger.LogInformation("🔐 Login attempt for: {Email}", request.Email);

                // Validate input
                if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                {
                    _logger.LogWarning("❌ Login failed - empty email or password");
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "Email and password are required."
                    };
                }

                // Get user from database
                _logger.LogInformation("🔍 Looking up user: {Email}", request.Email);
                var user = await _userRepository.GetUserByEmailAsync(request.Email.ToLowerInvariant());
                
                if (user == null)
                {
                    _logger.LogWarning("❌ Login failed - user not found: {Email}", request.Email);
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "Invalid email or password."
                    };
                }

                _logger.LogInformation("✅ User found: {UserId} ({Email})", user.Id, user.Email);

                // Check if user is active
                if (!user.IsActive)
                {
                    _logger.LogWarning("❌ Login failed - user inactive: {Email}", request.Email);
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "This account has been deactivated."
                    };
                }

                // Verify password
                if (string.IsNullOrEmpty(user.PasswordHash))
                {
                    _logger.LogError("❌ User has no password hash: {Email}", request.Email);
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "Account setup incomplete. Please contact support."
                    };
                }

                _logger.LogInformation("🔐 Verifying password for user: {Email}", request.Email);
                bool isValid;
                try
                {
                    isValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "❌ Password verification error for user: {Email}", request.Email);
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "Authentication failed. Please try again."
                    };
                }

                if (!isValid)
                {
                    _logger.LogWarning("❌ Login failed - invalid password: {Email}", request.Email);
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "Invalid email or password."
                    };
                }

                _logger.LogInformation("✅ Password verified for user: {Email}", request.Email);

                // Update last login time
                try
                {
                    await _userRepository.UpdateLastLoginAsync(user.Id, DateTime.UtcNow);
                    _logger.LogInformation("✅ Updated last login for user: {UserId}", user.Id);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "⚠️ Failed to update last login for user: {UserId}", user.Id);
                    // Don't fail login for this
                }

                // Generate tokens
                _logger.LogInformation("🎫 Generating tokens for user: {UserId}", user.Id);
                string accessToken, refreshToken;
                DateTime expiresAt;
                
                try
                {
                    accessToken = _jwtHelper.GenerateJwtToken(user);
                    refreshToken = _jwtHelper.GenerateRefreshToken();
                    expiresAt = _jwtHelper.GetTokenExpiry(request.RememberMe);
                    _logger.LogInformation("✅ Tokens generated successfully for user: {UserId}", user.Id);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "❌ Token generation failed for user: {UserId}", user.Id);
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "Authentication service temporarily unavailable. Please try again."
                    };
                }

                _logger.LogInformation("🎉 Login successful for user: {UserId} ({Email})", user.Id, user.Email);

                // Return successful response
                return new AuthResponse
                {
                    Success = true,
                    Message = "Login successful",
                    User = new UserInfo
                    {
                        Id = user.Id,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        Role = user.Role,
                        EmailVerified = user.EmailVerified,
                        CreatedAt = user.CreatedAt,
                        LastLoginAt = DateTime.UtcNow
                    },
                    Tokens = new TokenInfo
                    {
                        AccessToken = accessToken,
                        RefreshToken = refreshToken,
                        ExpiresAt = expiresAt
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Unexpected login error for: {Email}", request?.Email ?? "unknown");
                return new AuthResponse
                {
                    Success = false,
                    Message = "An error occurred during login. Please try again."
                };
            }
        }

        public async Task<AuthResponse> SignupAsync(SignupRequest request, string ipAddress)
        {
            try
            {
                _logger.LogInformation("📝 Signup attempt for: {Email}", request.Email);

                // Validate input
                if (string.IsNullOrWhiteSpace(request.FirstName) || string.IsNullOrWhiteSpace(request.LastName) ||
                    string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                {
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "All fields are required."
                    };
                }

                if (request.Password != request.ConfirmPassword)
                {
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "Passwords do not match."
                    };
                }

                // Check if user already exists
                var existingUser = await _userRepository.GetUserByEmailAsync(request.Email.ToLowerInvariant());
                if (existingUser != null)
                {
                    _logger.LogWarning("❌ Signup failed - user already exists: {Email}", request.Email);
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "An account with this email already exists."
                    };
                }

                // Create password hash with proper security
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12);
                _logger.LogDebug("🔐 Password hash created for: {Email}", request.Email);

                // Create new user
                var user = new User
                {
                    FirstName = request.FirstName.Trim(),
                    LastName = request.LastName.Trim(),
                    Email = request.Email.ToLowerInvariant().Trim(),
                    PasswordHash = passwordHash,
                    Role = "User",
                    IsActive = true,
                    EmailVerified = false,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                // Save to database
                var userId = await _userRepository.CreateUserAsync(user);
                user.Id = userId;

                // Generate tokens for immediate login
                var accessToken = _jwtHelper.GenerateJwtToken(user);
                var refreshToken = _jwtHelper.GenerateRefreshToken();
                var expiresAt = _jwtHelper.GetTokenExpiry(false);

                _logger.LogInformation("✅ Signup successful for user: {UserId} ({Email})", userId, user.Email);

                return new AuthResponse
                {
                    Success = true,
                    Message = "Account created successfully",
                    User = new UserInfo
                    {
                        Id = user.Id,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        Role = user.Role,
                        EmailVerified = user.EmailVerified,
                        CreatedAt = user.CreatedAt
                    },
                    Tokens = new TokenInfo
                    {
                        AccessToken = accessToken,
                        RefreshToken = refreshToken,
                        ExpiresAt = expiresAt
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Signup error for: {Email}", request?.Email);
                return new AuthResponse
                {
                    Success = false,
                    Message = "An error occurred during account creation."
                };
            }
        }

        public async Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request, string ipAddress)
        {
            try
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Invalid or expired refresh token."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Refresh token error");
                return new AuthResponse
                {
                    Success = false,
                    Message = "An error occurred during token refresh."
                };
            }
        }

        public async Task<LogoutResponse> LogoutAsync(LogoutRequest request)
        {
            try
            {
                return new LogoutResponse
                {
                    Success = true,
                    Message = "Logout successful"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Logout error");
                return new LogoutResponse
                {
                    Success = false,
                    Message = "An error occurred during logout."
                };
            }
        }

        public async Task<UserInfo?> GetUserInfoAsync(int userId)
        {
            try
            {
                var user = await _userRepository.GetUserByIdAsync(userId);
                if (user == null)
                {
                    _logger.LogWarning("❌ User not found: {UserId}", userId);
                    return null;
                }

                return new UserInfo
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Role = user.Role,
                    EmailVerified = user.EmailVerified,
                    CreatedAt = user.CreatedAt,
                    LastLoginAt = user.LastLoginAt
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Error getting user info for: {UserId}", userId);
                return null;
            }
        }

        public async Task<bool> CleanupExpiredSessionsAsync()
        {
            return true;
        }
    }
}