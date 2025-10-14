using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Home4Paws.API.Models.Pets;

namespace Home4Paws.API.Services.Pets
{
    public interface IPetReportService
    {
        Task<IEnumerable<PetReportResponse>> GetAllAsync(PetReportSearchParams searchParams);
        Task<PetReportResponse> GetByIdAsync(Guid id);
        Task<PetReportResponse> CreateAsync(CreatePetReportRequest request);
        Task<PetReportResponse> UpdateAsync(Guid id, UpdatePetReportRequest request);
        Task DeleteAsync(Guid id);
        Task<PetReportStatistics> GetStatisticsAsync();
    }
}