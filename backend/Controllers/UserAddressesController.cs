using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Home4Paws.API.Data;
using Home4Paws.API.Models.Entities;
using Home4Paws.API.DTOs;
using System.Security.Claims;

namespace Home4Paws.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserAddressesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<UserAddressesController> _logger;

        public UserAddressesController(
            ApplicationDbContext context, 
            IMapper mapper, 
            ILogger<UserAddressesController> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : 0;
        }

        // GET: api/useraddresses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserAddressDto>>> GetUserAddresses()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == 0)
                    return Unauthorized(new { message = "Invalid user" });

                var addresses = await _context.UserAddresses
                    .Where(a => a.UserId == userId)
                    .OrderByDescending(a => a.IsDefault)
                    .ThenByDescending(a => a.CreatedAt)
                    .ToListAsync();

                return Ok(_mapper.Map<IEnumerable<UserAddressDto>>(addresses));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user addresses");
                return StatusCode(500, new { message = "Error fetching addresses" });
            }
        }

        // GET: api/useraddresses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserAddressDto>> GetUserAddress(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == 0)
                    return Unauthorized(new { message = "Invalid user" });

                var address = await _context.UserAddresses
                    .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

                if (address == null)
                    return NotFound(new { message = "Address not found" });

                return Ok(_mapper.Map<UserAddressDto>(address));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching address {AddressId}", id);
                return StatusCode(500, new { message = "Error fetching address" });
            }
        }

        // GET: api/useraddresses/default
        [HttpGet("default")]
        public async Task<ActionResult<UserAddressDto>> GetDefaultAddress()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == 0)
                    return Unauthorized(new { message = "Invalid user" });

                var address = await _context.UserAddresses
                    .FirstOrDefaultAsync(a => a.UserId == userId && a.IsDefault);

                if (address == null)
                    return NotFound(new { message = "No default address found" });

                return Ok(_mapper.Map<UserAddressDto>(address));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching default address");
                return StatusCode(500, new { message = "Error fetching default address" });
            }
        }

        // POST: api/useraddresses
        [HttpPost]
        public async Task<ActionResult<UserAddressDto>> CreateUserAddress([FromBody] CreateUpdateUserAddressDto addressDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == 0)
                    return Unauthorized(new { message = "Invalid user" });

                // If this is set as default, unset all other default addresses
                if (addressDto.IsDefault)
                {
                    var existingDefaults = await _context.UserAddresses
                        .Where(a => a.UserId == userId && a.IsDefault)
                        .ToListAsync();

                    foreach (var addr in existingDefaults)
                    {
                        addr.IsDefault = false;
                        addr.UpdatedAt = DateTime.UtcNow;
                    }
                }

                var address = _mapper.Map<UserAddress>(addressDto);
                address.UserId = userId;
                address.CreatedAt = DateTime.UtcNow;
                address.UpdatedAt = DateTime.UtcNow;

                _context.UserAddresses.Add(address);
                await _context.SaveChangesAsync();

                var addressToReturn = _mapper.Map<UserAddressDto>(address);
                return CreatedAtAction(nameof(GetUserAddress), new { id = address.Id }, addressToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating address");
                return StatusCode(500, new { message = "Error creating address" });
            }
        }

        // PUT: api/useraddresses/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserAddress(int id, [FromBody] CreateUpdateUserAddressDto addressDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == 0)
                    return Unauthorized(new { message = "Invalid user" });

                var address = await _context.UserAddresses
                    .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

                if (address == null)
                    return NotFound(new { message = "Address not found" });

                // If this is set as default, unset all other default addresses
                if (addressDto.IsDefault && !address.IsDefault)
                {
                    var existingDefaults = await _context.UserAddresses
                        .Where(a => a.UserId == userId && a.IsDefault && a.Id != id)
                        .ToListAsync();

                    foreach (var addr in existingDefaults)
                    {
                        addr.IsDefault = false;
                        addr.UpdatedAt = DateTime.UtcNow;
                    }
                }

                _mapper.Map(addressDto, address);
                address.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating address {AddressId}", id);
                return StatusCode(500, new { message = "Error updating address" });
            }
        }

        // DELETE: api/useraddresses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserAddress(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == 0)
                    return Unauthorized(new { message = "Invalid user" });

                var address = await _context.UserAddresses
                    .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

                if (address == null)
                    return NotFound(new { message = "Address not found" });

                _context.UserAddresses.Remove(address);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting address {AddressId}", id);
                return StatusCode(500, new { message = "Error deleting address" });
            }
        }

        // PUT: api/useraddresses/5/set-default
        [HttpPut("{id}/set-default")]
        public async Task<IActionResult> SetDefaultAddress(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == 0)
                    return Unauthorized(new { message = "Invalid user" });

                var address = await _context.UserAddresses
                    .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

                if (address == null)
                    return NotFound(new { message = "Address not found" });

                // Unset all other default addresses
                var existingDefaults = await _context.UserAddresses
                    .Where(a => a.UserId == userId && a.IsDefault)
                    .ToListAsync();

                foreach (var addr in existingDefaults)
                {
                    addr.IsDefault = false;
                    addr.UpdatedAt = DateTime.UtcNow;
                }

                address.IsDefault = true;
                address.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting default address {AddressId}", id);
                return StatusCode(500, new { message = "Error setting default address" });
            }
        }
    }
}