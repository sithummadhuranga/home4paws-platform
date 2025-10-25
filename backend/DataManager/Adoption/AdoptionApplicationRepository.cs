using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Home4Paws.API.Data;
using Home4Paws.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Home4Paws.API.DataManager
{
    public class AdoptionApplicationRepository : IAdoptionApplicationRepository
    {
        private readonly ApplicationDbContext _context;

        public AdoptionApplicationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AdoptionApplication?> GetByIdAsync(int id)
        {
            return await _context.AdoptionApplications.AsNoTracking().FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<IEnumerable<AdoptionApplication>> GetByListingAsync(int listingId)
        {
            return await _context.AdoptionApplications
                .AsNoTracking()
                .Where(a => a.ListingId == listingId)
                .OrderByDescending(a => a.AppliedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<AdoptionApplication>> GetByApplicantAsync(int userId)
        {
            return await _context.AdoptionApplications
                .AsNoTracking()
                .Where(a => a.ApplicantId == userId)
                .OrderByDescending(a => a.AppliedAt)
                .ToListAsync();
        }

        public async Task AddAsync(AdoptionApplication application)
        {
            await _context.AdoptionApplications.AddAsync(application);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(AdoptionApplication application)
        {
            _context.AdoptionApplications.Update(application);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.AdoptionApplications.AnyAsync(a => a.Id == id);
        }
    }
}


