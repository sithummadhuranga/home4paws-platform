using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Home4Paws.API.Models.Entities
{
    [Table("pet_listings", Schema = "development")]
    public class PetListing
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Required]
        [StringLength(100)]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        [Column("species")]
        public string Species { get; set; } = string.Empty;

        [StringLength(100)]
        [Column("breed")]
        public string? Breed { get; set; }

        [Column("age_years")]
        public int? AgeYears { get; set; }

        [Column("age_months")]
        public int? AgeMonths { get; set; }

        [Required]
        [StringLength(20)]
        [Column("gender")]
        public string Gender { get; set; } = string.Empty;

        [StringLength(50)]
        [Column("size")]
        public string? Size { get; set; }

        [StringLength(100)]
        [Column("color")]
        public string? Color { get; set; }

        [Column("weight_kg")]
        public decimal? WeightKg { get; set; }

        [Required]
        [StringLength(20)]
        [Column("listing_type")]
        public string ListingType { get; set; } = string.Empty;

        [Column("price")]
        public decimal? Price { get; set; }

        [Required]
        [Column("description")]
        public string Description { get; set; } = string.Empty;

        [Column("is_vaccinated")]
        public bool IsVaccinated { get; set; } = false;

        [Column("is_neutered")]
        public bool IsNeutered { get; set; } = false;

        [Column("is_microchipped")]
        public bool IsMicrochipped { get; set; } = false;

        [StringLength(50)]
        [Column("microchip_number")]
        public string? MicrochipNumber { get; set; }

        [Column("health_conditions")]
        public string? HealthConditions { get; set; }

        [Column("temperament")]
        public string? Temperament { get; set; }

        [Column("good_with_kids")]
        public bool? GoodWithKids { get; set; }

        [Column("good_with_dogs")]
        public bool? GoodWithDogs { get; set; }

        [Column("good_with_cats")]
        public bool? GoodWithCats { get; set; }

        [StringLength(50)]
        [Column("training_level")]
        public string? TrainingLevel { get; set; }

        [Required]
        [StringLength(200)]
        [Column("location")]
        public string Location { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        [Column("city")]
        public string City { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        [Column("province")]
        public string Province { get; set; } = string.Empty;

        [Column("latitude")]
        public double? Latitude { get; set; }

        [Column("longitude")]
        public double? Longitude { get; set; }

        [Required]
        [StringLength(100)]
        [Column("contact_name")]
        public string ContactName { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        [Column("contact_phone")]
        public string ContactPhone { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        [Column("contact_email")]
        public string ContactEmail { get; set; } = string.Empty;

        [StringLength(50)]
        [Column("contact_preference")]
        public string? ContactPreference { get; set; }

        [Column("photo_urls")]
        public List<string>? PhotoUrls { get; set; }

        [StringLength(500)]
        [Column("video_url")]
        public string? VideoUrl { get; set; }

        [Required]
        [StringLength(50)]
        [Column("status")]
        public string Status { get; set; } = "Pending";

        [Column("admin_notes")]
        public string? AdminNotes { get; set; }

        [Column("rejection_reason")]
        public string? RejectionReason { get; set; }

        [Column("approved_by")]
        public int? ApprovedBy { get; set; }

        [Column("approved_at")]
        public DateTime? ApprovedAt { get; set; }

        [Column("is_featured")]
        public bool IsFeatured { get; set; } = false;

        [Column("is_urgent")]
        public bool IsUrgent { get; set; } = false;

        [Column("special_needs")]
        public string? SpecialNeeds { get; set; }

        [Column("adoption_fee")]
        public decimal? AdoptionFee { get; set; }

        [Column("requires_home_visit")]
        public bool RequiresHomeVisit { get; set; } = false;

        [Column("views")]
        public int Views { get; set; } = 0;

        [Column("inquiries_count")]
        public int InquiriesCount { get; set; } = 0;

        [Column("expires_at")]
        public DateTime? ExpiresAt { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [Column("adopted_at")]
        public DateTime? AdoptedAt { get; set; }

        // Navigation Properties
        [ForeignKey("UserId")]
        public User? User { get; set; }

        [ForeignKey("ApprovedBy")]
        public User? ApprovedByUser { get; set; }

        public ICollection<PetInquiry>? Inquiries { get; set; }
        public ICollection<PetFavorite>? Favorites { get; set; }
        public ICollection<PetPhoto>? Photos { get; set; }
    }
}
