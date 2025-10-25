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
    public class FeedbacksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<FeedbacksController> _logger;

        public FeedbacksController(ApplicationDbContext context, ILogger<FeedbacksController> logger)
        {
            _context = context;
            _logger = logger;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : 0;
        }

        // GET: api/feedbacks/approved - Public endpoint for approved feedbacks
        [HttpGet("approved")]
        public async Task<ActionResult<IEnumerable<FeedbackDto>>> GetApprovedFeedbacks()
        {
            try
            {
                var feedbacks = await _context.Feedbacks
                    .Include(f => f.User)
                    .Where(f => f.IsApproved)
                    .OrderByDescending(f => f.IsFeatured)
                    .ThenByDescending(f => f.CreatedAt)
                    .Select(f => new FeedbackDto
                    {
                        Id = f.Id,
                        UserId = f.UserId,
                        UserName = $"{f.User.FirstName} {f.User.LastName}",
                        Rating = f.Rating,
                        Title = f.Title,
                        Comment = f.Comment,
                        IsApproved = f.IsApproved,
                        IsFeatured = f.IsFeatured,
                        CreatedAt = f.CreatedAt
                    })
                    .ToListAsync();

                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching approved feedbacks");
                return StatusCode(500, new { message = "Failed to fetch feedbacks" });
            }
        }

        // GET: api/feedbacks/featured - Public endpoint for featured feedbacks
        [HttpGet("featured")]
        public async Task<ActionResult<IEnumerable<FeedbackDto>>> GetFeaturedFeedbacks([FromQuery] int count = 6)
        {
            try
            {
                var feedbacks = await _context.Feedbacks
                    .Include(f => f.User)
                    .Where(f => f.IsApproved && f.IsFeatured)
                    .OrderByDescending(f => f.CreatedAt)
                    .Take(count)
                    .Select(f => new FeedbackDto
                    {
                        Id = f.Id,
                        UserId = f.UserId,
                        UserName = $"{f.User.FirstName} {f.User.LastName}",
                        Rating = f.Rating,
                        Title = f.Title,
                        Comment = f.Comment,
                        IsApproved = f.IsApproved,
                        IsFeatured = f.IsFeatured,
                        CreatedAt = f.CreatedAt
                    })
                    .ToListAsync();

                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching featured feedbacks");
                return StatusCode(500, new { message = "Failed to fetch featured feedbacks" });
            }
        }

        // GET: api/feedbacks/my - Get current user's feedbacks
        [HttpGet("my")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<FeedbackDto>>> GetMyFeedbacks()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == 0)
                    return Unauthorized(new { message = "Invalid user" });

                var feedbacks = await _context.Feedbacks
                    .Include(f => f.User)
                    .Where(f => f.UserId == userId)
                    .OrderByDescending(f => f.CreatedAt)
                    .Select(f => new FeedbackDto
                    {
                        Id = f.Id,
                        UserId = f.UserId,
                        UserName = $"{f.User.FirstName} {f.User.LastName}",
                        Rating = f.Rating,
                        Title = f.Title,
                        Comment = f.Comment,
                        IsApproved = f.IsApproved,
                        IsFeatured = f.IsFeatured,
                        CreatedAt = f.CreatedAt
                    })
                    .ToListAsync();

                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user feedbacks");
                return StatusCode(500, new { message = "Failed to fetch your feedbacks" });
            }
        }

        // POST: api/feedbacks - Create new feedback
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<FeedbackDto>> CreateFeedback([FromBody] CreateFeedbackDto feedbackDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == 0)
                    return Unauthorized(new { message = "Invalid user" });

                var feedback = new Feedback
                {
                    UserId = userId,
                    Rating = feedbackDto.Rating,
                    Title = feedbackDto.Title,
                    Comment = feedbackDto.Comment,
                    IsApproved = false,
                    IsFeatured = false,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Feedbacks.Add(feedback);
                await _context.SaveChangesAsync();

                // Load user data
                await _context.Entry(feedback).Reference(f => f.User).LoadAsync();

                var result = new FeedbackDto
                {
                    Id = feedback.Id,
                    UserId = feedback.UserId,
                    UserName = $"{feedback.User.FirstName} {feedback.User.LastName}",
                    Rating = feedback.Rating,
                    Title = feedback.Title,
                    Comment = feedback.Comment,
                    IsApproved = feedback.IsApproved,
                    IsFeatured = feedback.IsFeatured,
                    CreatedAt = feedback.CreatedAt
                };

                _logger.LogInformation("User {UserId} created feedback {FeedbackId}", userId, feedback.Id);
                return CreatedAtAction(nameof(GetApprovedFeedbacks), new { id = feedback.Id }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating feedback");
                return StatusCode(500, new { message = "Failed to create feedback" });
            }
        }

        // PATCH: api/feedbacks/{id}/status - Update feedback status (Admin only)
        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateFeedbackStatus(int id, [FromBody] UpdateFeedbackStatusDto dto)
        {
            try
            {
                var feedback = await _context.Feedbacks.FindAsync(id);
                if (feedback == null)
                    return NotFound(new { message = "Feedback not found" });

                feedback.IsApproved = dto.IsApproved;
                feedback.IsFeatured = dto.IsFeatured;
                feedback.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Admin updated feedback {FeedbackId} status", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating feedback status");
                return StatusCode(500, new { message = "Failed to update feedback status" });
            }
        }

        // DELETE: api/feedbacks/{id} - Delete feedback (Admin or Owner)
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteFeedback(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == 0)
                    return Unauthorized(new { message = "Invalid user" });

                var feedback = await _context.Feedbacks.FindAsync(id);
                if (feedback == null)
                    return NotFound(new { message = "Feedback not found" });

                // Check if user is admin or owner
                var isAdmin = User.IsInRole("Admin");
                if (!isAdmin && feedback.UserId != userId)
                    return Forbid();

                _context.Feedbacks.Remove(feedback);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Feedback {FeedbackId} deleted by user {UserId}", id, userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting feedback");
                return StatusCode(500, new { message = "Failed to delete feedback" });
            }
        }

        // GET: api/feedbacks/admin/all - Get all feedbacks (Admin only)
        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<FeedbackDto>>> GetAllFeedbacks()
        {
            try
            {
                var feedbacks = await _context.Feedbacks
                    .Include(f => f.User)
                    .OrderByDescending(f => f.CreatedAt)
                    .Select(f => new FeedbackDto
                    {
                        Id = f.Id,
                        UserId = f.UserId,
                        UserName = $"{f.User.FirstName} {f.User.LastName}",
                        Rating = f.Rating,
                        Title = f.Title,
                        Comment = f.Comment,
                        IsApproved = f.IsApproved,
                        IsFeatured = f.IsFeatured,
                        CreatedAt = f.CreatedAt
                    })
                    .ToListAsync();

                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching all feedbacks");
                return StatusCode(500, new { message = "Failed to fetch feedbacks" });
            }
        }
    }
}