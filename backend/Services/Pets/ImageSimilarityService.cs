using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Home4Paws.API.Models.Pets;

namespace Home4Paws.API.Services.Pets
{
    public class ImageSimilarityService : IImageSimilarityService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<ImageSimilarityService> _logger;
        private readonly string _aiServiceUrl;

        public ImageSimilarityService(
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            ILogger<ImageSimilarityService> logger)
        {
            _httpClient = httpClientFactory.CreateClient("ImageAI");
            _aiServiceUrl = configuration["AIServices:ImageSimilarity:Url"];
            _logger = logger;
        }

        public async Task<Dictionary<string, double>> GetImageSimilarityScores(string sourceImageUrl, List<string> comparisonImageUrls)
        {
            try
            {
                var request = new
                {
                    sourceImage = sourceImageUrl,
                    comparisonImages = comparisonImageUrls
                };

                var response = await _httpClient.PostAsJsonAsync(_aiServiceUrl + "/compare", request);
                response.EnsureSuccessStatusCode();

                var result = await response.Content.ReadFromJsonAsync<Dictionary<string, double>>();
                return result ?? new Dictionary<string, double>();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in image similarity check: {ex.Message}");
                return new Dictionary<string, double>();
            }
        }

        public async Task<List<PetReportResponse>> FindSimilarPets(PetReportResponse sourceReport, List<PetReportResponse> potentialMatches)
        {
            try
            {
                if (!sourceReport.PhotoUrls.Any() || !potentialMatches.Any())
                {
                    return new List<PetReportResponse>();
                }

                // Get all comparison image URLs
                var comparisonUrls = potentialMatches
                    .SelectMany(p => p.PhotoUrls)
                    .ToList();

                // For each source image, get similarity scores
                var allScores = new Dictionary<Guid, double>();
                
                foreach (var sourceImage in sourceReport.PhotoUrls)
                {
                    var scores = await GetImageSimilarityScores(sourceImage, comparisonUrls);
                    
                    // Aggregate scores by report
                    foreach (var match in potentialMatches)
                    {
                        var reportMaxScore = match.PhotoUrls
                            .Select(url => scores.GetValueOrDefault(url, 0.0))
                            .Max();

                        if (!allScores.ContainsKey(match.Id))
                        {
                            allScores[match.Id] = reportMaxScore;
                        }
                        else
                        {
                            allScores[match.Id] = Math.Max(allScores[match.Id], reportMaxScore);
                        }
                    }
                }

                // Filter and sort matches by similarity score
                var threshold = 0.7; // 70% similarity threshold
                return potentialMatches
                    .Where(m => allScores.GetValueOrDefault(m.Id, 0.0) >= threshold)
                    .OrderByDescending(m => allScores[m.Id])
                    .ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error finding similar pets: {ex.Message}");
                return new List<PetReportResponse>();
            }
        }

        public async Task<bool> IsLikelyDuplicate(string newImageUrl, List<string> existingImageUrls)
        {
            try
            {
                var scores = await GetImageSimilarityScores(newImageUrl, existingImageUrls);
                return scores.Values.Any(score => score > 0.95); // 95% similarity threshold for duplicates
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error checking for duplicate images: {ex.Message}");
                return false;
            }
        }

        public class ImageFeatures
        {
            public string Color { get; set; }
            public string Pattern { get; set; }
            public List<string> DistinctiveMarks { get; set; }
            public double Confidence { get; set; }
        }

        public async Task<ImageFeatures> ExtractPetFeatures(string imageUrl)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync(_aiServiceUrl + "/analyze", new { imageUrl });
                response.EnsureSuccessStatusCode();

                return await response.Content.ReadFromJsonAsync<ImageFeatures>();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error extracting pet features: {ex.Message}");
                return null;
            }
        }
    }
}