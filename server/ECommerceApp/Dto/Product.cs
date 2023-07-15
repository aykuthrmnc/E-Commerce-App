using ECommerceApp.Annotations;

namespace ECommerceApp.Dto
{
    public class Product
    {
        public int Id { get; set; }
        public int? CategoryId { get; set; }
        public string? Name { get; set; }
        public string? Url { get; set; }
        public decimal? Price { get; set; }
        public int? Quantity { get; set; }
        public decimal? Discount { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsApproved { get; set; }
        public bool? IsHome { get; set; }
        [AllowedExtensions(new string[] { ".jpg", ".jpeg", ".png", ".webp" })]
        public IFormFile? File { get; set; }
        public IEnumerable<ProductImages>? ProductImages { get; set; }
        //public DateTime? CreatedAt { get; set; }
        //public DateTime? ModifiedAt { get; set; }
        //public DateTime? DeletedAt { get; set; }
    }
    public class Pagination
    {
        public int PageNo { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
    }
    public class ProductPagination : Pagination
    {
        public IEnumerable<Product>? Products { get; set; }
    }

    public class ProductForCategoryListDto : Product
    {
        public string? CategoryName { get; set; }
        public string? CategoryUrl { get; set; }
        public int MainCategoryId { get; set; }
        public ProductTotalRating? ProductTotalRating { get; set; }
    }

    public class ProductForCategoryListDtoPagination : Pagination
    {
        public IEnumerable<ProductForCategoryListDto>? Products { get; set; }
    }
}
