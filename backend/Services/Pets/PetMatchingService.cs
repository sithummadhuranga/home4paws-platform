using System;
using System.Threading.Tasks;
using Home4Paws.API.Models.Pets;
using Microsoft.Extensions.Logging;

namespace Home4Paws.API.Services.Pets
{
    public interface IPetMatchingService
    {
        Task<IEnumerable<PetReportResponse>> FindPotentialMatches(Guid reportId);
        Task<bool> SubmitMatch(PetReportMatchRequest request);
        Task ProcessNewReport(PetReportResponse report);
        Task UpdateMatchStatus(Guid reportId, string status);
    }

    public class PetMatchingService : IPetMatchingService
    {
        private readonly IPetReportService _reportService;
        private readonly ILogger<PetMatchingService> _logger;

        public PetMatchingService(IPetReportService reportService, ILogger<PetMatchingService> logger)
        {
            _reportService = reportService;
            _logger = logger;
        }

        public async Task<IEnumerable<PetReportResponse>> FindPotentialMatches(Guid reportId)
        {
            var report = await _reportService.GetByIdAsync(reportId);
            if (report == null) return new List<PetReportResponse>();

            // Get reports of opposite type (lost/found)
            var searchParams = new PetReportSearchFilters
            {
                Type = report.Type,
                ReportType = report.ReportType == "Lost" ? "Found" : "Lost",
                FromDate = report.LostOrFoundDate.AddDays(-7), // Look for matches within a week
                ToDate = report.LostOrFoundDate.AddDays(7),
                Location = report.Location,
                RadiusKm = 10 // Search within 10km radius
            };

            var potentialMatches = await _reportService.GetAllAsync(searchParams);
            
            // Filter and score matches based on:
            // - Physical characteristics match
            // - Temporal proximity
            // - Geographical proximity
            // - Additional identifying features

            return potentialMatches.Where(m => 
                m.Color.ToLower().Contains(report.Color.ToLower()) ||
                report.Color.ToLower().Contains(m.Color.ToLower()) ||
                (m.Breed != null && report.Breed != null && 
                 m.Breed.ToLower() == report.Breed.ToLower())
            ).OrderByDescending(m => m.CreatedAt);
        }

        public async Task<bool> SubmitMatch(PetReportMatchRequest request)
        {
            try
            {
                var report = await _reportService.GetByIdAsync(request.ReportId);
                if (report == null) return false;

                // TODO: Send notification to original reporter
                // TODO: Store match request in database
                // TODO: Send confirmation email to both parties

                _logger.LogInformation($"Match submitted for report {request.ReportId}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error submitting match: {ex.Message}");
                return false;
            }
        }

        public async Task ProcessNewReport(PetReportResponse report)
        {
            try
            {
                // Find potential matches
                var matches = await FindPotentialMatches(report.Id);

                // If urgent case, prioritize notifications
                if (matches.Any() && report.IsUrgent)
                {
                    // TODO: Send immediate notifications
                }

                // Store potential matches for later reference
                foreach (var match in matches)
                {
                    // TODO: Store match suggestions
                }

                _logger.LogInformation($"Processed new report {report.Id}, found {matches.Count()} potential matches");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error processing new report: {ex.Message}");
            }
        }

        public async Task UpdateMatchStatus(Guid reportId, string status)
        {
            try
            {
                // TODO: Update match status and notify relevant parties
                _logger.LogInformation($"Updated match status for report {reportId} to {status}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating match status: {ex.Message}");
            }
        }
    }
}