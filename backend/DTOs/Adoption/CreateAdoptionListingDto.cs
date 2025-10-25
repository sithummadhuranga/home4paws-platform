using System.ComponentModel.DataAnnotations;

namespace Home4Paws.API.DTOs
{
    public class CreateAdoptionListingDto
    {
        [Required]
        [MaxLength(100)]
        public string PetName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string PetType { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Breed { get; set; }

        [Range(0, 30)]
        public int? AgeYears { get; set; }

        [Range(0, 11)]
        public int? AgeMonths { get; set; }

        [Required]
        [MaxLength(20)]
        public string Gender { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Size { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Color { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string? Description { get; set; }

        public string? HealthStatus { get; set; }
        public string? VaccinationStatus { get; set; }
        public bool IsSpayedNeutered { get; set; }
        public bool IsHouseTrained { get; set; }
        public bool GoodWithKids { get; set; }
        public bool GoodWithPets { get; set; }
        public string? EnergyLevel { get; set; }
        public string? SpecialNeeds { get; set; }

        [Required]
        [MaxLength(20)]
        public string AdoptionType { get; set; } = "Free";

        [Range(0, 100000)]
        public decimal AdoptionFee { get; set; }

        public string? RehomingReason { get; set; }

        [Required]
        [MaxLength(100)]
        public string ContactName { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string ContactPhone { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        [EmailAddress]
        public string ContactEmail { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Location { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string City { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Province { get; set; } = string.Empty;

        public string? District { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        [Required]
        public string[] PhotoUrls { get; set; } = [];

        public string? VideoUrl { get; set; }
    }
}


