using Home4Paws.API.Models.Entities;
using Home4Paws.API.DTOs;
using Home4Paws.API.DataManager;

namespace Home4Paws.API.Services.Pets;

public class PetListingService : IPetListingService
{
    private readonly IPetListingRepository _repository;
    private readonly ILogger<PetListingService> _logger;

    public PetListingService(
        IPetListingRepository repository,
        ILogger<PetListingService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<PetListing?> GetByIdAsync(Guid id)
    {
        try
        {
            return await _repository.GetByIdAsync(id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving pet listing {Id}", id);
            throw;
        }
    }

    public async Task<PagedResult<PetListing>> GetAllAsync(PetListingSearchParams searchParams)
    {
        try
        {
            return await _repository.GetAllAsync(searchParams);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving pet listings");
            throw;
        }
    }

    public async Task<List<PetListing>> GetNearbyAsync(double latitude, double longitude, double radiusKm, PetListingSearchParams filters)
    {
        try
        {
            return await _repository.GetNearbyAsync(latitude, longitude, radiusKm, filters);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving nearby pet listings");
            throw;
        }
    }

    public async Task<PetListing> CreateAsync(PetListing petListing)
    {
        try
        {
            // Business validation
            if (string.IsNullOrWhiteSpace(petListing.Name))
                throw new ArgumentException("Pet name is required");

            petListing.CreatedAt = DateTime.UtcNow;
            petListing.UpdatedAt = DateTime.UtcNow;
            petListing.Status = "Pending"; // Default status for new listings

            return await _repository.CreateAsync(petListing);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating pet listing");
            throw;
        }
    }

    public async Task<PetListing?> UpdateAsync(Guid id, PetListing petListing)
    {
        try
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                return null;

            // Update fields
            existing.Name = petListing.Name;
            existing.Species = petListing.Species;
            existing.Breed = petListing.Breed;
            existing.Description = petListing.Description;
            existing.UpdatedAt = DateTime.UtcNow;

            return await _repository.UpdateAsync(existing);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating pet listing {Id}", id);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        try
        {
            return await _repository.DeleteAsync(id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting pet listing {Id}", id);
            throw;
        }
    }

    public async Task<Dictionary<string, int>> GetStatisticsAsync()
    {
        try
        {
            return await _repository.GetCountBySpeciesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving pet listing statistics");
            throw;
        }
    }
}
