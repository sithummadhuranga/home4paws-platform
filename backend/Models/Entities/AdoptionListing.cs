using System;

namespace Home4Paws.API.Models.Entities
{
    public class AdoptionListing
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public virtual User? User { get; set; }

        // Pet Information
        public string PetName { get; set; } = string.Empty;
        public string PetType { get; set; } = string.Empty; // Dog, Cat, Bird, etc.
        public string? Breed { get; set; }
        public int? AgeYears { get; set; }
        public int? AgeMonths { get; set; }
        public string Gender { get; set; } = string.Empty; // Male, Female
        public string Size { get; set; } = string.Empty; // Small, Medium, Large
        public string Color { get; set; } = string.Empty;
        public string? Description { get; set; }

        // Health & Behavior
        public string? HealthStatus { get; set; }
        public string? VaccinationStatus { get; set; }
        public bool IsSpayedNeutered { get; set; }
        public bool IsHouseTrained { get; set; }
        public bool GoodWithKids { get; set; }
        public bool GoodWithPets { get; set; }
        public string? EnergyLevel { get; set; } // Low, Medium, High
        public string? SpecialNeeds { get; set; }

        // Adoption Terms
        public string AdoptionType { get; set; } = "Free"; // Free, Paid
        public decimal AdoptionFee { get; set; }
        public string? RehomingReason { get; set; }

        // Contact Information
        public string ContactName { get; set; } = string.Empty;
        public string ContactPhone { get; set; } = string.Empty;
        public string ContactEmail { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string? District { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        // Media
        public string[] PhotoUrls { get; set; } = Array.Empty<string>();
        public string? VideoUrl { get; set; }

        // Moderation & Status
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected, Adopted, Closed
        public string? AdminNotes { get; set; }
        public string? RejectionReason { get; set; }
        public int? ApprovedByAdminId { get; set; }
        public DateTime? ApprovedAt { get; set; }

        // Metrics
        public int Views { get; set; }
        public int FavoritesCount { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsUrgent { get; set; }

        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? AdoptedAt { get; set; }
    }
}


