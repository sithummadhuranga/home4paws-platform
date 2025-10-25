// backend/Models/Entities/Order.cs
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Home4Paws.API.Models.Entities
{
    public class Order
    {
        public int Id { get; set; }
        
        public int UserId { get; set; }  // Changed from string to int to match User entity
        public User User { get; set; } = null!;

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        // Renamed from OrderStatus to Status to match DbContext configuration
        public string Status { get; set; } = "Pending"; 

        [Column(TypeName = "decimal(18, 2)")]
        public decimal TotalAmount { get; set; }
        
        // Add missing properties that are configured in ApplicationDbContext
        public string ShippingAddress { get; set; } = string.Empty;
        public string BillingAddress { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property for all items in this order
        public List<OrderItem> OrderItems { get; set; } = new();
    }
}