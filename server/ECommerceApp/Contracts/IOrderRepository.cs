using ECommerceApp.Dto;

namespace ECommerceApp.Contracts
{
    public interface IOrderRepository
    {
        public Task<IEnumerable<OrderDto>> GetOrder(string userId);
        public Task<OrderDto> GetOrderById(string userId, int orderId);
        public Task CreateOrder(string userId, Order order, IEnumerable<CartDto> cart);
    }
}
