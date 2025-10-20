using System.Collections.Generic;
using System.Threading.Tasks;
using Home4Paws.API.Models.Entities;

namespace Home4Paws.API.DataManager
{
    public interface IAdoptionListingRepository
    {
        Task<AdoptionListing?> GetByIdAsync(int id);
        Task<IEnumerable<AdoptionListing>> GetApprovedAsync(string? petType, string? city, string? status, int page, int pageSize);
        Task<int> CountApprovedAsync(string? petType, string? city, string? status);
        Task<IEnumerable<AdoptionListing>> GetByUserAsync(int userId);
        Task<IEnumerable<AdoptionListing>> GetAllForAdminAsync(string? status, int page, int pageSize);
        Task<IEnumerable<AdoptionListing>> GetPendingAsync(int page, int pageSize);
        Task AddAsync(AdoptionListing listing);
        Task UpdateAsync(AdoptionListing listing);
        Task DeleteAsync(AdoptionListing listing);
        Task<bool> ExistsAsync(int id);
    }
}


