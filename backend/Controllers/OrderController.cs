using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Home4Paws.API.Data;
using Home4Paws.API.Models.Entities;
using Home4Paws.API.DTOs;
using System.Security.Claims;

namespace Home4Paws.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(ApplicationDbContext context, ILogger<OrdersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : 0;
        }

        // POST: api/orders - Create new order
        [HttpPost]
        public async Task<ActionResult<OrderDto>> CreateOrder([FromBody] CreateOrderDto orderDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == 0)
                    return Unauthorized(new { message = "Invalid user token" });

                _logger.LogInformation("🛍️ Creating order for user {UserId}", userId);

                // Validate order items
                if (orderDto.OrderItems == null || !orderDto.OrderItems.Any())
                {
                    return BadRequest(new { message = "Order must contain at least one item" });
                }

                // Calculate total amount
                decimal totalAmount = 0;
                var orderItems = new List<OrderItem>();

                foreach (var item in orderDto.OrderItems)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    
                    if (product == null || !product.IsActive)
                    {
                        return BadRequest(new { message = $"Product {item.ProductId} not found or inactive" });
                    }

                    if (product.StockQuantity < item.Quantity)
                    {
                        return BadRequest(new { message = $"Insufficient stock for product {product.Name}" });
                    }

                    var itemTotal = item.Quantity * item.UnitPrice;
                    totalAmount += itemTotal;

                    orderItems.Add(new OrderItem
                    {
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice,
                        TotalPrice = itemTotal,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });

                    // Update product stock
                    product.StockQuantity -= item.Quantity;
                    product.DateUpdated = DateTime.UtcNow;
                }

                // Create order
                var order = new Order
                {
                    UserId = userId,
                    OrderDate = DateTime.UtcNow,
                    Status = "Pending",
                    TotalAmount = totalAmount,
                    ShippingAddress = orderDto.ShippingAddress,
                    BillingAddress = orderDto.BillingAddress,
                    PaymentMethod = orderDto.PaymentMethod,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    OrderItems = orderItems
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                _logger.LogInformation("✅ Order {OrderId} created successfully for user {UserId}", order.Id, userId);

                // Return order with items
                var result = new OrderDto
                {
                    Id = order.Id,
                    UserId = order.UserId,
                    OrderDate = order.OrderDate,
                    Status = order.Status,
                    TotalAmount = order.TotalAmount,
                    ShippingAddress = order.ShippingAddress,
                    BillingAddress = order.BillingAddress,
                    PaymentMethod = order.PaymentMethod,
                    CreatedAt = order.CreatedAt,
                    UpdatedAt = order.UpdatedAt,
                    OrderItems = orderItems.Select(oi => new OrderItemDto
                    {
                        Id = oi.Id,
                        ProductId = oi.ProductId,
                        ProductName = _context.Products.Find(oi.ProductId)?.Name ?? "Unknown",
                        ProductImageUrl = _context.Products.Find(oi.ProductId)?.ImageUrl ?? "",
                        Quantity = oi.Quantity,
                        UnitPrice = oi.UnitPrice,
                        TotalPrice = oi.TotalPrice
                    }).ToList()
                };

                return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Error creating order for user");
                return StatusCode(500, new { message = "Error creating order" });
            }
        }

        // GET: api/orders/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == 0)
                    return Unauthorized(new { message = "Invalid user token" });

                var order = await _context.Orders
                    .Include(o => o.OrderItems)
                        .ThenInclude(oi => oi.Product)
                    .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

                if (order == null)
                    return NotFound(new { message = "Order not found" });

                var orderDto = new OrderDto
                {
                    Id = order.Id,
                    UserId = order.UserId,
                    OrderDate = order.OrderDate,
                    Status = order.Status,
                    TotalAmount = order.TotalAmount,
                    ShippingAddress = order.ShippingAddress,
                    BillingAddress = order.BillingAddress,
                    PaymentMethod = order.PaymentMethod,
                    CreatedAt = order.CreatedAt,
                    UpdatedAt = order.UpdatedAt,
                    OrderItems = order.OrderItems.Select(oi => new OrderItemDto
                    {
                        Id = oi.Id,
                        ProductId = oi.ProductId,
                        ProductName = oi.Product.Name,
                        ProductImageUrl = oi.Product.ImageUrl,
                        Quantity = oi.Quantity,
                        UnitPrice = oi.UnitPrice,
                        TotalPrice = oi.TotalPrice
                    }).ToList()
                };

                return Ok(orderDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Error fetching order {OrderId}", id);
                return StatusCode(500, new { message = "Error fetching order" });
            }
        }

        // GET: api/orders/user
        [HttpGet("user")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetUserOrders()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == 0)
                    return Unauthorized(new { message = "Invalid user token" });

                _logger.LogInformation("📦 Fetching orders for user {UserId}", userId);

                var orders = await _context.Orders
                    .Where(o => o.UserId == userId)
                    .Include(o => o.OrderItems)
                        .ThenInclude(oi => oi.Product)
                    .OrderByDescending(o => o.OrderDate)
                    .Select(o => new OrderDto
                    {
                        Id = o.Id,
                        UserId = o.UserId,
                        OrderDate = o.OrderDate,
                        Status = o.Status,
                        TotalAmount = o.TotalAmount,
                        ShippingAddress = o.ShippingAddress,
                        BillingAddress = o.BillingAddress,
                        PaymentMethod = o.PaymentMethod,
                        CreatedAt = o.CreatedAt,
                        UpdatedAt = o.UpdatedAt,
                        OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                        {
                            Id = oi.Id,
                            ProductId = oi.ProductId,
                            ProductName = oi.Product.Name,
                            ProductImageUrl = oi.Product.ImageUrl,
                            Quantity = oi.Quantity,
                            UnitPrice = oi.UnitPrice,
                            TotalPrice = oi.TotalPrice
                        }).ToList()
                    })
                    .ToListAsync();

                _logger.LogInformation("✅ Found {OrderCount} orders for user {UserId}", orders.Count, userId);

                return Ok(orders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Error fetching user orders");
                return StatusCode(500, new { message = "Error fetching orders" });
            }
        }

        // GET: api/orders/user/stats
        [HttpGet("user/stats")]
        public async Task<ActionResult<UserStatsDto>> GetUserStats()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == 0)
                    return Unauthorized(new { message = "Invalid user token" });

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                    return NotFound(new { message = "User not found" });

                var orders = await _context.Orders
                    .Where(o => o.UserId == userId)
                    .ToListAsync();

                var stats = new UserStatsDto
                {
                    TotalOrders = orders.Count,
                    TotalSpent = orders.Sum(o => o.TotalAmount),
                    AverageOrderValue = orders.Count > 0 ? orders.Average(o => o.TotalAmount) : 0,
                    FavoriteProducts = 0, // Could implement wishlist later
                    MemberSince = user.CreatedAt.ToString("MMMM yyyy")
                };

                _logger.LogInformation("📊 User {UserId} stats: {OrderCount} orders, ${TotalSpent:F2} spent", userId, stats.TotalOrders, stats.TotalSpent);

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Error fetching user stats");
                return StatusCode(500, new { message = "Error fetching user statistics" });
            }
        }

        // PATCH: api/orders/{id}/cancel
        [HttpPatch("{id}/cancel")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == 0)
                    return Unauthorized(new { message = "Invalid user token" });

                var order = await _context.Orders
                    .Include(o => o.OrderItems)
                    .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

                if (order == null)
                    return NotFound(new { message = "Order not found" });

                if (order.Status == "Delivered" || order.Status == "Cancelled")
                {
                    return BadRequest(new { message = $"Cannot cancel order with status: {order.Status}" });
                }

                // Restore product stock
                foreach (var item in order.OrderItems)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product != null)
                    {
                        product.StockQuantity += item.Quantity;
                        product.DateUpdated = DateTime.UtcNow;
                    }
                }

                order.Status = "Cancelled";
                order.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("❌ Order {OrderId} cancelled for user {UserId}", id, userId);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Error cancelling order {OrderId}", id);
                return StatusCode(500, new { message = "Error cancelling order" });
            }
        }

        // ==================== ADMIN ENDPOINTS ====================

        // GET: api/orders/admin/all - Get all orders (Admin only)
        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<AdminOrdersResponse>> GetAllOrders(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? status = null,
            [FromQuery] string? search = null,
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                _logger.LogInformation("📊 Admin fetching orders - Page: {Page}, PageSize: {PageSize}", page, pageSize);

                var query = _context.Orders
                    .Include(o => o.User)
                    .Include(o => o.OrderItems)
                        .ThenInclude(oi => oi.Product)
                    .AsQueryable();

                // Filter by status
                if (!string.IsNullOrEmpty(status) && status != "All")
                {
                    query = query.Where(o => o.Status == status);
                }

                // Filter by date range
                if (startDate.HasValue)
                {
                    query = query.Where(o => o.OrderDate >= startDate.Value);
                }
                if (endDate.HasValue)
                {
                    query = query.Where(o => o.OrderDate <= endDate.Value.AddDays(1));
                }

                // Search by order ID or user email
                if (!string.IsNullOrEmpty(search))
                {
                    if (int.TryParse(search, out int orderId))
                    {
                        query = query.Where(o => o.Id == orderId);
                    }
                    else
                    {
                        query = query.Where(o => o.User.Email.Contains(search) || 
                                               o.User.FirstName.Contains(search) ||
                                               o.User.LastName.Contains(search));
                    }
                }

                var totalOrders = await query.CountAsync();
                var totalPages = (int)Math.Ceiling(totalOrders / (double)pageSize);

                var orders = await query
                    .OrderByDescending(o => o.OrderDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(o => new AdminOrderDto
                    {
                        Id = o.Id,
                        UserId = o.UserId,
                        UserEmail = o.User.Email,
                        UserName = $"{o.User.FirstName} {o.User.LastName}",
                        OrderDate = o.OrderDate,
                        Status = o.Status,
                        TotalAmount = o.TotalAmount,
                        ShippingAddress = o.ShippingAddress,
                        BillingAddress = o.BillingAddress,
                        PaymentMethod = o.PaymentMethod,
                        CreatedAt = o.CreatedAt,
                        UpdatedAt = o.UpdatedAt,
                        ItemCount = o.OrderItems.Count,
                        OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                        {
                            Id = oi.Id,
                            ProductId = oi.ProductId,
                            ProductName = oi.Product.Name,
                            ProductImageUrl = oi.Product.ImageUrl,
                            Quantity = oi.Quantity,
                            UnitPrice = oi.UnitPrice,
                            TotalPrice = oi.TotalPrice
                        }).ToList()
                    })
                    .ToListAsync();

                // Calculate statistics
                var allOrders = await _context.Orders.ToListAsync();
                var stats = new AdminOrderStats
                {
                    TotalOrders = allOrders.Count,
                    PendingOrders = allOrders.Count(o => o.Status == "Pending"),
                    ProcessingOrders = allOrders.Count(o => o.Status == "Processing"),
                    CompletedOrders = allOrders.Count(o => o.Status == "Delivered"),
                    CancelledOrders = allOrders.Count(o => o.Status == "Cancelled"),
                    TotalRevenue = allOrders.Where(o => o.Status != "Cancelled").Sum(o => o.TotalAmount),
                    AverageOrderValue = allOrders.Count > 0 ? allOrders.Average(o => o.TotalAmount) : 0
                };

                var response = new AdminOrdersResponse
                {
                    Orders = orders,
                    TotalOrders = totalOrders,
                    CurrentPage = page,
                    TotalPages = totalPages,
                    PageSize = pageSize,
                    Stats = stats
                };

                _logger.LogInformation("✅ Admin fetched {Count} orders", orders.Count);

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Error fetching admin orders");
                return StatusCode(500, new { message = "Error fetching orders" });
            }
        }

        // PATCH: api/orders/admin/{id}/status - Update order status (Admin only)
        [HttpPatch("admin/{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDto dto)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.OrderItems)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                    return NotFound(new { message = "Order not found" });

                var oldStatus = order.Status;
                order.Status = dto.Status;
                order.UpdatedAt = DateTime.UtcNow;

                // If cancelling from admin side, restore stock
                if (dto.Status == "Cancelled" && oldStatus != "Cancelled")
                {
                    foreach (var item in order.OrderItems)
                    {
                        var product = await _context.Products.FindAsync(item.ProductId);
                        if (product != null)
                        {
                            product.StockQuantity += item.Quantity;
                            product.DateUpdated = DateTime.UtcNow;
                        }
                    }
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation("✅ Admin updated order {OrderId} status from {OldStatus} to {NewStatus}", 
                    id, oldStatus, dto.Status);

                return Ok(new { message = "Order status updated successfully", order });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Error updating order status");
                return StatusCode(500, new { message = "Error updating order status" });
            }
        }

        // GET: api/orders/admin/dashboard-stats
        [HttpGet("admin/dashboard-stats")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<AdminDashboardStats>> GetDashboardStats()
        {
            try
            {
                var now = DateTime.UtcNow;
                var startOfMonth = new DateTime(now.Year, now.Month, 1);
                var startOfLastMonth = startOfMonth.AddMonths(-1);

                var allOrders = await _context.Orders.ToListAsync();
                var thisMonthOrders = allOrders.Where(o => o.OrderDate >= startOfMonth).ToList();
                var lastMonthOrders = allOrders.Where(o => o.OrderDate >= startOfLastMonth && o.OrderDate < startOfMonth).ToList();

                var thisMonthRevenue = thisMonthOrders.Where(o => o.Status != "Cancelled").Sum(o => o.TotalAmount);
                var lastMonthRevenue = lastMonthOrders.Where(o => o.Status != "Cancelled").Sum(o => o.TotalAmount);

                var revenueGrowth = lastMonthRevenue > 0 
                    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
                    : 0;

                var ordersGrowth = lastMonthOrders.Count > 0
                    ? ((thisMonthOrders.Count - lastMonthOrders.Count) / (decimal)lastMonthOrders.Count) * 100
                    : 0;

                // Get top selling products
                var topProducts = await _context.OrderItems
                    .Include(oi => oi.Product)
                    .GroupBy(oi => oi.ProductId)
                    .Select(g => new TopProductDto
                    {
                        ProductId = g.Key,
                        ProductName = g.First().Product.Name,
                        ProductImage = g.First().Product.ImageUrl,
                        TotalSold = g.Sum(oi => oi.Quantity),
                        TotalRevenue = g.Sum(oi => oi.TotalPrice)
                    })
                    .OrderByDescending(p => p.TotalSold)
                    .Take(5)
                    .ToListAsync();

                // Get recent orders
                var recentOrders = await _context.Orders
                    .Include(o => o.User)
                    .OrderByDescending(o => o.OrderDate)
                    .Take(10)
                    .Select(o => new RecentOrderDto
                    {
                        Id = o.Id,
                        UserName = $"{o.User.FirstName} {o.User.LastName}",
                        TotalAmount = o.TotalAmount,
                        Status = o.Status,
                        OrderDate = o.OrderDate
                    })
                    .ToListAsync();

                // Low stock products
                var lowStockProducts = await _context.Products
                    .Where(p => p.IsActive && p.StockQuantity < 10)
                    .OrderBy(p => p.StockQuantity)
                    .Take(10)
                    .Select(p => new LowStockProductDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Sku = p.Sku,
                        StockQuantity = p.StockQuantity,
                        ImageUrl = p.ImageUrl
                    })
                    .ToListAsync();

                var stats = new AdminDashboardStats
                {
                    TotalRevenue = allOrders.Where(o => o.Status != "Cancelled").Sum(o => o.TotalAmount),
                    TotalOrders = allOrders.Count,
                    PendingOrders = allOrders.Count(o => o.Status == "Pending"),
                    TotalCustomers = await _context.Users.CountAsync(),
                    ThisMonthRevenue = thisMonthRevenue,
                    LastMonthRevenue = lastMonthRevenue,
                    RevenueGrowth = revenueGrowth,
                    ThisMonthOrders = thisMonthOrders.Count,
                    LastMonthOrders = lastMonthOrders.Count,
                    OrdersGrowth = ordersGrowth,
                    AverageOrderValue = allOrders.Count > 0 ? allOrders.Average(o => o.TotalAmount) : 0,
                    TopSellingProducts = topProducts,
                    RecentOrders = recentOrders,
                    LowStockProducts = lowStockProducts
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Error fetching dashboard stats");
                return StatusCode(500, new { message = "Error fetching dashboard statistics" });
            }
        }

        // DELETE: api/orders/admin/{id} - Delete order (Admin only)
        [HttpDelete("admin/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.OrderItems)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                    return NotFound(new { message = "Order not found" });

                // Don't allow deletion of delivered orders
                if (order.Status == "Delivered")
                {
                    return BadRequest(new { message = "Cannot delete delivered orders" });
                }

                // Restore stock if order wasn't cancelled
                if (order.Status != "Cancelled")
                {
                    foreach (var item in order.OrderItems)
                    {
                        var product = await _context.Products.FindAsync(item.ProductId);
                        if (product != null)
                        {
                            product.StockQuantity += item.Quantity;
                            product.DateUpdated = DateTime.UtcNow;
                        }
                    }
                }

                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();

                _logger.LogInformation("🗑️ Admin deleted order {OrderId}", id);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Error deleting order {OrderId}", id);
                return StatusCode(500, new { message = "Error deleting order" });
            }
        }
    }
}