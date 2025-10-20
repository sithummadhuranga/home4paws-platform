using System.Collections.Generic;
using System.Threading.Tasks;
using Home4Paws.API.Models.Entities;

namespace Home4Paws.API.DataManager
{
    public interface IAdoptionMessageRepository
    {
        Task<AdoptionMessage> CreateAsync(AdoptionMessage message);
        Task<AdoptionMessage?> GetByIdAsync(int id);
        Task<IEnumerable<AdoptionMessage>> GetByListingIdAsync(int listingId);
        Task<IEnumerable<AdoptionMessage>> GetConversationAsync(int listingId, int userId);
        Task<IEnumerable<AdoptionMessage>> GetUserMessagesAsync(int userId);
        Task MarkAsReadAsync(int messageId);
        Task<int> GetUnreadCountAsync(int userId);
        Task<int> GetUnreadCountByListingAsync(int listingId, int userId);
        Task<Dictionary<int, int>> GetUnreadCountsByUserListingsAsync(int userId);
    }
}

