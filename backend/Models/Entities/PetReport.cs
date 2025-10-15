using System;
using System.ComponentModel.DataAnnotations;

namespace Home4Paws.API.Models.Entities
{
    public class PetReport
    {
        public Guid Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Type { get; set; } // Cat, Dog, Other

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
        public string Age { get; set; }  // Puppy, Young, Adult, Senior

        [Required]
        [MaxLength(20)]
        public string Gender { get; set; } // Male, Female

        [Required]
        [MaxLength(100)]
        public string Size { get; set; } // Small, Medium, Large

        [MaxLength(1000)]
        public string Description { get; set; }

        [Required]
        [MaxLength(20)]
        public string ReportType { get; set; } // Lost or Found

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "Pending Confirmation";

        public DateTime DateReported { get; set; } = DateTime.UtcNow;

        [Required]
        public DateTime LostOrFoundDate { get; set; }

        [Required]
        [MaxLength(200)]
        public string Location { get; set; }

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        [Required]
        [MaxLength(100)]
        [RegularExpression(@"^[a-zA-Z\s]*$", ErrorMessage = "Contact name can only contain letters and spaces")]
        public string ContactName { get; set; }

        [Required]
        [MaxLength(10)]
        [MinLength(10)]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Phone number must be exactly 10 digits")]
        public string Phone { get; set; }

        [Required]
        [MaxLength(255)]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string[] PhotoUrls { get; set; }

        [MaxLength(1000)]
        public string IdentifyingFeatures { get; set; } // Distinctive marks, collar details, etc.

        [MaxLength(500)]
        public string MedicalConditions { get; set; } // Any known medical conditions

        public bool IsChipped { get; set; }
        public string ChipNumber { get; set; }

        public bool HasReward { get; set; }
        [MaxLength(20)]
        public string RewardAmount { get; set; }

        public int Views { get; set; } = 0;
        public bool IsUrgent { get; set; }
        public bool IsClosed { get; set; }
        public DateTime? ClosedAt { get; set; }
        public string ClosureReason { get; set; } // Found, Reunited, etc.

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        [MaxLength(500)]
        public string AdminNotes { get; set; }
    }
}