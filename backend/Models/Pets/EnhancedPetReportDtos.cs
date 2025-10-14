using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Home4Paws.API.Models.Pets
{
    public class EnhancedPetReportRequest
    {
        [Required]
        [MaxLength(50)]
        public string Type { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [MaxLength(100)]
        public string Breed { get; set; }

        [Required]
        [MaxLength(100)]
        public string Color { get; set; }

        [Required]
        [MaxLength(20)]
        public string Age { get; set; }

        [Required]
        [MaxLength(20)]
        public string Gender { get; set; }

        [Required]
        [MaxLength(100)]
        public string Size { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; }

        [Required]
        [MaxLength(20)]
        public string ReportType { get; set; }

        [Required]
        public DateTime LostOrFoundDate { get; set; }

        [Required]
        [MaxLength(200)]
        public string Location { get; set; }

        [Required]
        [MaxLength(100)]
        [RegularExpression(@"^[a-zA-Z\s]*$")]
        public string ContactName { get; set; }

        [Required]
        [MaxLength(10)]
        [MinLength(10)]
        [RegularExpression(@"^\d{10}$")]
        public string Phone { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(3)]
        public IFormFile[] Photos { get; set; }

        [MaxLength(1000)]
        public string IdentifyingFeatures { get; set; }

        [MaxLength(500)]
        public string MedicalConditions { get; set; }

        public bool IsChipped { get; set; }
        public string ChipNumber { get; set; }

        public bool HasReward { get; set; }
        [MaxLength(20)]
        public string RewardAmount { get; set; }

        public bool IsUrgent { get; set; }

        // For found pets
        public string[] MatchingQuestions { get; set; } // Questions to verify ownership
    }

    public class PetReportMatchRequest
    {
        public Guid ReportId { get; set; }
        public string[] AnswersToVerification { get; set; }
        public string AdditionalNotes { get; set; }
        public string ContactPreference { get; set; } // Phone, Email, Both
    }

    public class PetReportStatusUpdate
    {
        [Required]
        public string Status { get; set; }
        public string ClosureReason { get; set; }
        public string AdminNotes { get; set; }
    }

    public class PetReportSearchFilters : PetReportSearchParams
    {
        public bool? IsUrgent { get; set; }
        public bool? IsChipped { get; set; }
        public bool? HasReward { get; set; }
        public bool? IsClosed { get; set; }
        public string Size { get; set; }
        public string Age { get; set; }
        public string Gender { get; set; }
        public int? DaysAgo { get; set; }
        public double? RadiusKm { get; set; }
        public string[] Types { get; set; }
    }

    public class PetReportStatistics
    {
        public int TotalReports { get; set; }
        public int ActiveReports { get; set; }
        public int SuccessfulReunions { get; set; }
        public Dictionary<string, int> ReportsByType { get; set; }
        public Dictionary<string, int> ReportsByStatus { get; set; }
        public Dictionary<string, int> ReportsByLocation { get; set; }
        public int UrgentCases { get; set; }
        public double AverageTimeToReunion { get; set; }
    }
}