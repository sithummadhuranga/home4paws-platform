using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Home4Paws.API.Data;
using Home4Paws.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Home4Paws.API.DataManager
{
    public class AdoptionMessageRepository : IAdoptionMessageRepository
    {
        private readonly ApplicationDbContext _context;

        public AdoptionMessageRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AdoptionMessage> CreateAsync(AdoptionMessage message)
        {
            await _context.AdoptionMessages.AddAsync(message);
            await _context.SaveChangesAsync();
            return message;
        }

        public async Task<AdoptionMessage?> GetByIdAsync(int id)
        {
            return await _context.AdoptionMessages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Include(m => m.Listing)
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<IEnumerable<AdoptionMessage>> GetByListingIdAsync(int listingId)
        {
            return await _context.AdoptionMessages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Include(m => m.Listing)
                .Where(m => m.ListingId == listingId)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<AdoptionMessage>> GetConversationAsync(int listingId, int userId)
        {
            return await _context.AdoptionMessages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Include(m => m.Listing)
                .Where(m => m.ListingId == listingId && (m.SenderId == userId || m.ReceiverId == userId))
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<AdoptionMessage>> GetUserMessagesAsync(int userId)
        {
            return await _context.AdoptionMessages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Include(m => m.Listing)
                .Where(m => m.SenderId == userId || m.ReceiverId == userId)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task MarkAsReadAsync(int messageId)
        {
            var message = await _context.AdoptionMessages.FindAsync(messageId);
            if (message != null)
            {
                message.IsRead = true;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<int> GetUnreadCountAsync(int userId)
        {
            return await _context.AdoptionMessages
                .Where(m => m.ReceiverId == userId && !m.IsRead)
                .CountAsync();
        }

        public async Task<int> GetUnreadCountByListingAsync(int listingId, int userId)
        {
            return await _context.AdoptionMessages
                .Where(m => m.ListingId == listingId && m.ReceiverId == userId && !m.IsRead)
                .CountAsync();
        }

        public async Task<Dictionary<int, int>> GetUnreadCountsByUserListingsAsync(int userId)
        {
            // Get all listings owned by this user
            var userListingIds = await _context.AdoptionListings
                .Where(l => l.UserId == userId)
                .Select(l => l.Id)
                .ToListAsync();

            // Get unread message counts for each listing
            var unreadCounts = await _context.AdoptionMessages
                .Where(m => userListingIds.Contains(m.ListingId) && m.ReceiverId == userId && !m.IsRead)
                .GroupBy(m => m.ListingId)
                .Select(g => new { ListingId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.ListingId, x => x.Count);

            return unreadCounts;
        }
    }
}

