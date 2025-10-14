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

                // Restore stock quantities
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
    }
}