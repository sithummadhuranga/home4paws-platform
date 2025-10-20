using System.Collections.Generic;
using System.Threading.Tasks;
using Home4Paws.API.Models.Entities;

namespace Home4Paws.API.DataManager
{
    public interface IAdoptionApplicationRepository
    {
        Task<AdoptionApplication?> GetByIdAsync(int id);
        Task<IEnumerable<AdoptionApplication>> GetByListingAsync(int listingId);
        Task<IEnumerable<AdoptionApplication>> GetByApplicantAsync(int userId);
        Task AddAsync(AdoptionApplication application);
        Task UpdateAsync(AdoptionApplication application);
        Task<bool> ExistsAsync(int id);
    }
}


