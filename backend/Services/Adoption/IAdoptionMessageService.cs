using System.Collections.Generic;
using System.Threading.Tasks;
using Home4Paws.API.DTOs;

namespace Home4Paws.API.Services.Adoption
{
    public interface IAdoptionMessageService
    {
        Task<AdoptionMessageDto> SendMessageAsync(int userId, SendAdoptionMessageDto dto);
        Task<IEnumerable<AdoptionMessageDto>> GetConversationAsync(int listingId, int userId);
        Task<IEnumerable<AdoptionMessageDto>> GetUserMessagesAsync(int userId);
        Task MarkAsReadAsync(int messageId, int userId);
        Task<int> GetUnreadCountAsync(int userId);
        Task<Dictionary<int, int>> GetUnreadCountsByUserListingsAsync(int userId);
    }
}

