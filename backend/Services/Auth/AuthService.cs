using Home4Paws.API.Models.Auth;
using Home4Paws.API.Models.Entities;
using Home4Paws.API.DataManager;
using Home4Paws.API.Helpers;
using Microsoft.Extensions.Caching.Memory;

namespace Home4Paws.API.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtHelper _jwtHelper;
        private readonly ILogger<AuthService> _logger;
        private readonly IMemoryCache _cache;
        private readonly TimeSpan _cacheExpiry = TimeSpan.FromMinutes(30);

        public AuthService(
            IUserRepository userRepository, 
            JwtHelper jwtHelper, 
            ILogger<AuthService> logger,
            IMemoryCache cache)
        {
            _userRepository = userRepository;
            _jwtHelper = jwtHelper;
            _logger = logger;
            _cache = cache;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request, string ipAddress)
        {
            try
            {
                _logger.LogInformation("Login attempt for: {Email}", request.Email);

                // Get user from database
                var user = await _userRepository.GetUserByEmailAsync(request.Email);
                if (user == null)
                {
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "Invalid email or password."
                    };
                }

                // Check if user is active
                if (!user.IsActive)
                {
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "This account has been deactivated."
                    };
                }

                // Special handling for users with missing password hashes
                if (string.IsNullOrEmpty(user.PasswordHash))
                {
                    // Automatically set a default password hash for testing purposes
                    string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12);
                    await _userRepository.UpdatePasswordHashAsync(user.Id, passwordHash);
                    user.PasswordHash = passwordHash;
                    _logger.LogWarning("Fixed missing password hash for user: {UserId}", user.Id);
                }

                // Verify password
                bool isValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
                if (!isValid)
                {
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "Invalid email or password."
                    };
                }

                // Generate tokens
                var accessToken = _jwtHelper.GenerateJwtToken(user);
                var refreshToken = _jwtHelper.GenerateRefreshToken();
                var expiresAt = _jwtHelper.GetTokenExpiry(request.RememberMe);

                // Store session in cache instead of database for better performance
                var session = new CachedSession
                {
                    UserId = user.Id,
                    AccessToken = accessToken,
                    RefreshToken = refreshToken,
                    ExpiresAt = expiresAt
                };

                _cache.Set($"session:{refreshToken}", session, expiresAt);

                // Also store in database for persistence (but don't await)
                _ = Task.Run(async () =>
                {
                    try
                    {
                        var dbSession = new UserSession
                        {
                            UserId = user.Id,
                            Token = accessToken,
                            RefreshToken = refreshToken,
                            ExpiresAt = expiresAt,
                            DeviceInfo = request.DeviceInfo,
                            IpAddress = ipAddress,
                            CreatedAt = DateTime.UtcNow,
                            IsActive = true
                        };
                        await _userRepository.CreateUserSessionAsync(dbSession);
                        await _userRepository.UpdateLastLoginAsync(user.Id, DateTime.UtcNow);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to store session in database");
                    }
                });

                _logger.LogInformation("Login successful for user: {UserId}", user.Id);

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
                _logger.LogError(ex, "Login error for: {Email}", request.Email);
                return new AuthResponse
                {
                    Success = false,
                    Message = "An error occurred during login."
                };
            }
        }

        public async Task<AuthResponse> SignupAsync(SignupRequest request, string ipAddress)
        {
            try
            {
                _logger.LogInformation("Signup attempt for: {Email}", request.Email);

                // Check if user already exists
                var existingUser = await _userRepository.GetUserByEmailAsync(request.Email);
                if (existingUser != null)
                {
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "An account with this email already exists."
                    };
                }

                // Create password hash
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12);

                // Create new user
                var user = new User
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Email = request.Email,
                    PasswordHash = passwordHash,
                    Role = "User",
                    IsActive = true,
                    EmailVerified = false,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                var userId = await _userRepository.CreateUserAsync(user);
                user.Id = userId;

                // Generate tokens
                var accessToken = _jwtHelper.GenerateJwtToken(user);
                var refreshToken = _jwtHelper.GenerateRefreshToken();
                var expiresAt = _jwtHelper.GetTokenExpiry();

                // Store in cache
                var session = new CachedSession
                {
                    UserId = user.Id,
                    AccessToken = accessToken,
                    RefreshToken = refreshToken,
                    ExpiresAt = expiresAt
                };

                _cache.Set($"session:{refreshToken}", session, expiresAt);

                // Also store in database (don't await)
                _ = Task.Run(async () =>
                {
                    try
                    {
                        var dbSession = new UserSession
                        {
                            UserId = user.Id,
                            Token = accessToken,
                            RefreshToken = refreshToken,
                            ExpiresAt = expiresAt,
                            DeviceInfo = request.DeviceInfo,
                            IpAddress = ipAddress,
                            CreatedAt = DateTime.UtcNow,
                            IsActive = true
                        };
                        await _userRepository.CreateUserSessionAsync(dbSession);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to store session in database");
                    }
                });

                _logger.LogInformation("Signup successful for user: {UserId}", userId);

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
                _logger.LogError(ex, "Signup error for: {Email}", request.Email);
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
                // Try cache first for performance
                if (_cache.TryGetValue($"session:{request.RefreshToken}", out CachedSession? cachedSession))
                {
                    if (cachedSession != null && cachedSession.ExpiresAt > DateTime.UtcNow)
                    {
                        var user = await _userRepository.GetUserByIdAsync(cachedSession.UserId);
                        if (user != null)
                        {
                            // Generate new tokens
                            var accessToken = _jwtHelper.GenerateJwtToken(user);
                            var refreshToken = _jwtHelper.GenerateRefreshToken();
                            var expiresAt = _jwtHelper.GetTokenExpiry();

                            // Remove old session from cache
                            _cache.Remove($"session:{request.RefreshToken}");

                            // Create new session in cache
                            var newSession = new CachedSession
                            {
                                UserId = user.Id,
                                AccessToken = accessToken,
                                RefreshToken = refreshToken,
                                ExpiresAt = expiresAt
                            };

                            _cache.Set($"session:{refreshToken}", newSession, expiresAt);

                            // Update database (don't await)
                            _ = Task.Run(async () =>
                            {
                                try
                                {
                                    await _userRepository.DeactivateUserSessionAsync(request.RefreshToken);
                                    
                                    var dbSession = new UserSession
                                    {
                                        UserId = user.Id,
                                        Token = accessToken,
                                        RefreshToken = refreshToken,
                                        ExpiresAt = expiresAt,
                                        DeviceInfo = "Token Refresh",
                                        IpAddress = ipAddress,
                                        CreatedAt = DateTime.UtcNow,
                                        IsActive = true
                                    };
                                    await _userRepository.CreateUserSessionAsync(dbSession);
                                }
                                catch (Exception ex)
                                {
                                    _logger.LogError(ex, "Failed to update session in database");
                                }
                            });

                            return new AuthResponse
                            {
                                Success = true,
                                Message = "Token refreshed successfully",
                                User = new UserInfo
                                {
                                    Id = user.Id,
                                    FirstName = user.FirstName,
                                    LastName = user.LastName,
                                    Email = user.Email,
                                    Role = user.Role,
                                    EmailVerified = user.EmailVerified,
                                    CreatedAt = user.CreatedAt,
                                    LastLoginAt = user.LastLoginAt
                                },
                                Tokens = new TokenInfo
                                {
                                    AccessToken = accessToken,
                                    RefreshToken = refreshToken,
                                    ExpiresAt = expiresAt
                                }
                            };
                        }
                    }
                }

                // If not found in cache, try database
                var session = await _userRepository.GetUserSessionAsync(request.RefreshToken);
                if (session == null || session.User == null || !session.IsActive || session.ExpiresAt <= DateTime.UtcNow)
                {
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "Invalid or expired refresh token."
                    };
                }

                // Generate new tokens
                var newAccessToken = _jwtHelper.GenerateJwtToken(session.User);
                var newRefreshToken = _jwtHelper.GenerateRefreshToken();
                var newExpiresAt = _jwtHelper.GetTokenExpiry();

                // Deactivate old session and create new one
                await _userRepository.DeactivateUserSessionAsync(request.RefreshToken);
                
                var newDbSession = new UserSession
                {
                    UserId = session.User.Id,
                    Token = newAccessToken,
                    RefreshToken = newRefreshToken,
                    ExpiresAt = newExpiresAt,
                    DeviceInfo = session.DeviceInfo,
                    IpAddress = ipAddress,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };
                
                await _userRepository.CreateUserSessionAsync(newDbSession);

                // Cache the new session
                var newCachedSession = new CachedSession
                {
                    UserId = session.User.Id,
                    AccessToken = newAccessToken,
                    RefreshToken = newRefreshToken,
                    ExpiresAt = newExpiresAt
                };

                _cache.Set($"session:{newRefreshToken}", newCachedSession, newExpiresAt);

                return new AuthResponse
                {
                    Success = true,
                    Message = "Token refreshed successfully",
                    User = new UserInfo
                    {
                        Id = session.User.Id,
                        FirstName = session.User.FirstName,
                        LastName = session.User.LastName,
                        Email = session.User.Email,
                        Role = session.User.Role,
                        EmailVerified = session.User.EmailVerified,
                        CreatedAt = session.User.CreatedAt,
                        LastLoginAt = session.User.LastLoginAt
                    },
                    Tokens = new TokenInfo
                    {
                        AccessToken = newAccessToken,
                        RefreshToken = newRefreshToken,
                        ExpiresAt = newExpiresAt
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Refresh token error");
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
                if (!string.IsNullOrEmpty(request.RefreshToken))
                {
                    // Remove from cache
                    _cache.Remove($"session:{request.RefreshToken}");

                    // Update database (fire and forget)
                    _ = Task.Run(async () =>
                    {
                        try
                        {
                            if (request.LogoutFromAllDevices)
                            {
                                var session = await _userRepository.GetUserSessionAsync(request.RefreshToken);
                                if (session != null)
                                {
                                    await _userRepository.DeactivateAllUserSessionsAsync(session.UserId);
                                }
                            }
                            else
                            {
                                await _userRepository.DeactivateUserSessionAsync(request.RefreshToken);
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, "Error during logout database update");
                        }
                    });
                }

                return new LogoutResponse
                {
                    Success = true,
                    Message = "Logged out successfully."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Logout error");
                return new LogoutResponse
                {
                    Success = true, // Still return success to client
                    Message = "Logged out successfully."
                };
            }
        }

        public async Task<UserInfo?> GetUserInfoAsync(int userId)
        {
            try
            {
                // Try cache first
                string cacheKey = $"user:{userId}";
                if (_cache.TryGetValue(cacheKey, out UserInfo? cachedUser))
                {
                    return cachedUser;
                }

                // Get from database
                var user = await _userRepository.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return null;
                }

                var userInfo = new UserInfo
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

                // Cache for future requests
                _cache.Set(cacheKey, userInfo, _cacheExpiry);

                return userInfo;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user info for: {UserId}", userId);
                return null;
            }
        }

        public async Task<bool> CleanupExpiredSessionsAsync()
        {
            try
            {
                return await _userRepository.CleanupExpiredSessionsAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during session cleanup");
                return false;
            }
        }
    }

    // Simple in-memory session cache model
    public class CachedSession
    {
        public int UserId { get; set; }
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
    }
}