using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Home4Paws.API.Models.Entities
{
    [Table("pet_favorites", Schema = "development")]
    public class PetFavorite
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Required]
        [Column("pet_listing_id")]
        public Guid PetListingId { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        [ForeignKey("UserId")]
        public User? User { get; set; }

        [ForeignKey("PetListingId")]
        public PetListing? PetListing { get; set; }
    }
}
