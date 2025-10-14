using System;
using System.Threading.Tasks;
using Home4Paws.API.Models.Pets;
using Home4Paws.API.Services.Pets;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Home4Paws.API.Controllers
{
    [ApiController]
    [Route("api/reports")]
    public class PetReportsController : ControllerBase
    {
        private readonly IPetReportService _petReportService;
        private readonly ILocationSearchService _locationSearchService;
        private readonly IImageSimilarityService _imageSimilarityService;

        public PetReportsController(
            IPetReportService petReportService,
            ILocationSearchService locationSearchService,
            IImageSimilarityService imageSimilarityService)
        {
            _petReportService = petReportService;
            _locationSearchService = locationSearchService;
            _imageSimilarityService = imageSimilarityService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll([FromQuery] PetReportSearchParams searchParams)
        {
            var reports = await _petReportService.GetAllAsync(searchParams);
            return Ok(reports);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(Guid id)
        {
            var report = await _petReportService.GetByIdAsync(id);
            if (report == null) return NotFound();
            return Ok(report);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromForm] CreatePetReportRequest request)
        {
            try
            {
                var report = await _petReportService.CreateAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = report.Id }, report);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(Guid id, [FromForm] UpdatePetReportRequest request)
        {
            try
            {
                var report = await _petReportService.UpdateAsync(id, request);
                if (report == null) return NotFound();
                return Ok(report);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _petReportService.DeleteAsync(id);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("statistics")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetStatistics([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var stats = await _petReportService.GetStatisticsAsync();
            return Ok(stats);
        }

        [HttpGet("hotspots")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetHotspots()
        {
            var hotspots = await _locationSearchService.GetHotspotAreas();
            return Ok(hotspots);
        }

        [HttpGet("similar/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> FindSimilar(Guid id)
        {
            var report = await _petReportService.GetByIdAsync(id);
            if (report == null) return NotFound();

            var similarReports = await _imageSimilarityService.FindSimilarPets(
                report,
                (await _petReportService.GetAllAsync(new PetReportSearchParams
                {
                    Type = report.Type,
                    ReportType = report.ReportType == "Lost" ? "Found" : "Lost"
                })).ToList()
            );

            return Ok(similarReports);
        }

        [HttpGet("nearby")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> SearchNearby(
            [FromQuery] double latitude,
            [FromQuery] double longitude,
            [FromQuery] double radiusKm,
            [FromQuery] PetReportSearchParams filters)
        {
            var results = await _locationSearchService.SearchByRadius(latitude, longitude, radiusKm, filters);
            return Ok(results);
        }
    }
}