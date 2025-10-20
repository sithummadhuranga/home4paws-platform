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
    public class AdoptionService : IAdoptionService
    {
        private readonly IAdoptionListingRepository _listingRepo;
        private readonly IMapper _mapper;

        public AdoptionService(IAdoptionListingRepository listingRepo, IMapper mapper)
        {
            _listingRepo = listingRepo;
            _mapper = mapper;
        }

        public async Task<(IEnumerable<AdoptionListingDto> Listings, int Total)> GetApprovedListings(string? petType, string? city, int page, int pageSize)
        {
            var total = await _listingRepo.CountApprovedAsync(petType, city, "Approved");
            var items = await _listingRepo.GetApprovedAsync(petType, city, "Approved", page, pageSize);
            return (_mapper.Map<IEnumerable<AdoptionListingDto>>(items), total);
        }

        public async Task<AdoptionListingDto?> GetById(int id)
        {
            var listing = await _listingRepo.GetByIdAsync(id);
            if (listing == null || listing.Status != "Approved") return null;
            return _mapper.Map<AdoptionListingDto>(listing);
        }

        public async Task<IEnumerable<AdoptionListingDto>> GetMyListings(int userId)
        {
            var items = await _listingRepo.GetByUserAsync(userId);
            return _mapper.Map<IEnumerable<AdoptionListingDto>>(items);
        }

        public async Task<AdoptionListingDto> Create(int userId, CreateAdoptionListingDto dto)
        {
            var entity = _mapper.Map<AdoptionListing>(dto);
            entity.UserId = userId;
            entity.Status = "Pending";
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;

            await _listingRepo.AddAsync(entity);
            return _mapper.Map<AdoptionListingDto>(entity);
        }

        public async Task<AdoptionListingDto?> Update(int id, int userId, UpdateAdoptionListingDto dto)
        {
            var existing = await _listingRepo.GetByIdAsync(id);
            if (existing == null || existing.UserId != userId) return null;
            if (existing.Status == "Approved")
            {
                // On update after approval, revert to Pending for re-approval
                existing.Status = "Pending";
                existing.ApprovedAt = null;
                existing.ApprovedByAdminId = null;
            }

            // Map only provided fields
            if (dto.PetName != null) existing.PetName = dto.PetName;
            if (dto.PetType != null) existing.PetType = dto.PetType;
            if (dto.Breed != null) existing.Breed = dto.Breed;
            if (dto.AgeYears.HasValue) existing.AgeYears = dto.AgeYears;
            if (dto.AgeMonths.HasValue) existing.AgeMonths = dto.AgeMonths;
            if (dto.Gender != null) existing.Gender = dto.Gender;
            if (dto.Size != null) existing.Size = dto.Size;
            if (dto.Color != null) existing.Color = dto.Color;
            if (dto.Description != null) existing.Description = dto.Description;

            if (dto.HealthStatus != null) existing.HealthStatus = dto.HealthStatus;
            if (dto.VaccinationStatus != null) existing.VaccinationStatus = dto.VaccinationStatus;
            if (dto.IsSpayedNeutered.HasValue) existing.IsSpayedNeutered = dto.IsSpayedNeutered.Value;
            if (dto.IsHouseTrained.HasValue) existing.IsHouseTrained = dto.IsHouseTrained.Value;
            if (dto.GoodWithKids.HasValue) existing.GoodWithKids = dto.GoodWithKids.Value;
            if (dto.GoodWithPets.HasValue) existing.GoodWithPets = dto.GoodWithPets.Value;
            if (dto.EnergyLevel != null) existing.EnergyLevel = dto.EnergyLevel;
            if (dto.SpecialNeeds != null) existing.SpecialNeeds = dto.SpecialNeeds;

            if (dto.AdoptionType != null) existing.AdoptionType = dto.AdoptionType;
            if (dto.AdoptionFee.HasValue) existing.AdoptionFee = dto.AdoptionFee.Value;
            if (dto.RehomingReason != null) existing.RehomingReason = dto.RehomingReason;

            if (dto.ContactName != null) existing.ContactName = dto.ContactName;
            if (dto.ContactPhone != null) existing.ContactPhone = dto.ContactPhone;
            if (dto.ContactEmail != null) existing.ContactEmail = dto.ContactEmail;
            if (dto.Location != null) existing.Location = dto.Location;
            if (dto.City != null) existing.City = dto.City;
            if (dto.Province != null) existing.Province = dto.Province;
            if (dto.District != null) existing.District = dto.District;
            if (dto.Latitude.HasValue) existing.Latitude = dto.Latitude;
            if (dto.Longitude.HasValue) existing.Longitude = dto.Longitude;

            if (dto.PhotoUrls != null) existing.PhotoUrls = dto.PhotoUrls;
            if (dto.VideoUrl != null) existing.VideoUrl = dto.VideoUrl;

            existing.UpdatedAt = DateTime.UtcNow;
            await _listingRepo.UpdateAsync(existing);
            return _mapper.Map<AdoptionListingDto>(existing);
        }

        public async Task<bool> Delete(int id, int userId)
        {
            var existing = await _listingRepo.GetByIdAsync(id);
            if (existing == null || existing.UserId != userId) return false;
            await _listingRepo.DeleteAsync(existing);
            return true;
        }

        public async Task<bool> MarkAsAdopted(int id, int userId)
        {
            var existing = await _listingRepo.GetByIdAsync(id);
            if (existing == null || existing.UserId != userId) return false;
            existing.Status = "Adopted";
            existing.AdoptedAt = DateTime.UtcNow;
            existing.UpdatedAt = DateTime.UtcNow;
            await _listingRepo.UpdateAsync(existing);
            return true;
        }

        public async Task<IEnumerable<AdoptionListingDto>> GetPending(int page, int pageSize)
        {
            var items = await _listingRepo.GetPendingAsync(page, pageSize);
            return _mapper.Map<IEnumerable<AdoptionListingDto>>(items);
        }

        public async Task<bool> Approve(int id, int adminId, string? notes)
        {
            var existing = await _listingRepo.GetByIdAsync(id);
            if (existing == null || existing.Status != "Pending") return false;
            existing.Status = "Approved";
            existing.ApprovedByAdminId = adminId;
            existing.ApprovedAt = DateTime.UtcNow;
            existing.AdminNotes = notes;
            existing.UpdatedAt = DateTime.UtcNow;
            await _listingRepo.UpdateAsync(existing);
            return true;
        }

        public async Task<bool> Reject(int id, int adminId, string reason)
        {
            var existing = await _listingRepo.GetByIdAsync(id);
            if (existing == null || existing.Status != "Pending") return false;
            existing.Status = "Rejected";
            existing.ApprovedByAdminId = adminId;
            existing.RejectionReason = reason;
            existing.UpdatedAt = DateTime.UtcNow;
            await _listingRepo.UpdateAsync(existing);
            return true;
        }
    }
}
