using Home4Paws.API.Models.Entities;
using Home4Paws.API.DTOs;

namespace Home4Paws.API.Services.Pets;

public interface IPetListingService
{
    Task<PetListing?> GetByIdAsync(Guid id);
    Task<PagedResult<PetListing>> GetAllAsync(PetListingSearchParams searchParams);
    Task<List<PetListing>> GetNearbyAsync(double latitude, double longitude, double radiusKm, PetListingSearchParams filters);
    Task<PetListing> CreateAsync(PetListing petListing);
    Task<PetListing?> UpdateAsync(Guid id, PetListing petListing);
    Task<bool> DeleteAsync(Guid id);
    Task<Dictionary<string, int>> GetStatisticsAsync();
}
