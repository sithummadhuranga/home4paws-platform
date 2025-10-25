using System;

namespace Home4Paws.API.Models.Entities
{
    public class AdoptionApplication
    {
        public int Id { get; set; }
        public int ListingId { get; set; }
        public AdoptionListing Listing { get; set; } = null!;
        public int ApplicantId { get; set; }
        public User Applicant { get; set; } = null!;

        // Applicant Info
        public string ApplicantName { get; set; } = string.Empty;
        public string ApplicantPhone { get; set; } = string.Empty;
        public string ApplicantEmail { get; set; } = string.Empty;
        public string ApplicantAddress { get; set; } = string.Empty;

        // Housing
        public string? HousingType { get; set; } // House, Apartment, Farm
        public bool HasYard { get; set; }
        public string? OtherPets { get; set; }
        public int? HouseholdMembers { get; set; }
        public bool HasChildren { get; set; }

        // Motivation & Experience
        public string? PetExperience { get; set; }
        public string WhyAdopt { get; set; } = string.Empty;

        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected, Withdrawn
        public string? OwnerNotes { get; set; }

        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReviewedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}


