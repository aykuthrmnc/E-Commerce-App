using ECommerceApp.Dto;

namespace ECommerceApp.Contracts
{
    public interface IProductRepository
    {
        public Task<ProductPagination> GetProducts(int pageNo, int pageSize);
        public Task<ProductForCategoryListDto> GetProductById(int id);
        public Task<ProductForCategoryListDtoPagination> GetProductsByCategoryId(int id, int pageNo, int pageSize);
        public Task<Product> CreateProduct(Product product);
        public Task UpdateProduct(Product product);
        public Task DeleteProduct(int id);
        public Task<IEnumerable<ProductImages>> GetProductImagesByProductId(int id);
        public Task<ProductImages> AddImagesToProduct(ProductImages productImages);
        public Task AddMultipleImagesToProduct(ProductImagesMultiple productImagesMultiple);
        public Task DeleteImagesByProductId(int productId);
        public Task DeleteImageById(int id);
        public Task<SearchDtoPagination> SearchItems(string? searchString, int pageNo, int pageSize);

        public Task<bool> IsProductUrlUnique(string url);
    }
}
