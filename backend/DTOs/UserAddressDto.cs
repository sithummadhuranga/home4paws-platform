using System.ComponentModel.DataAnnotations;

namespace Home4Paws.API.DTOs
{
    public class UserAddressDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string AddressType { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string? Apartment { get; set; }
        public string City { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public bool IsDefault { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateUpdateUserAddressDto
    {
        [Required]
        [StringLength(50)]
        public string AddressType { get; set; } = "Shipping";
        
        [Required]
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;
        
        [Required]
        [Phone]
        public string Phone { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [StringLength(255)]
        public string Address { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string? Apartment { get; set; }
        
        [Required]
        [StringLength(100)]
        public string City { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Province { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string District { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string PostalCode { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string Country { get; set; } = "Sri Lanka";
        
        public bool IsDefault { get; set; } = false;
    }
}