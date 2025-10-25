using Home4Paws.API.Models.Entities;
using Home4Paws.API.DTOs;

namespace Home4Paws.API.DataManager;

public interface IPetListingRepository
{
    Task<PetListing?> GetByIdAsync(Guid id);
    Task<PetListing> CreateAsync(PetListing petListing);
    Task<PetListing?> UpdateAsync(PetListing petListing);
    Task<bool> DeleteAsync(Guid id);
    Task<PagedResult<PetListing>> GetAllAsync(PetListingSearchParams searchParams);
    Task<List<PetListing>> GetByUserIdAsync(int userId);
    Task<List<PetListing>> GetFeaturedAsync(int limit = 10);
    Task<List<PetListing>> GetSimilarAsync(Guid petListingId, int limit = 6);
    Task<List<PetListing>> GetNearbyAsync(double latitude, double longitude, double radiusKm, PetListingSearchParams filters);
    Task<int> GetTotalCountAsync(PetListingSearchParams? filters = null);
    Task<Dictionary<string, int>> GetCountBySpeciesAsync();
    Task<Dictionary<string, int>> GetCountByProvinceAsync();
    Task<List<PetListing>> GetPendingAsync();
    Task<List<PetListing>> GetByStatusAsync(string status);
    Task IncrementViewCountAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task<bool> IsOwnerAsync(Guid petListingId, int userId);
    Task<bool> AddToFavoritesAsync(int userId, Guid petListingId);
    Task<bool> RemoveFromFavoritesAsync(int userId, Guid petListingId);
    Task<List<PetListing>> GetUserFavoritesAsync(int userId);
    Task<bool> IsFavoritedAsync(int userId, Guid petListingId);
}

public interface IPetInquiryRepository
{
    Task<PetInquiry?> GetByIdAsync(int id);
    Task<List<PetInquiry>> GetByPetListingIdAsync(Guid petListingId);
    Task<List<PetInquiry>> GetBySenderIdAsync(int senderId);
    Task<List<PetInquiry>> GetThreadsByUserIdAsync(int userId, bool includeArchived = false);
    Task<List<PetInquiry>> GetThreadByListingIdAsync(Guid petListingId, int userId);
    Task<PetInquiry> CreateAsync(PetInquiry inquiry);
    Task<PetInquiry> UpdateAsync(PetInquiry inquiry);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
    Task<int> GetUnreadCountAsync(int userId);
    Task<bool> MarkAsReadAsync(int inquiryId, int userId);
    Task<bool> MarkAsUnreadAsync(int inquiryId, int userId);
    Task<bool> ArchiveAsync(int inquiryId, int userId);
    Task<bool> UnarchiveAsync(int inquiryId, int userId);
    Task<Dictionary<string, object>> GetStatisticsAsync();
}

public interface IPetFavoriteRepository
{
    Task<PetFavorite?> GetByIdAsync(int id);
    Task<PetFavorite?> GetByUserAndPetListingAsync(int userId, Guid petListingId);
    Task<List<PetFavorite>> GetByUserIdAsync(int userId);
    Task<List<PetFavorite>> GetByPetListingIdAsync(Guid petListingId);
    Task<PetFavorite> CreateAsync(PetFavorite favorite);
    Task<bool> DeleteAsync(int id);
    Task<bool> DeleteByUserAndPetListingAsync(int userId, Guid petListingId);
    Task<bool> ExistsAsync(int userId, Guid petListingId);
    Task<int> GetCountByPetListingIdAsync(Guid petListingId);
}
