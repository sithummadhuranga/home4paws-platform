using Home4Paws.API.Models.Auth;

namespace Home4Paws.API.Services.Auth
{
    public interface IAuthService
    {
        Task<AuthResponse> LoginAsync(LoginRequest request, string ipAddress);
        Task<AuthResponse> SignupAsync(SignupRequest request, string ipAddress);
        Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request, string ipAddress);
        Task<LogoutResponse> LogoutAsync(LogoutRequest request);
        Task<UserInfo?> GetUserInfoAsync(int userId);
        Task<bool> CleanupExpiredSessionsAsync();
    }
}