using System.Collections.Generic;
using System.Threading.Tasks;
using Home4Paws.API.DTOs;

namespace Home4Paws.API.Services.Adoption
{
    public interface IAdoptionApplicationService
    {
        Task<AdoptionApplicationDto> Submit(int userId, CreateAdoptionApplicationDto dto);
        Task<IEnumerable<AdoptionApplicationDto>> GetByListing(int listingId, int ownerId);
        Task<IEnumerable<AdoptionApplicationDto>> GetMyApplications(int userId);
        Task<bool> UpdateStatus(int applicationId, int ownerId, string status, string? ownerNotes);
        Task<bool> Withdraw(int applicationId, int userId);
    }
}
