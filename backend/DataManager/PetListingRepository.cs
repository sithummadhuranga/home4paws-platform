using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Home4Paws.API.Data;
using Home4Paws.API.DTOs;
using Home4Paws.API.Models.Entities;

namespace Home4Paws.API.DataManager
{
    public class PetListingRepository : IPetListingRepository
    {
        private readonly ApplicationDbContext _context;

        public PetListingRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PetListing?> GetByIdAsync(Guid id)
        {
            return await _context.PetListings
                .Include(p => p.User)
                .Include(p => p.ApprovedByUser)
                .Include(p => p.Photos)
                .Include(p => p.Inquiries)
                .Include(p => p.Favorites)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<PetListing> CreateAsync(PetListing petListing)
        {
            _context.PetListings.Add(petListing);
            await _context.SaveChangesAsync();
            return petListing;
        }

        public async Task<PetListing?> UpdateAsync(PetListing petListing)
        {
            petListing.UpdatedAt = DateTime.UtcNow;
            _context.PetListings.Update(petListing);
            await _context.SaveChangesAsync();
            return petListing;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var petListing = await _context.PetListings.FindAsync(id);
            if (petListing == null) return false;

            _context.PetListings.Remove(petListing);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PagedResult<PetListing>> GetAllAsync(PetListingSearchParams searchParams)
        {
            var query = _context.PetListings
                .Include(p => p.User)
                .Include(p => p.Photos)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(searchParams.Query))
            {
                var searchQuery = searchParams.Query.ToLower();
                query = query.Where(p => 
                    p.Name.ToLower().Contains(searchQuery) ||
                    p.Species.ToLower().Contains(searchQuery) ||
                    (p.Breed != null && p.Breed.ToLower().Contains(searchQuery)) ||
                    p.City.ToLower().Contains(searchQuery));
            }

            if (!string.IsNullOrWhiteSpace(searchParams.Species))
            {
                query = query.Where(p => p.Species.ToLower() == searchParams.Species.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(searchParams.Breed))
            {
                query = query.Where(p => p.Breed != null && p.Breed.ToLower().Contains(searchParams.Breed.ToLower()));
            }

            if (!string.IsNullOrWhiteSpace(searchParams.ListingType))
            {
                query = query.Where(p => p.ListingType == searchParams.ListingType);
            }

            if (!string.IsNullOrWhiteSpace(searchParams.Gender))
            {
                query = query.Where(p => p.Gender == searchParams.Gender);
            }

            if (!string.IsNullOrWhiteSpace(searchParams.Size))
            {
                query = query.Where(p => p.Size == searchParams.Size);
            }

            if (!string.IsNullOrWhiteSpace(searchParams.City))
            {
                query = query.Where(p => p.City.ToLower() == searchParams.City.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(searchParams.Province))
            {
                query = query.Where(p => p.Province.ToLower() == searchParams.Province.ToLower());
            }

            if (searchParams.MinPrice.HasValue)
            {
                query = query.Where(p => p.Price >= searchParams.MinPrice.Value);
            }

            if (searchParams.MaxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= searchParams.MaxPrice.Value);
            }

            if (!string.IsNullOrWhiteSpace(searchParams.Status))
            {
                query = query.Where(p => p.Status == searchParams.Status);
            }

            if (searchParams.IsFeatured.HasValue)
            {
                query = query.Where(p => p.IsFeatured == searchParams.IsFeatured.Value);
            }

            if (searchParams.IsUrgent.HasValue)
            {
                query = query.Where(p => p.IsUrgent == searchParams.IsUrgent.Value);
            }

            // Sorting
            query = searchParams.SortBy?.ToLower() switch
            {
                "oldest" => query.OrderBy(p => p.CreatedAt),
                "price-low" => query.OrderBy(p => p.Price ?? 0),
                "price-high" => query.OrderByDescending(p => p.Price ?? 0),
                _ => query.OrderByDescending(p => p.CreatedAt) // Default to newest
            };

            // Pagination
            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((searchParams.PageNumber - 1) * searchParams.PageSize)
                .Take(searchParams.PageSize)
                .ToListAsync();

            return new PagedResult<PetListing>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = searchParams.PageNumber,
                PageSize = searchParams.PageSize
            };
        }

        public async Task<List<PetListing>> GetByUserIdAsync(int userId)
        {
            return await _context.PetListings
                .Where(p => p.UserId == userId)
                .Include(p => p.Photos)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<PetListing>> GetFeaturedAsync(int limit = 10)
        {
            return await _context.PetListings
                .Where(p => p.IsFeatured && p.Status == "Approved")
                .Include(p => p.User)
                .Include(p => p.Photos)
                .OrderByDescending(p => p.CreatedAt)
                .Take(limit)
                .ToListAsync();
        }

        public async Task<List<PetListing>> GetSimilarAsync(Guid petListingId, int limit = 6)
        {
            var listing = await GetByIdAsync(petListingId);
            if (listing == null) return new List<PetListing>();

            return await _context.PetListings
                .Where(p => p.Id != petListingId &&
                           p.Status == "Approved" &&
                           (p.Species == listing.Species || p.Breed == listing.Breed))
                .Include(p => p.User)
                .Include(p => p.Photos)
                .OrderByDescending(p => p.CreatedAt)
                .Take(limit)
                .ToListAsync();
        }

        public async Task<List<PetListing>> GetNearbyAsync(double latitude, double longitude, double radiusKm, PetListingSearchParams filters)
        {
            // Simple distance calculation (for more accuracy, use PostGIS functions)
            var listings = await _context.PetListings
                .Where(p => p.Status == "Approved" && p.Latitude.HasValue && p.Longitude.HasValue)
                .Include(p => p.User)
                .Include(p => p.Photos)
                .ToListAsync();

            return listings
                .Where(p =>
                {
                    var distance = CalculateDistance(latitude, longitude, p.Latitude!.Value, p.Longitude!.Value);
                    return distance <= radiusKm;
                })
                .ToList();
        }

        public async Task<int> GetTotalCountAsync(PetListingSearchParams? filters = null)
        {
            if (filters == null)
                return await _context.PetListings.CountAsync();

            var query = _context.PetListings.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filters.Status))
                query = query.Where(p => p.Status == filters.Status);

            return await query.CountAsync();
        }

