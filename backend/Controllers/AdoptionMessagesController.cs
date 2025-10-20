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
    [Route("api/adoption-messages")]
    [Authorize]
    public class AdoptionMessagesController : ControllerBase
    {
        private readonly IAdoptionMessageService _service;

        public AdoptionMessagesController(IAdoptionMessageService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<ActionResult<AdoptionMessageDto>> SendMessage([FromBody] SendAdoptionMessageDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();
            
            var message = await _service.SendMessageAsync(userId, dto);
            return Ok(message);
        }

        [HttpGet("conversation/{listingId}")]
        public async Task<ActionResult<IEnumerable<AdoptionMessageDto>>> GetConversation(int listingId)
        {
            var userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();
            
            var messages = await _service.GetConversationAsync(listingId, userId);
            return Ok(messages);
        }

        [HttpGet("my-messages")]
        public async Task<ActionResult<IEnumerable<AdoptionMessageDto>>> GetMyMessages()
        {
            var userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();
            
            var messages = await _service.GetUserMessagesAsync(userId);
            return Ok(messages);
        }

        [HttpPatch("{id}/mark-read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();
            
            await _service.MarkAsReadAsync(id, userId);
            return NoContent();
        }

        [HttpGet("unread-count")]
        public async Task<ActionResult<int>> GetUnreadCount()
        {
            var userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();
            
            var count = await _service.GetUnreadCountAsync(userId);
            return Ok(count);
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(claim, out var id) ? id : 0;
        }
    }
}

