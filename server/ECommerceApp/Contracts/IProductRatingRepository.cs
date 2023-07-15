using ECommerceApp.Dto;

namespace ECommerceApp.Contracts
{
    public interface IProductRatingRepository
    {
        public Task<ProductRatingsPagination> GetProductRatings(int productId, int pageNo, int pageSize);
        public Task<ProductRating> GetProductRating(int productId, int orderId, string userId);
        public Task CreateOrUpdateRating(ProductRating productRating);
        public Task<dynamic> GetRecommendedProducts(string userId);
        public Task<dynamic> GetMostSelledProducts(int minRating);
        public Task<IEnumerable<CategoryRating>> GetMostSelledCategories();
    }
}
