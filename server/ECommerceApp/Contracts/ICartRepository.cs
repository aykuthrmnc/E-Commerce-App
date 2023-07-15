using ECommerceApp.Dto;

namespace ECommerceApp.Contracts
{
    public interface ICartRepository
    {
        public Task<IEnumerable<CartDto>> GetCart(string userId);
        public Task<CartDto> GetCartProductById(string userId, int productId);
        public Task<CartDto> AddProductToCart(string userId, Cart cart);
        public Task UpdateProductCart(string userId, Cart cart);
        public Task AddOrUpdateCart(string userId, Cart cart);
        public Task DeleteCart(int id);
        public Task ClearCart(string userId);
    }
}
