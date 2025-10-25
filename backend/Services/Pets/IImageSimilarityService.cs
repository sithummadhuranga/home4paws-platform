using System.Collections.Generic;
using System.Threading.Tasks;
using Home4Paws.API.Models.Pets;

namespace Home4Paws.API.Services.Pets
{
    public interface IImageSimilarityService
    {
        Task<Dictionary<string, double>> GetImageSimilarityScores(string sourceImageUrl, List<string> comparisonImageUrls);
        Task<List<PetReportResponse>> FindSimilarPets(PetReportResponse sourceReport, List<PetReportResponse> potentialMatches);
        Task<bool> IsLikelyDuplicate(string newImageUrl, List<string> existingImageUrls);
        Task<ImageSimilarityService.ImageFeatures> ExtractPetFeatures(string imageUrl);
    }
}