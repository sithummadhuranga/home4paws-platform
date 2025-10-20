using System;

namespace Home4Paws.API.DTOs
{
    public class AdoptionListingDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string PetName { get; set; } = string.Empty;
        public string PetType { get; set; } = string.Empty;
        public string? Breed { get; set; }
        public int? AgeYears { get; set; }
        public int? AgeMonths { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string Size { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public string? Description { get; set; }

        public string? HealthStatus { get; set; }
        public string? VaccinationStatus { get; set; }
        public bool IsSpayedNeutered { get; set; }
        public bool IsHouseTrained { get; set; }
        public bool GoodWithKids { get; set; }
        public bool GoodWithPets { get; set; }
        public string? EnergyLevel { get; set; }
        public string? SpecialNeeds { get; set; }

        public string AdoptionType { get; set; } = "Free";
        public decimal AdoptionFee { get; set; }
        public string? RehomingReason { get; set; }

        public string ContactName { get; set; } = string.Empty;
        public string ContactPhone { get; set; } = string.Empty;
        public string ContactEmail { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string? District { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        public string[] PhotoUrls { get; set; } = Array.Empty<string>();
        public string? VideoUrl { get; set; }

        public string Status { get; set; } = string.Empty;
        public bool IsFeatured { get; set; }
        public bool IsUrgent { get; set; }
        public int Views { get; set; }
        public int FavoritesCount { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}


