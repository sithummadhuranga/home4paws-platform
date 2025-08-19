using Dapper;
using Home4Paws.API.Models.Entities;
using Home4Paws.API.Queries;
using Npgsql;

namespace Home4Paws.API.DataManager
{
    public class UserRepository(IConfiguration configuration, ILogger<UserRepository> logger) : IUserRepository
    {
        private readonly string _connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? throw new ArgumentNullException(nameof(configuration));
        private readonly ILogger<UserRepository> _logger = logger;

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            try
            {
                using var connection = new NpgsqlConnection(_connectionString);
                await connection.OpenAsync();

                var user = await connection.QueryFirstOrDefaultAsync<User>(
                    AuthQueries.GetUserByEmail(),
                    new { Email = email });

                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user by email: {Email}", email);
                throw;
            }
        }

        public async Task<User?> GetUserByIdAsync(int userId)
        {
            try
            {
                using var connection = new NpgsqlConnection(_connectionString);
                await connection.OpenAsync();

                var user = await connection.QueryFirstOrDefaultAsync<User>(
                    AuthQueries.GetUserById(),
                    new { UserId = userId });

                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user by ID: {UserId}", userId);
                throw;
            }
        }

        public async Task<int> CreateUserAsync(User user)
        {
            try
            {
                using var connection = new NpgsqlConnection(_connectionString);
                await connection.OpenAsync();

                var userId = await connection.QuerySingleAsync<int>(
                    AuthQueries.CreateUser(),
                    new
                    {
                        user.FirstName,
                        user.LastName,
                        user.Email,
                        user.PasswordHash,
                        user.Role,
                        user.IsActive,
                        user.EmailVerified,
                        user.CreatedAt,
                        user.UpdatedAt
                    });

                _logger.LogInformation("User created successfully with ID: {UserId}", userId);
                return userId;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user: {Email}", user.Email);
                throw;
            }
        }

        public async Task<bool> UpdateLastLoginAsync(int userId, DateTime lastLoginAt)
        {
            try
            {
                using var connection = new NpgsqlConnection(_connectionString);
                await connection.OpenAsync();

                var rowsAffected = await connection.ExecuteAsync(
                    AuthQueries.UpdateLastLogin(),
                    new { UserId = userId, LastLoginAt = lastLoginAt, UpdatedAt = DateTime.UtcNow });

                return rowsAffected > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating last login for user: {UserId}", userId);
                throw;
            }
        }

        public async Task<bool> UpdatePasswordHashAsync(int userId, string passwordHash)
        {
            try
            {
                using var connection = new NpgsqlConnection(_connectionString);
                await connection.OpenAsync();

                var rowsAffected = await connection.ExecuteAsync(
                    "UPDATE users SET password_hash = @PasswordHash, updated_at = @UpdatedAt WHERE id = @UserId",
                    new { UserId = userId, PasswordHash = passwordHash, UpdatedAt = DateTime.UtcNow });

                return rowsAffected > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating password hash for user: {UserId}", userId);
                throw;
            }
        }

        public async Task<int> CreateUserSessionAsync(UserSession session)
        {
            try
            {
                using var connection = new NpgsqlConnection(_connectionString);
                await connection.OpenAsync();

                var sessionId = await connection.QuerySingleAsync<int>(
                    AuthQueries.CreateUserSession(),
                    new
                    {
                        session.UserId,
                        session.Token,
                        session.RefreshToken,
                        session.ExpiresAt,
                        session.CreatedAt,
                        session.IsActive,
                        session.DeviceInfo,
                        session.IpAddress
                    });

                _logger.LogInformation("User session created successfully with ID: {SessionId}", sessionId);
                return sessionId;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user session for user: {UserId}", session.UserId);
                throw;
            }
        }

        public async Task<UserSession?> GetUserSessionAsync(string refreshToken)
        {
            try
            {
                using var connection = new NpgsqlConnection(_connectionString);
                await connection.OpenAsync();

                var result = await connection.QueryAsync<UserSession, User, UserSession>(
                    AuthQueries.GetUserSession(),
                    (session, user) =>
                    {
                        session.User = user;
                        return session;
                    },
                    new { RefreshToken = refreshToken, CurrentTime = DateTime.UtcNow },
                    splitOn: "user_id");

                return result.FirstOrDefault();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user session by refresh token");
                throw;
            }
        }

        public async Task<bool> DeactivateUserSessionAsync(string refreshToken)
        {
            try
            {
                using var connection = new NpgsqlConnection(_connectionString);
                await connection.OpenAsync();

                var rowsAffected = await connection.ExecuteAsync(
                    AuthQueries.DeactivateUserSession(),
                    new { RefreshToken = refreshToken });

                return rowsAffected > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deactivating user session");
                throw;
            }
        }

        public async Task<bool> DeactivateAllUserSessionsAsync(int userId)
        {
            try
            {
                using var connection = new NpgsqlConnection(_connectionString);
                await connection.OpenAsync();

                var rowsAffected = await connection.ExecuteAsync(
                    AuthQueries.DeactivateAllUserSessions(),
                    new { UserId = userId });

                return rowsAffected > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deactivating all user sessions for user: {UserId}", userId);
                throw;
            }
        }

        public async Task<bool> CleanupExpiredSessionsAsync()
        {
            try
            {
                using var connection = new NpgsqlConnection(_connectionString);
                await connection.OpenAsync();

                var rowsAffected = await connection.ExecuteAsync(
                    AuthQueries.CleanupExpiredSessions(),
                    new { CurrentTime = DateTime.UtcNow });

                _logger.LogInformation("Cleaned up {Count} expired sessions", rowsAffected);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during session cleanup");
                throw;
            }
        }

        public string GetConnectionString()
        {
            return _connectionString;
        }
    }
}