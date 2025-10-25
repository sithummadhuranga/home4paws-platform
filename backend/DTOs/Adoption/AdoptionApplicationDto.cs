using System;

namespace Home4Paws.API.DTOs
{
    public class AdoptionApplicationDto
    {
        public int Id { get; set; }
        public int ListingId { get; set; }
        public int ApplicantId { get; set; }

        public string ApplicantName { get; set; } = string.Empty;
        public string ApplicantPhone { get; set; } = string.Empty;
        public string ApplicantEmail { get; set; } = string.Empty;
        public string ApplicantAddress { get; set; } = string.Empty;

        public string? HousingType { get; set; }
        public bool HasYard { get; set; }
        public string? OtherPets { get; set; }
        public int? HouseholdMembers { get; set; }
        public bool HasChildren { get; set; }

        public string? PetExperience { get; set; }
        public string WhyAdopt { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;
        public string? OwnerNotes { get; set; }

        public DateTime AppliedAt { get; set; }
        public DateTime? ReviewedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}


