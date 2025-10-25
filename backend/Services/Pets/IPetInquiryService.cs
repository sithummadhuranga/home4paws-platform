using Home4Paws.API.Models.Entities;

namespace Home4Paws.API.Services.Pets;

public interface IPetInquiryService
{
    Task<PetInquiry?> GetByIdAsync(int id);
    Task<List<PetInquiry>> GetThreadsByUserIdAsync(int userId, bool includeArchived = false);
    Task<PetInquiry> CreateAsync(PetInquiry inquiry);
    Task<bool> MarkAsReadAsync(int inquiryId, int userId);
    Task<bool> MarkAsUnreadAsync(int inquiryId, int userId);
    Task<bool> ArchiveAsync(int inquiryId, int userId);
    Task<bool> UnarchiveAsync(int inquiryId, int userId);
    Task<Dictionary<string, object>> GetStatisticsAsync();
}
