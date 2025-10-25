using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Home4Paws.API.Data;
using Home4Paws.API.Models.Entities;
using Home4Paws.API.Models.Pets;
using Microsoft.EntityFrameworkCore;

namespace Home4Paws.API.DataManager
{
    public class PetReportRepository : IPetReportRepository
    {
        private readonly ApplicationDbContext _context;

        public PetReportRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PetReport>> GetAllAsync(PetReportSearchParams searchParams)
        {
            var query = _context.PetReports.AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchParams.Type))
            {
                query = query.Where(p => p.Type.ToLower() == searchParams.Type.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(searchParams.ReportType))
            {
                query = query.Where(p => p.ReportType.ToLower() == searchParams.ReportType.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(searchParams.Location))
            {
                query = query.Where(p => p.Location.ToLower().Contains(searchParams.Location.ToLower()));
            }

            if (!string.IsNullOrWhiteSpace(searchParams.Status))
            {
                query = query.Where(p => p.Status.ToLower() == searchParams.Status.ToLower());
            }

            if (searchParams.FromDate.HasValue)
            {
                query = query.Where(p => p.LostOrFoundDate >= searchParams.FromDate.Value);
            }

            if (searchParams.ToDate.HasValue)
            {
                query = query.Where(p => p.LostOrFoundDate <= searchParams.ToDate.Value);
            }

            return await query
                .OrderByDescending(p => p.DateReported)
                .ToListAsync();
        }

        public async Task<PetReport> GetByIdAsync(Guid id)
        {
            return await _context.PetReports.FindAsync(id);
        }

        public async Task<PetReport> CreateAsync(PetReport petReport)
        {
            _context.PetReports.Add(petReport);
            await _context.SaveChangesAsync();
            return petReport;
        }

        public async Task<PetReport> UpdateAsync(PetReport petReport)
        {
            petReport.UpdatedAt = DateTime.UtcNow;
            _context.PetReports.Update(petReport);
            await _context.SaveChangesAsync();
            return petReport;
        }

        public async Task DeleteAsync(Guid id)
        {
            var petReport = await _context.PetReports.FindAsync(id);
            if (petReport != null)
            {
                _context.PetReports.Remove(petReport);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _context.PetReports.AnyAsync(p => p.Id == id);
        }

        public async Task<bool> IsPendingAsync(Guid id)
        {
            var report = await _context.PetReports.FindAsync(id);
            return report?.Status == "Pending Confirmation";
        }
    }
}