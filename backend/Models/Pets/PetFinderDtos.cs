using System;

namespace Home4Paws.API.Models.Pets
{
    /// <summary>
    /// Simplified DTO for public Pet Finder page (anonymized contact info)
    /// </summary>
    public class PetFinderDto
    {
        public Guid Id { get; set; }
        public string Type { get; set; } = string.Empty; // "lost" or "found"
        public string PetName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty; // First photo
        public string[] AllImages { get; set; } = Array.Empty<string>(); // All photos
        public string ContactInfo { get; set; } = string.Empty; // Phone/Email (anonymized)
        public string Location { get; set; } = string.Empty;
        public DateTime DateReported { get; set; }
        public DateTime LostOrFoundDate { get; set; }
        public string Breed { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public string Size { get; set; } = string.Empty;
        public string Age { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public bool HasReward { get; set; }
        public string RewardAmount { get; set; } = string.Empty;
        public bool IsUrgent { get; set; }
        public int Views { get; set; }
    }

    /// <summary>
    /// DTO for user's own reports in profile "Raised Tickets" section
    /// </summary>
    public class UserPetReportDto
    {
        public Guid Id { get; set; }
        public string Type { get; set; } = string.Empty; // "lost" or "found"
        public string PetName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty; // First photo
        public string Status { get; set; } = string.Empty; // pending, active, resolved, archived
        public DateTime DateReported { get; set; }
        public DateTime LostOrFoundDate { get; set; }
        public string Location { get; set; } = string.Empty;
        public int Views { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? AdminNotes { get; set; }
    }

    /// <summary>
    /// DTO for admin dashboard reports management
    /// </summary>
    public class AdminPetReportDto
    {
        public Guid Id { get; set; }
        public string Type { get; set; } = string.Empty; // "lost" or "found"
        public string PetName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty; // First photo
        public string Status { get; set; } = string.Empty; // pending, active, resolved, archived
        public DateTime DateReported { get; set; }
        public string Location { get; set; } = string.Empty;
        public string ContactName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool IsUrgent { get; set; }
        public int Views { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? AdminNotes { get; set; }
    }
}