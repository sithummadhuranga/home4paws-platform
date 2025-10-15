using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Home4Paws.API.Models.Entities;
using Home4Paws.API.Models.Pets;

namespace Home4Paws.API.DataManager
{
    public interface IPetReportRepository
    {
        Task<IEnumerable<PetReport>> GetAllAsync(PetReportSearchParams searchParams);
        Task<PetReport> GetByIdAsync(Guid id);
        Task<PetReport> CreateAsync(PetReport petReport);
        Task<PetReport> UpdateAsync(PetReport petReport);
        Task DeleteAsync(Guid id);
        Task<bool> ExistsAsync(Guid id);
        Task<bool> IsPendingAsync(Guid id);
    }
}