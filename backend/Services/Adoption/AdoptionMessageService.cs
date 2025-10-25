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
    public class AdoptionMessageService : IAdoptionMessageService
    {
        private readonly IAdoptionMessageRepository _messageRepo;
        private readonly IAdoptionListingRepository _listingRepo;
        private readonly IMapper _mapper;

        public AdoptionMessageService(
            IAdoptionMessageRepository messageRepo,
            IAdoptionListingRepository listingRepo,
            IMapper mapper)
        {
            _messageRepo = messageRepo;
            _listingRepo = listingRepo;
            _mapper = mapper;
        }

        public async Task<AdoptionMessageDto> SendMessageAsync(int userId, SendAdoptionMessageDto dto)
        {
            var listing = await _listingRepo.GetByIdAsync(dto.ListingId);
            if (listing == null) throw new KeyNotFoundException("Listing not found.");
            if (listing.Status != "Approved") throw new InvalidOperationException("Can only message on approved listings.");

            var message = new AdoptionMessage
            {
                ListingId = dto.ListingId,
                SenderId = userId,
                ReceiverId = listing.UserId, // Send to listing owner
                Message = dto.Message,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            var created = await _messageRepo.CreateAsync(message);
            
            // Manually map since we need to include related entities
            return new AdoptionMessageDto
            {
                Id = created.Id,
                ListingId = created.ListingId,
                PetName = listing.PetName,
                SenderId = created.SenderId,
                SenderName = "", // Will be populated from included entities in repository
                ReceiverId = created.ReceiverId,
                ReceiverName = "",
                Message = created.Message,
                IsRead = created.IsRead,
                CreatedAt = created.CreatedAt
            };
        }

        public async Task<IEnumerable<AdoptionMessageDto>> GetConversationAsync(int listingId, int userId)
        {
            var messages = await _messageRepo.GetConversationAsync(listingId, userId);
            return messages.Select(m => new AdoptionMessageDto
            {
                Id = m.Id,
                ListingId = m.ListingId,
                PetName = m.Listing?.PetName ?? "",
                SenderId = m.SenderId,
                SenderName = m.Sender != null ? $"{m.Sender.FirstName} {m.Sender.LastName}" : "",
                ReceiverId = m.ReceiverId,
                ReceiverName = m.Receiver != null ? $"{m.Receiver.FirstName} {m.Receiver.LastName}" : "",
                Message = m.Message,
                IsRead = m.IsRead,
                CreatedAt = m.CreatedAt
            });
        }

        public async Task<IEnumerable<AdoptionMessageDto>> GetUserMessagesAsync(int userId)
        {
            var messages = await _messageRepo.GetUserMessagesAsync(userId);
            return messages.Select(m => new AdoptionMessageDto
            {
                Id = m.Id,
                ListingId = m.ListingId,
                PetName = m.Listing?.PetName ?? "",
                SenderId = m.SenderId,
                SenderName = m.Sender != null ? $"{m.Sender.FirstName} {m.Sender.LastName}" : "",
                ReceiverId = m.ReceiverId,
                ReceiverName = m.Receiver != null ? $"{m.Receiver.FirstName} {m.Receiver.LastName}" : "",
                Message = m.Message,
                IsRead = m.IsRead,
                CreatedAt = m.CreatedAt
            });
        }

        public async Task MarkAsReadAsync(int messageId, int userId)
        {
            await _messageRepo.MarkAsReadAsync(messageId);
        }

        public async Task<int> GetUnreadCountAsync(int userId)
        {
            return await _messageRepo.GetUnreadCountAsync(userId);
        }

        public async Task<Dictionary<int, int>> GetUnreadCountsByUserListingsAsync(int userId)
        {
            return await _messageRepo.GetUnreadCountsByUserListingsAsync(userId);
        }
    }
}