        public async Task<Dictionary<string, int>> GetCountBySpeciesAsync()
        {
            return await _context.PetListings
                .Where(p => p.Status == "Approved")
                .GroupBy(p => p.Species)
                .Select(g => new { Species = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Species, x => x.Count);
        }

        public async Task<Dictionary<string, int>> GetCountByProvinceAsync()
        {
            return await _context.PetListings
                .Where(p => p.Status == "Approved")
                .GroupBy(p => p.Province)
                .Select(g => new { Province = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Province, x => x.Count);
        }

        public async Task<List<PetListing>> GetPendingAsync()
        {
            return await _context.PetListings
                .Where(p => p.Status == "Pending")
                .Include(p => p.User)
                .Include(p => p.Photos)
                .OrderBy(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<PetListing>> GetByStatusAsync(string status)
        {
            return await _context.PetListings
                .Where(p => p.Status == status)
                .Include(p => p.User)
                .Include(p => p.Photos)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task IncrementViewCountAsync(Guid id)
        {
            var listing = await _context.PetListings.FindAsync(id);
            if (listing != null)
            {
                listing.Views++;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _context.PetListings.AnyAsync(p => p.Id == id);
        }

        public async Task<bool> IsOwnerAsync(Guid petListingId, int userId)
        {
            return await _context.PetListings.AnyAsync(p => p.Id == petListingId && p.UserId == userId);
        }

        public async Task<bool> AddToFavoritesAsync(int userId, Guid petListingId)
        {
            var exists = await _context.PetFavorites
                .AnyAsync(f => f.UserId == userId && f.PetListingId == petListingId);

            if (exists) return false;

            _context.PetFavorites.Add(new PetFavorite
            {
                UserId = userId,
                PetListingId = petListingId,
                CreatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveFromFavoritesAsync(int userId, Guid petListingId)
        {
            var favorite = await _context.PetFavorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.PetListingId == petListingId);

            if (favorite == null) return false;

            _context.PetFavorites.Remove(favorite);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<PetListing>> GetUserFavoritesAsync(int userId)
        {
            return await _context.PetFavorites
                .Where(f => f.UserId == userId)
                .Include(f => f.PetListing)
                    .ThenInclude(p => p.Photos)
                .Include(f => f.PetListing)
                    .ThenInclude(p => p.User)
                .Select(f => f.PetListing)
                .ToListAsync();
        }

        public async Task<bool> IsFavoritedAsync(int userId, Guid petListingId)
        {
            return await _context.PetFavorites
                .AnyAsync(f => f.UserId == userId && f.PetListingId == petListingId);
        }

        private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            // Haversine formula for calculating distance between two coordinates
            const double R = 6371; // Earth's radius in kilometers
            var dLat = ToRadians(lat2 - lat1);
            var dLon = ToRadians(lon2 - lon1);

            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }

        private double ToRadians(double degrees)
        {
            return degrees * Math.PI / 180;
        }
    }
}
