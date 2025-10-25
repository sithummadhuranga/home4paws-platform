using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Home4Paws.API.Models.Entities
{
    [Table("pet_photos", Schema = "development")]
    public class PetPhoto
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("pet_listing_id")]
        public Guid PetListingId { get; set; }

        [Required]
        [StringLength(500)]
        [Column("url")]
        public string Url { get; set; } = string.Empty;

        [Column("is_primary")]
        public bool IsPrimary { get; set; } = false;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property
        [ForeignKey("PetListingId")]
        public PetListing? PetListing { get; set; }
    }
}
