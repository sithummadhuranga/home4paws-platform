using System;

namespace Home4Paws.API.DTOs
{
    public class AdoptionMessageDto
    {
        public int Id { get; set; }
        public int ListingId { get; set; }
        public string PetName { get; set; } = string.Empty;
        public int SenderId { get; set; }
        public string SenderName { get; set; } = string.Empty;
        public int ReceiverId { get; set; }
        public string ReceiverName { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class SendAdoptionMessageDto
    {
        public int ListingId { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}

