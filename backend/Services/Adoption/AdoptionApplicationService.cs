using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Home4Paws.API.DataManager;
using Home4Paws.API.DTOs;
using Home4Paws.API.Models.Entities;

namespace Home4Paws.API.Services.Adoption
{
    public class AdoptionApplicationService : IAdoptionApplicationService
    {
        private readonly IAdoptionApplicationRepository _appRepo;
        private readonly IAdoptionListingRepository _listingRepo;
        private readonly IMapper _mapper;

        public AdoptionApplicationService(
            IAdoptionApplicationRepository appRepo,
            IAdoptionListingRepository listingRepo,
            IMapper mapper)
        {
            _appRepo = appRepo;
            _listingRepo = listingRepo;
            _mapper = mapper;
        }

        public async Task<AdoptionApplicationDto> Submit(int userId, CreateAdoptionApplicationDto dto)
        {
            var listing = await _listingRepo.GetByIdAsync(dto.ListingId);
            if (listing == null || listing.Status != "Approved")
            {
                throw new InvalidOperationException("Listing not available for applications");
            }
            if (listing.UserId == userId)
            {
                throw new InvalidOperationException("Owners cannot apply to their own listing");
            }

            var entity = _mapper.Map<AdoptionApplication>(dto);
            entity.ApplicantId = userId;
            entity.Status = "Pending";
            entity.AppliedAt = DateTime.UtcNow;

            await _appRepo.AddAsync(entity);
            return _mapper.Map<AdoptionApplicationDto>(entity);
        }

        public async Task<IEnumerable<AdoptionApplicationDto>> GetByListing(int listingId, int ownerId)
        {
            var listing = await _listingRepo.GetByIdAsync(listingId);
            if (listing == null || listing.UserId != ownerId)
            {
                return Enumerable.Empty<AdoptionApplicationDto>();
            }
            var items = await _appRepo.GetByListingAsync(listingId);
            return _mapper.Map<IEnumerable<AdoptionApplicationDto>>(items);
        }

        public async Task<IEnumerable<AdoptionApplicationDto>> GetMyApplications(int userId)
        {
            var items = await _appRepo.GetByApplicantAsync(userId);
            return _mapper.Map<IEnumerable<AdoptionApplicationDto>>(items);
        }

        public async Task<bool> UpdateStatus(int applicationId, int ownerId, string status, string? ownerNotes)
        {
            var app = await _appRepo.GetByIdAsync(applicationId);
            if (app == null) return false;

            var listing = await _listingRepo.GetByIdAsync(app.ListingId);
            if (listing == null || listing.UserId != ownerId) return false;

            if (status != "Approved" && status != "Rejected") return false;

            app.Status = status;
            app.OwnerNotes = ownerNotes;
            app.ReviewedAt = DateTime.UtcNow;
            app.UpdatedAt = DateTime.UtcNow;
            await _appRepo.UpdateAsync(app);

            if (status == "Approved")
            {
                listing.Status = "Adopted";
                listing.AdoptedAt = DateTime.UtcNow;
                await _listingRepo.UpdateAsync(listing);
            }

            return true;
        }

        public async Task<bool> Withdraw(int applicationId, int userId)
        {
            var app = await _appRepo.GetByIdAsync(applicationId);
            if (app == null || app.ApplicantId != userId) return false;
            if (app.Status != "Pending") return false;
            app.Status = "Withdrawn";
            app.UpdatedAt = DateTime.UtcNow;
            await _appRepo.UpdateAsync(app);
            return true;
        }
    }
}
