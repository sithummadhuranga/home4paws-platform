using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Home4Paws.API.DTOs;
using Home4Paws.API.Services.Adoption;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Home4Paws.API.Controllers
{
    [ApiController]
    [Route("api/adoptions")]
    public class AdoptionListingsController : ControllerBase
    {
        private readonly IAdoptionService _service;

        public AdoptionListingsController(IAdoptionService service)
        {
            _service = service;
        }

        // Public browse
        [HttpGet]
        public async Task<ActionResult<object>> GetApproved([FromQuery] string? petType, [FromQuery] string? city, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var (items, total) = await _service.GetApprovedListings(petType, city, page, pageSize);
            return Ok(new { total, items });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AdoptionListingDto>> GetById(int id)
        {
            var item = await _service.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        // User endpoints
        [HttpGet("my-listings")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<AdoptionListingDto>>> GetMyListings()
        {
            var userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();
            var items = await _service.GetMyListings(userId);
            return Ok(items);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<AdoptionListingDto>> Create([FromBody] CreateAdoptionListingDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();
            var created = await _service.Create(userId, dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<AdoptionListingDto>> Update(int id, [FromBody] UpdateAdoptionListingDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();
            var updated = await _service.Update(id, userId, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();
            var ok = await _service.Delete(id, userId);
            if (!ok) return NotFound();
            return NoContent();
        }

        [HttpPatch("{id}/adopted")]
        [Authorize]
        public async Task<IActionResult> MarkAsAdopted(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();
            var ok = await _service.MarkAsAdopted(id, userId);
            if (!ok) return NotFound();
            return NoContent();
        }

        // Admin endpoints
        [HttpGet("admin/pending")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<AdoptionListingDto>>> GetPending([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var items = await _service.GetPending(page, pageSize);
            return Ok(items);
        }

        [HttpPost("admin/{id}/approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Approve(int id, [FromBody] AdminApprovalRequest body)
        {
            var adminId = GetCurrentUserId();
            var ok = await _service.Approve(id, adminId, body?.Notes);
            if (!ok) return NotFound();
            return NoContent();
        }

        [HttpPost("admin/{id}/reject")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Reject(int id, [FromBody] AdminRejectRequest body)
        {
            if (body == null || string.IsNullOrWhiteSpace(body.Reason)) return BadRequest(new { message = "Reason is required" });
            var adminId = GetCurrentUserId();
            var ok = await _service.Reject(id, adminId, body.Reason);
            if (!ok) return NotFound();
            return NoContent();
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(claim, out var id) ? id : 0;
        }

        public class AdminApprovalRequest { public string? Notes { get; set; } }
        public class AdminRejectRequest { public string Reason { get; set; } = string.Empty; }
    }
}
