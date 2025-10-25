using Home4Paws.API.Models.Entities;
using Home4Paws.API.DataManager;

namespace Home4Paws.API.Services.Pets;

public class PetInquiryService : IPetInquiryService
{
    private readonly IPetInquiryRepository _repository;
    private readonly ILogger<PetInquiryService> _logger;

    public PetInquiryService(
        IPetInquiryRepository repository,
        ILogger<PetInquiryService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<PetInquiry?> GetByIdAsync(int id)
    {
        try
        {
            return await _repository.GetByIdAsync(id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving inquiry {Id}", id);
            throw;
        }
    }

    public async Task<List<PetInquiry>> GetThreadsByUserIdAsync(int userId, bool includeArchived = false)
    {
        try
        {
            return await _repository.GetThreadsByUserIdAsync(userId, includeArchived);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving inquiry threads for user {UserId}", userId);
            throw;
        }
    }

    public async Task<PetInquiry> CreateAsync(PetInquiry inquiry)
    {
        try
        {
            // Business validation
            if (string.IsNullOrWhiteSpace(inquiry.Message))
                throw new ArgumentException("Message is required");

            inquiry.CreatedAt = DateTime.UtcNow;
            inquiry.UpdatedAt = DateTime.UtcNow;
            inquiry.IsRead = false;

            // Generate thread ID if it's a new thread
            if (inquiry.ParentInquiryId == null)
            {
                inquiry.ThreadId = Guid.NewGuid().ToString();
            }

            return await _repository.CreateAsync(inquiry);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating inquiry");
            throw;
        }
    }

    public async Task<bool> MarkAsReadAsync(int inquiryId, int userId)
    {
        try
        {
            return await _repository.MarkAsReadAsync(inquiryId, userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking inquiry {InquiryId} as read", inquiryId);
            throw;
        }
    }

    public async Task<bool> MarkAsUnreadAsync(int inquiryId, int userId)
    {
        try
        {
            return await _repository.MarkAsUnreadAsync(inquiryId, userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking inquiry {InquiryId} as unread", inquiryId);
            throw;
        }
    }

    public async Task<bool> ArchiveAsync(int inquiryId, int userId)
    {
        try
        {
            return await _repository.ArchiveAsync(inquiryId, userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error archiving inquiry {InquiryId}", inquiryId);
            throw;
        }
    }

    public async Task<bool> UnarchiveAsync(int inquiryId, int userId)
    {
        try
        {
            return await _repository.UnarchiveAsync(inquiryId, userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error unarchiving inquiry {InquiryId}", inquiryId);
            throw;
        }
    }

    public async Task<Dictionary<string, object>> GetStatisticsAsync()
    {
        try
        {
            return await _repository.GetStatisticsAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving inquiry statistics");
            throw;
        }
    }
}
