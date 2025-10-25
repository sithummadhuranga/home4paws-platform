using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Home4Paws.API.Data;
using Home4Paws.API.Models.Entities;
using Home4Paws.API.DTOs;

namespace Home4Paws.API.DataManager
{
    public class PetInquiryRepository : IPetInquiryRepository
    {
        private readonly ApplicationDbContext _context;

        public PetInquiryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PetInquiry?> GetByIdAsync(int id)
        {
            return await _context.PetInquiries
                .Include(i => i.PetListing)
                .Include(i => i.Sender)
                .Include(i => i.ParentInquiry)
                .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<PetInquiry> CreateAsync(PetInquiry inquiry)
        {
            _context.PetInquiries.Add(inquiry);
            await _context.SaveChangesAsync();
            return inquiry;
        }

        public async Task<PetInquiry> UpdateAsync(PetInquiry inquiry)
        {
            _context.PetInquiries.Update(inquiry);
            await _context.SaveChangesAsync();
            return inquiry;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var inquiry = await _context.PetInquiries.FindAsync(id);
            if (inquiry == null) return false;

            _context.PetInquiries.Remove(inquiry);
            await _context.SaveChangesAsync();
            return true;
        }

                public async Task<List<PetInquiry>> GetByPetListingIdAsync(Guid petListingId)
        {
            return await _context.PetInquiries
                .Where(i => i.PetListingId == petListingId)
                .Include(i => i.Sender)
                .Include(i => i.ParentInquiry)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<PetInquiry>> GetBySenderIdAsync(int senderId)
        {
            return await _context.PetInquiries
                .Where(i => i.SenderId == senderId)
                .Include(i => i.PetListing)
                    .ThenInclude(p => p.User)
                .Include(i => i.ParentInquiry)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<PetInquiry>> GetReceivedByUserIdAsync(int userId)
        {
            return await _context.PetInquiries
                .Where(i => i.PetListing.UserId == userId)
                .Include(i => i.PetListing)
                .Include(i => i.Sender)
                .Include(i => i.ParentInquiry)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<PetInquiry>> GetThreadAsync(string threadId)
        {
            return await _context.PetInquiries
                .Include(i => i.PetListing)
                .Include(i => i.Sender)
                .Include(i => i.ParentInquiry)
                .Where(i => i.ThreadId == threadId)
                .OrderBy(i => i.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<PetInquiry>> GetUnreadByUserIdAsync(int userId)
        {
            return await _context.PetInquiries
                .Where(i => i.PetListing.UserId == userId && !i.IsRead)
                .Include(i => i.PetListing)
                .Include(i => i.Sender)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
        }

                public async Task<int> GetUnreadCountAsync(int userId)
        {
            return await _context.PetInquiries
                .CountAsync(i => i.PetListing.UserId == userId && !i.IsRead);
        }

        public async Task<int> GetTotalCountByPetListingIdAsync(Guid petListingId)
        {
            return await _context.PetInquiries
                .CountAsync(i => i.PetListingId == petListingId);
        }

        public async Task<bool> MarkAsReadAsync(int inquiryId, int userId)
        {
            var inquiry = await _context.PetInquiries
                .Include(i => i.PetListing)
                .FirstOrDefaultAsync(i => i.Id == inquiryId && i.PetListing != null && i.PetListing.UserId == userId);

            if (inquiry == null || inquiry.IsRead) return false;

            inquiry.IsRead = true;
            inquiry.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> MarkThreadAsReadAsync(string threadId, int userId)
        {
            var inquiries = await _context.PetInquiries
                .Include(i => i.PetListing)
                .Where(i => i.ThreadId == threadId && i.PetListing != null && i.PetListing.UserId == userId && !i.IsRead)
                .ToListAsync();

            if (!inquiries.Any()) return false;

            foreach (var inquiry in inquiries)
            {
                inquiry.IsRead = true;
                inquiry.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> MarkAsUnreadAsync(int inquiryId, int userId)
        {
            var inquiry = await _context.PetInquiries
                .Include(i => i.PetListing)
                .FirstOrDefaultAsync(i => i.Id == inquiryId && i.PetListing != null && i.PetListing.UserId == userId);

            if (inquiry == null || !inquiry.IsRead) return false;

            inquiry.IsRead = false;
            inquiry.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ArchiveAsync(int inquiryId, int userId)
        {
            var inquiry = await _context.PetInquiries
                .Include(i => i.PetListing)
                .FirstOrDefaultAsync(i => i.Id == inquiryId &&
                    (i.SenderId == userId || (i.PetListing != null && i.PetListing.UserId == userId)));

            if (inquiry == null || inquiry.IsArchived) return false;

            inquiry.IsArchived = true;
            inquiry.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UnarchiveAsync(int inquiryId, int userId)
        {
            var inquiry = await _context.PetInquiries
                .Include(i => i.PetListing)
                .FirstOrDefaultAsync(i => i.Id == inquiryId &&
                    (i.SenderId == userId || (i.PetListing != null && i.PetListing.UserId == userId)));

            if (inquiry == null || !inquiry.IsArchived) return false;

            inquiry.IsArchived = false;
            inquiry.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<PetInquiry>> GetArchivedByUserIdAsync(int userId)
        {
            return await _context.PetInquiries
                .Include(i => i.PetListing)
                .Where(i => i.IsArchived && 
                    (i.SenderId == userId || (i.PetListing != null && i.PetListing.UserId == userId)))
                .Include(i => i.PetListing)
                .Include(i => i.Sender)
                .OrderByDescending(i => i.UpdatedAt)
                .ToListAsync();
        }

                public async Task<List<PetInquiry>> GetThreadsByUserIdAsync(int userId, bool includeArchived = false)
        {
            // Get all inquiries grouped by thread for the user
            var query = _context.PetInquiries
                .Include(i => i.PetListing)
                .Include(i => i.Sender)
                .Where(i => (i.SenderId == userId || (i.PetListing != null && i.PetListing.UserId == userId)));

            if (!includeArchived)
            {
                query = query.Where(i => !i.IsArchived);
            }

            return await query
                .OrderByDescending(i => i.UpdatedAt)
                .ToListAsync();
        }

                public async Task<List<PetInquiry>> GetThreadByListingIdAsync(Guid petListingId, int userId)
        {
            // Get the most recent inquiry for a listing and user
            return await _context.PetInquiries
                .Where(i => i.PetListingId == petListingId && i.SenderId == userId)
                .Include(i => i.PetListing)
                .Include(i => i.Sender)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<PetInquiry>> GetAllAsync()
        {
            return await _context.PetInquiries
                .Include(i => i.PetListing)
                .Include(i => i.Sender)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
        }

        public async Task<Dictionary<string, object>> GetStatisticsAsync()
        {
            var totalInquiries = await _context.PetInquiries.CountAsync();
            var unreadInquiries = await _context.PetInquiries.CountAsync(i => !i.IsRead);
            var readInquiries = await _context.PetInquiries.CountAsync(i => i.IsRead);
            var archivedInquiries = await _context.PetInquiries.CountAsync(i => i.IsArchived);
            var activeThreads = await _context.PetInquiries
                .Where(i => !string.IsNullOrEmpty(i.ThreadId) && !i.IsArchived)
                .Select(i => i.ThreadId)
                .Distinct()
                .CountAsync();

            return new Dictionary<string, object>
            {
                { "TotalInquiries", totalInquiries },
                { "UnreadInquiries", unreadInquiries },
                { "ReadInquiries", readInquiries },
                { "ArchivedInquiries", archivedInquiries },
                { "ActiveThreads", activeThreads }
            };
        }

        public async Task<string?> GetThreadIdAsync(int inquiryId)
        {
            var inquiry = await _context.PetInquiries
                .FirstOrDefaultAsync(i => i.Id == inquiryId);

            return inquiry?.ThreadId;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.PetInquiries.AnyAsync(i => i.Id == id);
        }

        public async Task<bool> CanAccessInquiryAsync(int inquiryId, int userId)
        {
            return await _context.PetInquiries
                .Include(i => i.PetListing)
                .AnyAsync(i => i.Id == inquiryId &&
                              (i.SenderId == userId || (i.PetListing != null && i.PetListing.UserId == userId)));
        }
    }
}
