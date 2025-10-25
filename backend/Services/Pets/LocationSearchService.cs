using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using Home4Paws.API.Models.Entities;
using Home4Paws.API.Models.Pets;
using Home4Paws.API.Data;
using Microsoft.Extensions.Logging;

namespace Home4Paws.API.Services.Pets
{
    public class LocationSearchService : ILocationSearchService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<LocationSearchService> _logger;
        private readonly GeometryFactory _geometryFactory;

        public LocationSearchService(
            ApplicationDbContext context,
            ILogger<LocationSearchService> logger)
        {
            _context = context;
            _logger = logger;
            _geometryFactory = new GeometryFactory(new PrecisionModel(), 4326); // SRID 4326 for WGS84
        }

        public async Task<IEnumerable<PetReportResponse>> SearchByRadius(double latitude, double longitude, double radiusKm, PetReportSearchParams searchParams)
        {
            if (radiusKm <= 0)
            {
                throw new ArgumentException("Radius must be greater than 0", nameof(radiusKm));
            }

            // Base query
            var query = _context.PetReports
                .AsNoTracking()
                .Where(r => r.Status == "Active");

            // Apply type filter
            if (!string.IsNullOrEmpty(searchParams.ReportType))
            {
                query = query.Where(r => r.ReportType == searchParams.ReportType);
            }

            // Apply pet type filter
            if (!string.IsNullOrEmpty(searchParams.Type))
            {
                query = query.Where(r => r.Type == searchParams.Type);
            }

            // Apply date range filter
            if (searchParams.FromDate.HasValue)
            {
                query = query.Where(r => r.LostOrFoundDate >= searchParams.FromDate);
            }

            if (searchParams.ToDate.HasValue)
            {
                query = query.Where(r => r.LostOrFoundDate <= searchParams.ToDate);
            }

            // Apply location filter
            if (!string.IsNullOrEmpty(searchParams.Location))
            {
                query = query.Where(r => r.Location == searchParams.Location);
            }

            try
            {
                var radiusMeters = radiusKm * 1000;
                var searchPoint = _geometryFactory.CreatePoint(new Coordinate(longitude, latitude));

                // Fetch candidates with coordinates
                var candidates = await query
                    .Where(r => r.Latitude.HasValue && r.Longitude.HasValue)
                    .ToListAsync();

                // Filter by distance using NetTopologySuite on the client side
                var filtered = candidates
                    .Select(r =>
                    {
                        var point = _geometryFactory.CreatePoint(new Coordinate(r.Longitude.Value, r.Latitude.Value));
                        var distance = point.Distance(searchPoint);
                        return new { Report = r, Distance = distance };
                    })
                    .Where(x => x.Distance <= radiusMeters)
                    .OrderBy(x => x.Distance)
                    .Select(x => x.Report)
                    .ToList();

                // Map to response DTOs
                return filtered.Select(r => new PetReportResponse
                {
                    Id = r.Id,
                    Type = r.Type,
                    Name = r.Name,
                    Breed = r.Breed,
                    Color = r.Color,
                    Age = r.Age,
                    Gender = r.Gender,
                    Size = r.Size,
                    Description = r.Description,
                    ReportType = r.ReportType,
                    Status = r.Status,
                    DateReported = r.DateReported,
                    LostOrFoundDate = r.LostOrFoundDate,
                    Location = r.Location,
                    PhotoUrls = r.PhotoUrls,
                    IsUrgent = r.IsUrgent,
                    Views = r.Views,
                    Latitude = r.Latitude,
                    Longitude = r.Longitude
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SearchByRadius. Latitude: {Latitude}, Longitude: {Longitude}, Radius: {RadiusKm}km",
                    latitude, longitude, radiusKm);
                throw;
            }
        }

        public async Task<IEnumerable<string>> GetNearbyLocations(string partialLocation)
        {
            if (string.IsNullOrEmpty(partialLocation))
                return Array.Empty<string>();

            try
            {
                return await _context.PetReports
                    .Where(r => r.Location.Contains(partialLocation, StringComparison.OrdinalIgnoreCase))
                    .Select(r => r.Location)
                    .Distinct()
                    .Take(10)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetNearbyLocations. PartialLocation: {PartialLocation}", partialLocation);
                throw;
            }
        }

        public async Task<Dictionary<string, int>> GetHotspotAreas()
        {
            try
            {
                return await _context.PetReports
                    .Where(r => r.Status == "Active")
                    .GroupBy(r => r.Location)
                    .Select(g => new
                    {
                        Location = g.Key,
                        Count = g.Count()
                    })
                    .OrderByDescending(x => x.Count)
                    .Take(10)
                    .ToDictionaryAsync(x => x.Location, x => x.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetHotspotAreas");
                throw;
            }
        }
    }
}