using System;

namespace Home4Paws.API.Models.Entities
{
    public class Feedback
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int Rating { get; set; } // 1-5 stars
        public string Title { get; set; } = string.Empty;
        public string Comment { get; set; } = string.Empty;
        public bool IsApproved { get; set; } = false;
        public bool IsFeatured { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public virtual User User { get; set; } = null!;
    }
}