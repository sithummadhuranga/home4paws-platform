namespace Home4Paws.API.DTOs;

public class PetListingSearchParams
{
    public string? Query { get; set; }
    public string? Species { get; set; }
    public string? Breed { get; set; }
    public string? AgeGroup { get; set; }
    public string? Gender { get; set; }
    public string? Size { get; set; }
    public string? Province { get; set; }
    public string? City { get; set; }
    public bool? IsVaccinated { get; set; }
    public bool? IsNeutered { get; set; }
    public bool? GoodWithKids { get; set; }
    public bool? GoodWithPets { get; set; }
    public string? Status { get; set; }
    public string? ListingType { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public bool? IsFeatured { get; set; }
    public bool? IsUrgent { get; set; }
    public string? SortBy { get; set; } = "created_at";
    public bool SortDescending { get; set; } = true;
    public int Page { get; set; } = 1;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 12;
}
