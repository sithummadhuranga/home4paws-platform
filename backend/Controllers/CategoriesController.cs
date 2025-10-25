// backend/Controllers/CategoriesController.cs

using AutoMapper;
using Home4Paws.API.Data;
using Home4Paws.API.DTOs;
using Home4Paws.API.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Home4Paws.API.Controllers;

[ApiController]
[Route("api/[controller]")] // Sets the base route to /api/categories
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<CategoriesController> _logger;

    public CategoriesController(ApplicationDbContext context, IMapper mapper, ILogger<CategoriesController> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    // GET: api/categories
    // Public endpoint for anyone to view all categories (e.g., for filtering or admin dropdowns).
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
    {
        var categories = await _context.Categories
            .OrderBy(c => c.Name)
            .ToListAsync();
            
        return Ok(_mapper.Map<IEnumerable<CategoryDto>>(categories));
    }

    // GET: api/categories/5
    // Public endpoint to view a single category by its ID.
    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryDto>> GetCategory(int id)
    {
        var category = await _context.Categories.FindAsync(id);

        if (category == null)
        {
            return NotFound(new { Message = $"Category with ID {id} not found." });
        }

        return Ok(_mapper.Map<CategoryDto>(category));
    }

    // --- PROTECTED ADMIN ROUTES ---

    // POST: api/categories
    // Admin-only endpoint to create a new category.
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] CreateUpdateCategoryDto categoryDto)
    {
        var category = _mapper.Map<Category>(categoryDto);

        await _context.Categories.AddAsync(category);
        await _context.SaveChangesAsync();
        
        var categoryToReturn = _mapper.Map<CategoryDto>(category);

        return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, categoryToReturn);
    }

    // PUT: api/categories/5
    // Admin-only endpoint to update an existing category.
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] CreateUpdateCategoryDto categoryDto)
    {
        var categoryFromDb = await _context.Categories.FindAsync(id);
        
        if (categoryFromDb == null)
        {
            return NotFound(new { Message = $"Category with ID {id} not found for update." });
        }
        
        _mapper.Map(categoryDto, categoryFromDb);
        await _context.SaveChangesAsync();

        return NoContent(); // Success, no content to return
    }

    // DELETE: api/categories/5
    // Admin-only endpoint to delete a category.
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _context.Categories
            .Include(c => c.Products) // Check if there are any products in this category
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
        {
            return NotFound(new { Message = $"Category with ID {id} not found for deletion." });
        }

        // **Important Safety Check**
        // Prevent deleting a category if it still contains products.
        if (category.Products.Any())
        {
            return BadRequest(new { Message = "Cannot delete category because it contains products. Please reassign or delete the products first." });
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent(); // Success, no content to return
    }
}