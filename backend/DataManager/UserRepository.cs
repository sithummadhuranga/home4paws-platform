using Home4Paws.API.Models.Entities;
using Home4Paws.API.Data;
using Microsoft.EntityFrameworkCore;

namespace Home4Paws.API.DataManager
{
    public class UserRepository(ApplicationDbContext context, ILogger<UserRepository> logger) : IUserRepository
    {
        private readonly ApplicationDbContext _context = context;
        private readonly ILogger<UserRepository> _logger = logger;

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == email && u.IsActive);

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
                return await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive);
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
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("User created successfully with ID: {UserId}", user.Id);
                return user.Id;
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
                var user = await _context.Users.FindAsync(userId);
                if (user != null)
                {
                    user.LastLoginAt = lastLoginAt;
                    user.UpdatedAt = DateTime.UtcNow;
                    
                    await _context.SaveChangesAsync();
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating last login for user: {UserId}", userId);
                throw;
            }
        }

        public async Task<bool> UpdateUserAsync(User user)
        {
            try
            {
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user: {UserId}", user.Id);
                throw;
            }
        }

        public async Task<bool> VerifyEmailAsync(int userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user != null)
                {
                    user.EmailVerified = true;
                    user.UpdatedAt = DateTime.UtcNow;
                    
                    await _context.SaveChangesAsync();
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying email for user: {UserId}", userId);
                throw;
            }
        }

        public async Task<bool> UpdatePasswordAsync(int userId, string newPasswordHash)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user != null)
                {
                    user.PasswordHash = newPasswordHash;
                    user.UpdatedAt = DateTime.UtcNow;
                    
                    await _context.SaveChangesAsync();
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating password for user: {UserId}", userId);
                throw;
            }
        }

        public async Task<bool> UpdatePasswordHashAsync(int userId, string passwordHash)
        {
            return await UpdatePasswordAsync(userId, passwordHash);
        }

        public async Task<int> CreateUserSessionAsync(UserSession session)
        {
            try
            {
                _context.UserSessions.Add(session);
                await _context.SaveChangesAsync();
                return session.Id;
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
                return await _context.UserSessions
                    .FirstOrDefaultAsync(s => s.RefreshToken == refreshToken && s.IsActive);
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
                var session = await _context.UserSessions
                    .FirstOrDefaultAsync(s => s.RefreshToken == refreshToken);
                
                if (session != null)
                {
                    session.IsActive = false;
                    session.UpdatedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                    return true;
                }
                return false;
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
                var sessions = await _context.UserSessions
                    .Where(s => s.UserId == userId && s.IsActive)
                    .ToListAsync();
                
                foreach (var session in sessions)
                {
                    session.IsActive = false;
                    session.UpdatedAt = DateTime.UtcNow;
                }
                
                await _context.SaveChangesAsync();
                return true;
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
                var expiredSessions = await _context.UserSessions
                    .Where(s => s.ExpiresAt < DateTime.UtcNow)
                    .ToListAsync();
                
                _context.UserSessions.RemoveRange(expiredSessions);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cleaning up expired sessions");
                throw;
            }
        }

        public async Task<bool> UpdateUserRoleAsync(int userId, string role)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user != null)
                {
                    user.Role = role;
                    user.UpdatedAt = DateTime.UtcNow;
                    
                    await _context.SaveChangesAsync();
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating role for user: {UserId}", userId);
                throw;
            }
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            try
            {
                return await _context.Users
                    .Where(u => u.IsActive)
                    .OrderBy(u => u.FirstName)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all users");
                throw;
            }
        }

        public async Task<bool> DeactivateUserAsync(int userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user != null)
                {
                    user.IsActive = false;
                    user.UpdatedAt = DateTime.UtcNow;
                    
                    await _context.SaveChangesAsync();
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deactivating user: {UserId}", userId);
                throw;
            }
        }

        public async Task<IEnumerable<User>> GetUsersAsync()
        {
            try
            {
                return await _context.Users
                    .Where(u => u.IsActive)
                    .OrderBy(u => u.FirstName)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting users");
                throw;
            }
        }

        public async Task<bool> UserExistsAsync(string email)
        {
            try
            {
                return await _context.Users
                    .AnyAsync(u => u.Email == email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking if user exists: {Email}", email);
                throw;
            }
        }

        public async Task<int> GetUserCountAsync()
        {
            try
            {
                return await _context.Users
                    .Where(u => u.IsActive)
                    .CountAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user count");
                throw;
            }
        }

        public async Task<IEnumerable<User>> SearchUsersAsync(string searchTerm)
        {
            try
            {
                return await _context.Users
                    .Where(u => u.IsActive && 
                        (u.FirstName.Contains(searchTerm) || 
                         u.LastName.Contains(searchTerm) || 
                         u.Email.Contains(searchTerm)))
                    .OrderBy(u => u.FirstName)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching users with term: {SearchTerm}", searchTerm);
                throw;
            }
        }
    }
}