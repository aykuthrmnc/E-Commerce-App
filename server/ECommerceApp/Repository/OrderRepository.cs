using Dapper;
using ECommerceApp.Context;
using ECommerceApp.Contracts;
using ECommerceApp.Dto;
using System.Data;

namespace ECommerceApp.Repository
{
    public class OrderRepository : IOrderRepository
    {
        private readonly IDbConnection connection;
        public OrderRepository(DapperContext context)
        {
            connection = context.CreateConnection();
        }

        public async Task<IEnumerable<OrderDto>> GetOrder(string userId)
        {
            var query = "SELECT * FROM Orders WHERE UserId = @UserId ORDER BY CreatedAt DESC";
            var orders = await connection.QueryAsync<OrderDto>(query, new { userId });

            foreach (var order in orders)
            {
                var subQuery = "SELECT OrderItems.Id, OrderItems.OrderId, OrderItems.ProductId, OrderItems.Price, OrderItems.Quantity, Products.Name, Products.Url, Products.Description, Products.ImageUrl FROM OrderItems INNER JOIN Products ON OrderItems.ProductId = Products.Id WHERE OrderId = @OrderId";
                var orderItems = await connection.QueryAsync<OrderItemDto>(subQuery, new { OrderId = order.Id });
                order.OrderItems = orderItems.ToList();
            }

            return orders;
        }

        public async Task<OrderDto> GetOrderById(string userId, int orderId)
        {
            var query = "SELECT * FROM Orders WHERE UserId = @UserId AND Id = @OrderId ORDER BY CreatedAt DESC";
            var order = await connection.QuerySingleOrDefaultAsync<OrderDto>(query, new { userId, orderId });

            if (order is not null)
            {
                var subQuery = "SELECT OrderItems.Id, OrderItems.OrderId, OrderItems.ProductId, OrderItems.Price, OrderItems.Quantity, Products.Name, Products.Url, Products.Description, Products.ImageUrl FROM OrderItems INNER JOIN Products ON OrderItems.ProductId = Products.Id WHERE OrderId = @OrderId";
                var orderItems = await connection.QueryAsync<OrderItemDto>(subQuery, new { OrderId = order.Id });
                order.OrderItems = orderItems.ToList();
            }
            return order;
        }

        public async Task CreateOrder(string userId, Order order, IEnumerable<CartDto> cart)
        {
            var query = "INSERT INTO Orders (UserId, FirstName, LastName, PhoneNumber, Email, AddressLine1, Country, City, ZipCode, Description) OUTPUT INSERTED.[Id] VALUES (@UserId, @FirstName, @LastName, @PhoneNumber, @Email, @AddressLine1, @Country, @City, @ZipCode, @Description)";
            var orderId = await connection.QuerySingleAsync<int>(query, new { userId, order.FirstName, order.LastName, order.PhoneNumber, order.Email, order.AddressLine1, order.Country, order.City, order.ZipCode, order.Description });

            var subQuery = "INSERT INTO OrderItems (OrderId, ProductId, Price, Quantity) values (@OrderId, @ProductId, @Price, @Quantity)";
            foreach (var cartItem in cart)
            {
                await connection.QueryAsync(subQuery, new { orderId, cartItem.ProductId, cartItem.Price, cartItem.Quantity });
            }
        }
    }
}
