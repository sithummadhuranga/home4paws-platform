using System.ComponentModel.DataAnnotations;

namespace Home4Paws.API.DTOs
{
    public class CreateAdoptionApplicationDto
    {
        [Required]
        public int ListingId { get; set; }

        [Required]
        [MaxLength(100)]
        public string ApplicantName { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string ApplicantPhone { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        [EmailAddress]
        public string ApplicantEmail { get; set; } = string.Empty;

        [Required]
        public string ApplicantAddress { get; set; } = string.Empty;

        public string? HousingType { get; set; }
        public bool HasYard { get; set; }
        public string? OtherPets { get; set; }
        public int? HouseholdMembers { get; set; }
        public bool HasChildren { get; set; }

        public string? PetExperience { get; set; }

        [Required]
        public string WhyAdopt { get; set; } = string.Empty;
    }
}


