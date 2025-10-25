using System;

namespace Home4Paws.API.Models.Entities
{
    public class AdoptionMessage
    {
        public int Id { get; set; }
        public int ListingId { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Message { get; set; } = string.Empty;
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual AdoptionListing? Listing { get; set; }
        public virtual User? Sender { get; set; }
        public virtual User? Receiver { get; set; }
    }
}

