// backend/Models/Entities/OrderItem.cs
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Home4Paws.API.Models.Entities
{
    public class OrderItem
    {
        public int Id { get; set; }

        [ForeignKey("Order")]
        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;

        [ForeignKey("Product")]
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;
    
        public int Quantity { get; set; }
        
        // Renamed from PriceAtTimeOfPurchase to match DbContext
        [Column(TypeName = "decimal(18, 2)")]
        public decimal UnitPrice { get; set; }
        
        // Add missing properties configured in ApplicationDbContext
        [Column(TypeName = "decimal(18, 2)")]
        public decimal TotalPrice { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}