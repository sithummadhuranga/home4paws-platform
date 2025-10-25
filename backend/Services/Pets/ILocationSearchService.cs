using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Home4Paws.API.Models.Pets;

namespace Home4Paws.API.Services.Pets
{
    public interface ILocationSearchService
    {
        Task<IEnumerable<PetReportResponse>> SearchByRadius(double latitude, double longitude, double radiusKm, PetReportSearchParams filters);
        Task<IEnumerable<string>> GetNearbyLocations(string partialLocation);
        Task<Dictionary<string, int>> GetHotspotAreas();
    }
}