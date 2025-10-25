using System.Collections.Generic;
using System.Threading.Tasks;
using Home4Paws.API.DTOs;

namespace Home4Paws.API.Services.Adoption
{
    public interface IAdoptionService
    {
        // Public browse
        Task<(IEnumerable<AdoptionListingDto> Listings, int Total)> GetApprovedListings(string? petType, string? city, int page, int pageSize);
        Task<AdoptionListingDto?> GetById(int id);

        // User actions
        Task<IEnumerable<AdoptionListingDto>> GetMyListings(int userId);
        Task<AdoptionListingDto> Create(int userId, CreateAdoptionListingDto dto);
        Task<AdoptionListingDto?> Update(int id, int userId, UpdateAdoptionListingDto dto);
        Task<bool> Delete(int id, int userId);
        Task<bool> MarkAsAdopted(int id, int userId);

        // Admin actions
        Task<IEnumerable<AdoptionListingDto>> GetAllForAdmin(string? status, int page, int pageSize);
        Task<IEnumerable<AdoptionListingDto>> GetPending(int page, int pageSize);
        Task<bool> Approve(int id, int adminId, string? notes);
        Task<bool> Reject(int id, int adminId, string reason);
        Task<bool> AdminDelete(int id);
    }
}
