using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Home4Paws.API.Data;
using Home4Paws.API.Models.Entities;

namespace Home4Paws.API.DataManager
{
    public class PetFavoriteRepository : IPetFavoriteRepository
    {
        private readonly ApplicationDbContext _context;

        public PetFavoriteRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PetFavorite?> GetByIdAsync(int id)
        {
            return await _context.PetFavorites
                .Include(f => f.User)
                .Include(f => f.PetListing)
                    .ThenInclude(p => p.Photos)
                .FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<PetFavorite> CreateAsync(PetFavorite favorite)
        {
            _context.PetFavorites.Add(favorite);
            await _context.SaveChangesAsync();
            return favorite;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var favorite = await _context.PetFavorites.FindAsync(id);
            if (favorite == null) return false;

            _context.PetFavorites.Remove(favorite);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteByUserAndPetListingAsync(int userId, Guid petListingId)
        {
            var favorite = await GetByUserAndPetListingAsync(userId, petListingId);
            if (favorite == null) return false;

            _context.PetFavorites.Remove(favorite);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<PetFavorite>> GetByUserIdAsync(int userId)
        {
            return await _context.PetFavorites
                .Where(f => f.UserId == userId)
                .Include(f => f.PetListing)
                    .ThenInclude(p => p.Photos)
                .Include(f => f.PetListing)
                    .ThenInclude(p => p.User)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<PetFavorite>> GetByPetListingIdAsync(Guid petListingId)
        {
            return await _context.PetFavorites
                .Where(f => f.PetListingId == petListingId)
                .Include(f => f.User)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();
        }

        public async Task<PetFavorite?> GetByUserAndPetListingAsync(int userId, Guid petListingId)
        {
            return await _context.PetFavorites
                .Include(f => f.PetListing)
                    .ThenInclude(p => p.Photos)
                .FirstOrDefaultAsync(f => f.UserId == userId && f.PetListingId == petListingId);
        }

        public async Task<bool> ExistsAsync(int userId, Guid petListingId)
        {
            return await _context.PetFavorites
                .AnyAsync(f => f.UserId == userId && f.PetListingId == petListingId);
        }

        public async Task<int> GetCountByPetListingIdAsync(Guid petListingId)
        {
            return await _context.PetFavorites
                .CountAsync(f => f.PetListingId == petListingId);
        }
    }
}
