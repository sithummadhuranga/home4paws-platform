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

                // ✅ FIX: Use explicit column mapping
                var sql = @"
                    SELECT 
                        id as Id,
                        first_name as FirstName,
                        last_name as LastName,
                        email as Email,
                        password_hash as PasswordHash,
                        role as Role,
                        is_active as IsActive,
                        email_verified as EmailVerified,
                        created_at as CreatedAt,
                        updated_at as UpdatedAt,
                        last_login_at as LastLoginAt
                    FROM development.users 
                    WHERE email = @Email AND is_active = true";

                var user = await connection.QueryFirstOrDefaultAsync<User>(sql, new { Email = email });

                if (user != null)
                {
                    _logger.LogInformation("✅ Found user: {UserId}, HasPassword: {HasPassword}", 
                        user.Id, !string.IsNullOrEmpty(user.PasswordHash));
                }
                else
                {
                    _logger.LogWarning("⚠️ User not found: {Email}", email);
                }

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

                // ✅ FIX: Use explicit column mapping
                var sql = @"
                    SELECT 
                        id as Id,
                        first_name as FirstName,
                        last_name as LastName,
                        email as Email,
                        password_hash as PasswordHash,
                        role as Role,
                        is_active as IsActive,
                        email_verified as EmailVerified,
                        created_at as CreatedAt,
                        updated_at as UpdatedAt,
                        last_login_at as LastLoginAt
                    FROM development.users 
                    WHERE id = @UserId AND is_active = true";

                var user = await connection.QueryFirstOrDefaultAsync<User>(sql, new { UserId = userId });

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

                if (rowsAffected > 0)
                {
                    _logger.LogInformation("✅ Updated last login for user {UserId}", userId);
                    return true;
                }
                
                _logger.LogWarning("⚠️ No rows affected when updating last login for user {UserId}", userId);
                return false;
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
                    @"UPDATE development.users 
                      SET password_hash = @PasswordHash, updated_at = @UpdatedAt 
                      WHERE id = @UserId",
                    new { UserId = userId, PasswordHash = passwordHash, UpdatedAt = DateTime.UtcNow });

                if (rowsAffected > 0)
                {
                    _logger.LogInformation("✅ Password updated for user {UserId}", userId);
                    return true;
                }
                
                _logger.LogWarning("⚠️ No rows affected when updating password for user {UserId}", userId);
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error updating password hash for user: {UserId}", userId);
                throw;
            }
        }

        public async Task<bool> UpdateUserRoleAsync(int userId, string role)
        {
            try
            {
                using var connection = new NpgsqlConnection(_connectionString);
                await connection.OpenAsync();

                var rowsAffected = await connection.ExecuteAsync(
                    @"UPDATE development.users 
                      SET role = @Role, updated_at = @UpdatedAt 
                      WHERE id = @UserId",
                    new { UserId = userId, Role = role, UpdatedAt = DateTime.UtcNow });

                if (rowsAffected > 0)
                {
                    _logger.LogInformation("✅ Updated role for user {UserId} to {Role}", userId, role);
                    return true;
                }
                
                _logger.LogWarning("⚠️ No rows affected when updating role for user {UserId}", userId);
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error updating role for user: {UserId}", userId);
                return false;
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

                return sessionId;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user session");
                throw;
            }
        }

        public async Task<UserSession?> GetUserSessionAsync(string refreshToken)
        {
            try
            {
                using var connection = new NpgsqlConnection(_connectionString);
                await connection.OpenAsync();

                var session = await connection.QueryFirstOrDefaultAsync<UserSession>(
                    AuthQueries.GetUserSession(),
                    new { RefreshToken = refreshToken });

                return session;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user session");
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
                _logger.LogError(ex, "Error deactivating all user sessions");
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

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cleaning up expired sessions");
                throw;
            }
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            try
            {
                using var connection = new NpgsqlConnection(_connectionString);
                await connection.OpenAsync();

                var users = await connection.QueryAsync<User>(
                    @"SELECT 
                        id as Id,
                        first_name as FirstName,
                        last_name as LastName,
                        email as Email,
                        role as Role,
                        is_active as IsActive,
                        email_verified as EmailVerified,
                        created_at as CreatedAt,
                        updated_at as UpdatedAt,
                        last_login_at as LastLoginAt
                    FROM development.users 
                    ORDER BY created_at DESC");

                return users.ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all users");
                throw;
            }
        }

        public string GetConnectionString()
        {
            return _connectionString;
        }
    }
}