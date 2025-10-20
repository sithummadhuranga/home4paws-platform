using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Home4Paws.API.Data;
using Home4Paws.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Home4Paws.API.DataManager
{
    public class AdoptionListingRepository : IAdoptionListingRepository
    {
        private readonly ApplicationDbContext _context;

        public AdoptionListingRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AdoptionListing?> GetByIdAsync(int id)
        {
            return await _context.AdoptionListings
                .AsNoTracking()
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<IEnumerable<AdoptionListing>> GetApprovedAsync(string? petType, string? city, string? status, int page, int pageSize)
        {
            var query = _context.AdoptionListings.AsNoTracking().Where(l => l.Status == (status ?? "Approved"));

            if (!string.IsNullOrWhiteSpace(petType))
            {
                query = query.Where(l => l.PetType == petType);
            }

            if (!string.IsNullOrWhiteSpace(city))
            {
                query = query.Where(l => l.City == city);
            }

            return await query
                .OrderByDescending(l => l.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> CountApprovedAsync(string? petType, string? city, string? status)
        {
            var query = _context.AdoptionListings.AsNoTracking().Where(l => l.Status == (status ?? "Approved"));

            if (!string.IsNullOrWhiteSpace(petType))
            {
                query = query.Where(l => l.PetType == petType);
            }

            if (!string.IsNullOrWhiteSpace(city))
            {
                query = query.Where(l => l.City == city);
            }

            return await query.CountAsync();
        }

        public async Task<IEnumerable<AdoptionListing>> GetByUserAsync(int userId)
        {
            return await _context.AdoptionListings
                .AsNoTracking()
                .Where(l => l.UserId == userId)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<AdoptionListing>> GetPendingAsync(int page, int pageSize)
        {
            return await _context.AdoptionListings
                .AsNoTracking()
                .Where(l => l.Status == "Pending")
                .OrderBy(l => l.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task AddAsync(AdoptionListing listing)
        {
            await _context.AdoptionListings.AddAsync(listing);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(AdoptionListing listing)
        {
            _context.AdoptionListings.Update(listing);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(AdoptionListing listing)
        {
            _context.AdoptionListings.Remove(listing);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.AdoptionListings.AnyAsync(l => l.Id == id);
        }
    }
}


