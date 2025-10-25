using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Home4Paws.API.Models.Entities;

[Table("pet_inquiries")]
public class PetInquiry
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("pet_listing_id")]
    public Guid PetListingId { get; set; }

    [ForeignKey(nameof(PetListingId))]
    public PetListing? PetListing { get; set; }

    [Required]
    [Column("sender_id")]
    public int SenderId { get; set; }

    [ForeignKey(nameof(SenderId))]
    public User? Sender { get; set; }

    [Required]
    [Column("message")]
    [MaxLength(2000)]
    public string Message { get; set; } = string.Empty;

    [Column("parent_inquiry_id")]
    public int? ParentInquiryId { get; set; }

    [ForeignKey(nameof(ParentInquiryId))]
    public PetInquiry? ParentInquiry { get; set; }

    [Column("thread_id")]
    [MaxLength(50)]
    public string? ThreadId { get; set; }

    [Column("is_read")]
    public bool IsRead { get; set; } = false;

    [Column("is_archived")]
    public bool IsArchived { get; set; } = false;

    [Required]
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<PetInquiry> Replies { get; set; } = new List<PetInquiry>();
}
