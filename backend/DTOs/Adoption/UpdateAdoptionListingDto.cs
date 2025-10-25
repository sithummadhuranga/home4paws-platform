namespace Home4Paws.API.DTOs
{
    public class UpdateAdoptionListingDto
    {
        public string? PetName { get; set; }
        public string? PetType { get; set; }
        public string? Breed { get; set; }
        public int? AgeYears { get; set; }
        public int? AgeMonths { get; set; }
        public string? Gender { get; set; }
        public string? Size { get; set; }
        public string? Color { get; set; }
        public string? Description { get; set; }

        public string? HealthStatus { get; set; }
        public string? VaccinationStatus { get; set; }
        public bool? IsSpayedNeutered { get; set; }
        public bool? IsHouseTrained { get; set; }
        public bool? GoodWithKids { get; set; }
        public bool? GoodWithPets { get; set; }
        public string? EnergyLevel { get; set; }
        public string? SpecialNeeds { get; set; }

        public string? AdoptionType { get; set; }
        public decimal? AdoptionFee { get; set; }
        public string? RehomingReason { get; set; }

        public string? ContactName { get; set; }
        public string? ContactPhone { get; set; }
        public string? ContactEmail { get; set; }
        public string? Location { get; set; }
        public string? City { get; set; }
        public string? Province { get; set; }
        public string? District { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        public string[]? PhotoUrls { get; set; }
        public string? VideoUrl { get; set; }
    }
}


