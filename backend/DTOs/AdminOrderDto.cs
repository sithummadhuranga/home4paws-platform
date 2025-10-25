using System;
using System.Collections.Generic;

namespace Home4Paws.API.DTOs
{
    public class AdminOrderDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserEmail { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string ShippingAddress { get; set; } = string.Empty;
        public string BillingAddress { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int ItemCount { get; set; }
        public List<OrderItemDto> OrderItems { get; set; } = new();
    }

    public class AdminOrdersResponse
    {
        public List<AdminOrderDto> Orders { get; set; } = new();
        public int TotalOrders { get; set; }
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public AdminOrderStats Stats { get; set; } = new();
    }

    public class AdminOrderStats
    {
        public int TotalOrders { get; set; }
        public int PendingOrders { get; set; }
        public int ProcessingOrders { get; set; }
        public int CompletedOrders { get; set; }
        public int CancelledOrders { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal AverageOrderValue { get; set; }
    }

    public class UpdateOrderStatusDto
    {
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }

    public class AdminDashboardStats
    {
        public decimal TotalRevenue { get; set; }
        public int TotalOrders { get; set; }
        public int PendingOrders { get; set; }
        public int TotalCustomers { get; set; }
        public decimal ThisMonthRevenue { get; set; }
        public decimal LastMonthRevenue { get; set; }
        public decimal RevenueGrowth { get; set; }
        public int ThisMonthOrders { get; set; }
        public int LastMonthOrders { get; set; }
        public decimal OrdersGrowth { get; set; }
        public decimal AverageOrderValue { get; set; }
        public List<TopProductDto> TopSellingProducts { get; set; } = new();
        public List<RecentOrderDto> RecentOrders { get; set; } = new();
        public List<LowStockProductDto> LowStockProducts { get; set; } = new();
    }

    public class TopProductDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ProductImage { get; set; } = string.Empty;
        public int TotalSold { get; set; }
        public decimal TotalRevenue { get; set; }
    }

    public class RecentOrderDto
    {
        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
    }

    public class LowStockProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;
        public int StockQuantity { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }
}