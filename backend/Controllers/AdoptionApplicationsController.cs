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
    [Route("api/adoption-applications")]
    [Authorize]
    public class AdoptionApplicationsController : ControllerBase
    {
        private readonly IAdoptionApplicationService _service;

        public AdoptionApplicationsController(IAdoptionApplicationService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<ActionResult<AdoptionApplicationDto>> Submit([FromBody] CreateAdoptionApplicationDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();
            var created = await _service.Submit(userId, dto);
            return CreatedAtAction(nameof(GetMyApplications), new { }, created);
        }

        [HttpGet("listing/{listingId}")]
        public async Task<ActionResult<IEnumerable<AdoptionApplicationDto>>> GetByListing(int listingId)
        {
            var userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();
            var items = await _service.GetByListing(listingId, userId);
            return Ok(items);
        }

        [HttpGet("my-applications")]
        public async Task<ActionResult<IEnumerable<AdoptionApplicationDto>>> GetMyApplications()
        {
            var userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();
            var items = await _service.GetMyApplications(userId);
            return Ok(items);
        }

        public class UpdateStatusRequest { public string Status { get; set; } = string.Empty; public string? OwnerNotes { get; set; } }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusRequest req)
        {
            var userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();
            var ok = await _service.UpdateStatus(id, userId, req.Status, req.OwnerNotes);
            if (!ok) return NotFound();
            return NoContent();
        }

        [HttpPatch("{id}/withdraw")]
        public async Task<IActionResult> Withdraw(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();
            var ok = await _service.Withdraw(id, userId);
            if (!ok) return NotFound();
            return NoContent();
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(claim, out var id) ? id : 0;
        }
    }
}
