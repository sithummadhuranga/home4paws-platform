// backend/DTOs/CreateUpdateCategoryDto.cs
using System.ComponentModel.DataAnnotations;

namespace Home4Paws.API.DTOs
{
    public class CreateUpdateCategoryDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }
    }
}