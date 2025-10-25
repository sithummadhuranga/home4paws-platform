namespace Home4Paws.API.Queries
{
    public static class AuthQueries
    {
        // Add schema to all queries
        private const string Schema = "development";
        
        public static string GetUserByEmail() => $@"
            SELECT 
                id, first_name, last_name, email, password_hash, role, 
                is_active, email_verified, created_at, updated_at, last_login_at
            FROM {Schema}.users 
            WHERE email = @Email AND is_active = true";

        public static string GetUserById() => $@"
            SELECT 
                id, first_name, last_name, email, password_hash, role, 
                is_active, email_verified, created_at, updated_at, last_login_at
            FROM {Schema}.users 
            WHERE id = @UserId AND is_active = true";

        public static string CreateUser() => $@"
            INSERT INTO {Schema}.users 
            (first_name, last_name, email, password_hash, role, is_active, email_verified, created_at, updated_at)
            VALUES 
            (@FirstName, @LastName, @Email, @PasswordHash, @Role, @IsActive, @EmailVerified, @CreatedAt, @UpdatedAt)
            RETURNING id";

        public static string UpdateLastLogin() => $@"
            UPDATE {Schema}.users 
            SET last_login_at = @LastLoginAt, updated_at = @UpdatedAt
            WHERE id = @UserId";

        public static string CreateUserSession() => $@"
            INSERT INTO {Schema}.user_sessions 
            (user_id, token, refresh_token, expires_at, created_at, is_active, device_info, ip_address)
            VALUES 
            (@UserId, @Token, @RefreshToken, @ExpiresAt, @CreatedAt, @IsActive, @DeviceInfo, @IpAddress)
            RETURNING id";

        public static string GetUserSession() => $@"
            SELECT 
                us.id, us.user_id, us.token, us.refresh_token, us.expires_at, 
                us.created_at, us.is_active, us.device_info, us.ip_address,
                u.id as user_id, u.first_name, u.last_name, u.email, u.role, 
                u.is_active as user_active, u.email_verified, u.created_at as user_created_at, 
                u.updated_at, u.last_login_at
            FROM {Schema}.user_sessions us
            INNER JOIN {Schema}.users u ON us.user_id = u.id
            WHERE us.refresh_token = @RefreshToken AND us.is_active = true";

        public static string DeactivateUserSession() => $@"
            UPDATE {Schema}.user_sessions 
            SET is_active = false
            WHERE refresh_token = @RefreshToken";

        public static string DeactivateAllUserSessions() => $@"
            UPDATE {Schema}.user_sessions 
            SET is_active = false
            WHERE user_id = @UserId AND is_active = true";

        public static string CleanupExpiredSessions() => $@"
            DELETE FROM {Schema}.user_sessions 
            WHERE expires_at < @CurrentTime";
    }
}