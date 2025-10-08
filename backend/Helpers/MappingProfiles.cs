// backend/Helpers/MappingProfiles.cs
using AutoMapper;
using Home4Paws.API.DTOs;
using Home4Paws.API.Models.Entities;

namespace Home4Paws.API.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            // Map from Product to ProductDto
            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : string.Empty));
            
            // Map from CreateUpdateProductDto to Product
            CreateMap<CreateUpdateProductDto, Product>();

            // Map from Category to CategoryDto
            CreateMap<Category, CategoryDto>();

            // Map from CreateUpdateCategoryDto to Category
            CreateMap<CreateUpdateCategoryDto, Category>();

            // Map from UserAddress to UserAddressDto
            CreateMap<UserAddress, UserAddressDto>();

            // Map from CreateUpdateUserAddressDto to UserAddress
            CreateMap<CreateUpdateUserAddressDto, UserAddress>()
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));
        }
    }
}