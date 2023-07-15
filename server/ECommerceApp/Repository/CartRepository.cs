using Dapper;
using ECommerceApp.Context;
using ECommerceApp.Contracts;
using ECommerceApp.Dto;
using System.Data;

namespace ECommerceApp.Repository
{
    public class CartRepository : ICartRepository
    {
        private readonly IDbConnection connection;
        public CartRepository(DapperContext context)
        {
            connection = context.CreateConnection();
        }

        public async Task<IEnumerable<CartDto>> GetCart(string userId)
        {
            var query = "SELECT Carts.Id, Carts.ProductId, Carts.Quantity, Products.Name, Products.Url, Products.ImageUrl, Products.Price, Products.Discount, Categories.Name CategoryName, Categories.Url CategoryUrl FROM Carts INNER JOIN Products ON Products.Id = Carts.ProductId INNER JOIN Categories ON Categories.Id = Products.CategoryId WHERE UserId = @UserId";
            var cart = await connection.QueryAsync<CartDto>(query, new { userId });
            return cart;
        }
        public async Task<CartDto> GetCartProductById(string userId, int productId)
        {
            var query = "SELECT Carts.Id, Carts.ProductId, Carts.Quantity, Products.Name, Products.Url, Products.ImageUrl, Products.Price, Products.Discount, Categories.Name CategoryName, Categories.Url CategoryUrl FROM Carts INNER JOIN Products ON Products.Id = Carts.ProductId INNER JOIN Categories ON Categories.Id = Products.CategoryId WHERE UserId = @UserId AND ProductId = @ProductId";

            var cart = await connection.QuerySingleOrDefaultAsync<CartDto>(query, new { userId, productId });

            return cart;
        }

        public async Task<CartDto> AddProductToCart(string userId, Cart cart)
        {
            var query = "INSERT INTO Carts (ProductId, UserId, Quantity) OUTPUT INSERTED.[Id] VALUES (@ProductId, @UserId, @Quantity)";

            var id = await connection.QuerySingleAsync<int>(query, new { userId, cart.ProductId, cart.Quantity });

            var createdCart = new CartDto
            {
                Id = id,
                ProductId = cart.ProductId,
                Quantity = cart.Quantity,
            };

            return createdCart;
        }

        public async Task UpdateProductCart(string userId, Cart cart)
        {
            var query = "UPDATE Carts SET Quantity = @Quantity WHERE UserId = @UserId AND ProductId = @ProductId";

            var parameters = new DynamicParameters();
            parameters.Add("UserId", userId);
            parameters.Add("ProductId", cart.ProductId);
            parameters.Add("Quantity", cart.Quantity);

            await connection.ExecuteAsync(query, parameters);
        }

        public async Task AddOrUpdateCart(string userId, Cart cart)
        {
            var query = "IF EXISTS(SELECT * FROM Carts WHERE UserId = @UserId and ProductId = @ProductId) UPDATE Carts SET Quantity = Quantity + @Quantity WHERE UserId = @UserId AND ProductId = @ProductId ELSE INSERT INTO Carts (UserId, ProductId, Quantity) VALUES (@UserId, @ProductId, @Quantity) IF ((SELECT Carts.Quantity FROM Carts WHERE UserId = @UserId AND ProductId = @ProductId) <= 0) DELETE FROM Carts WHERE UserId = @UserId AND ProductId = @ProductId";

            var parameters = new DynamicParameters();
            parameters.Add("UserId", userId);
            parameters.Add("ProductId", cart.ProductId);
            parameters.Add("Quantity", cart.Quantity);

            await connection.ExecuteAsync(query, parameters);
        }

        public async Task DeleteCart(int id)
        {
            var query = "DELETE FROM Carts WHERE Id = @id";

            await connection.ExecuteAsync(query, new { id });
        }
        public async Task ClearCart(string userId)
        {
            var query = "DELETE FROM Carts WHERE UserId = @UserId";

            await connection.ExecuteAsync(query, new { userId });
        }
    }
}
