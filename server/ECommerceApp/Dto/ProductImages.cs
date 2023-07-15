using ECommerceApp.Annotations;

namespace ECommerceApp.Dto
{
    public class ProductImages
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ImageUrl { get; set; } = null!;
        public IFormFile File { get; set; }
    }

    public class ProductImagesMultiple
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ImageUrl { get; set; } = null!;
        [AllowedMultipleExtensions(new string[] { ".jpg", ".jpeg", ".png", ".webp" })]
        public IList<IFormFile> File { get; set; }
    }
}
