using System;

namespace Home4Paws.API.Models.Entities
{
    public class AdoptionFavorite
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public int ListingId { get; set; }
        public AdoptionListing Listing { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}


