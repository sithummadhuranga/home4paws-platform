using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Home4Paws.API.Models.Pets
{
    public class CreatePetReportRequest
    {
        [Required]
        [MaxLength(50)]
        public string Type { get; set; }

        [MaxLength(100)]
        public string Breed { get; set; }

        [Required]
        [MaxLength(100)]
        public string Color { get; set; }

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
    }

    public class UpdatePetReportRequest
    {
        [MaxLength(100)]
        public string Breed { get; set; }

        [MaxLength(100)]
        public string Color { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; }

        [MaxLength(200)]
        public string Location { get; set; }

        [MaxLength(100)]
        [RegularExpression(@"^[a-zA-Z\s]*$")]
        public string ContactName { get; set; }

        [MaxLength(10)]
        [MinLength(10)]
        [RegularExpression(@"^\d{10}$")]
        public string Phone { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [MaxLength(3)]
        public IFormFile[] NewPhotos { get; set; }
    }

    public class PetReportResponse
    {
        public Guid Id { get; set; }
        public string Type { get; set; }
        public string Name { get; set; }
        public string Breed { get; set; }
        public string Color { get; set; }
        public string Age { get; set; }
        public string Gender { get; set; }
        public string Size { get; set; }
        public string Description { get; set; }
        public string ReportType { get; set; }
        public string Status { get; set; }
        public DateTime DateReported { get; set; }
        public DateTime LostOrFoundDate { get; set; }
        public string Location { get; set; }
        public string ContactName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string[] PhotoUrls { get; set; }
        public string IdentifyingFeatures { get; set; }
        public string MedicalConditions { get; set; }
        public bool IsChipped { get; set; }
        public string ChipNumber { get; set; }
        public bool HasReward { get; set; }
        public string RewardAmount { get; set; }
        public int Views { get; set; }
        public bool IsUrgent { get; set; }
        public bool IsClosed { get; set; }
        public DateTime? ClosedAt { get; set; }
        public string ClosureReason { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public double? Distance { get; set; }
    }

    public class PetReportSearchParams
    {
        public string Type { get; set; }
        public string ReportType { get; set; }
        public string Location { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string Status { get; set; }
    }
}