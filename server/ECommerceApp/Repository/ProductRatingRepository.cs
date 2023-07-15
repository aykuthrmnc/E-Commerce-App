using Dapper;
using ECommerceApp.Context;
using ECommerceApp.Contracts;
using ECommerceApp.Dto;
using System.Data;

namespace ECommerceApp.Repository
{
    public class ProductRatingRepository : IProductRatingRepository
    {
        private readonly IDbConnection connection;
        public ProductRatingRepository(DapperContext context)
        {
            connection = context.CreateConnection();
        }

        public async Task<ProductRatingsPagination> GetProductRatings(int productId, int pageNo = 1, int pageSize = 10)
        {
            var query = @"SELECT pr.Description, pr.Rating, pr.RatingDate, u.FirstName, u.LastName FROM ProductRatings pr INNER JOIN Users u ON u.Id=pr.UserId WHERE ProductId = @ProductId ORDER BY RatingDate DESC OFFSET @pageSize * (@pageNo - 1) ROWS FETCH NEXT @pageSize ROWS ONLY";
            var productRatings = await connection.QueryAsync<ProductRatings>(query, new { productId, pageNo, pageSize });
            var pageQuery = @"SELECT COUNT(*) as TotalCount, CEILING(COUNT(*) * 1.0 / @pageSize) as TotalPages FROM ProductRatings WHERE ProductId = @ProductId";
            var pagination = await connection.QuerySingleAsync<Pagination>(pageQuery, new { productId, pageSize });

            var productPagination = new ProductRatingsPagination
            {
                PageNo = pageNo,
                PageSize = pageSize,
                TotalCount = pagination.TotalCount,
                TotalPages = pagination.TotalPages,
                ProductRatings = productRatings
            };

            return productPagination;
        }

        public async Task<ProductRating> GetProductRating(int productId, int orderId, string userId)
        {
            var query = @"SELECT * FROM ProductRatings WHERE ProductId = @ProductId AND OrderId = @OrderId AND UserId = @UserId";
            var productRating = await connection.QuerySingleOrDefaultAsync<ProductRating>(query, new { productId, orderId, userId });
            return productRating;
        }

        public async Task CreateOrUpdateRating(ProductRating productRating)
        {
            var query = @"IF EXISTS(SELECT * FROM ProductRatings WHERE OrderId = @OrderId AND ProductId = @ProductId) UPDATE ProductRatings SET Description = ISNULL(@Description, Description), Rating = ISNULL(@Rating, Rating), RatingDate = GETDATE() WHERE OrderId = @OrderId AND ProductId = @ProductId;
            ELSE INSERT INTO ProductRatings (ProductId, OrderId, UserId, Description, Rating) values(@ProductId, @OrderId, @UserId, @Description, @Rating);";

            await connection.ExecuteAsync(query, new { productRating.OrderId, productRating.ProductId, productRating.UserId, productRating.Description, productRating.Rating });
        }

        public async Task<dynamic> GetRecommendedProducts(string userId)
        {
            var query = "WITH PearsonCorrelation AS (SELECT OtherUserRatings.UserId, (((COUNT(*) * SUM(UserRatings.AvgRating1 * OtherUserRatings.AvgRating2)) - (SUM(UserRatings.AvgRating1) * SUM(OtherUserRatings.AvgRating2))) / (SQRT(((COUNT(*) * SUM(UserRatings.AvgRating1 * UserRatings.AvgRating1)) - SUM(UserRatings.AvgRating1) * SUM(UserRatings.AvgRating1) + 0.0001) * ((COUNT(*) * SUM(OtherUserRatings.AvgRating2 * OtherUserRatings.AvgRating2)) - SUM(OtherUserRatings.AvgRating2) * SUM(OtherUserRatings.AvgRating2) + 0.0001)))) AS PearsonKorelasyonu FROM (SELECT ProductId, AVG(Rating) AS AvgRating1 FROM ProductRatings WHERE UserId = @UserId GROUP BY ProductId) UserRatings INNER JOIN (SELECT UserId, ProductId, AVG(Rating) AS AvgRating2 FROM ProductRatings WHERE UserId != @UserId GROUP BY UserId, ProductId) OtherUserRatings ON OtherUserRatings.ProductId = UserRatings.ProductId GROUP BY OtherUserRatings.UserId)" + "SELECT Products.Id, Categories.Id AS CategoryId, Categories.Name AS CategoryName, Categories.Url AS CategoryUrl, Products.Name, Products.Url, Products.Price, Products.Quantity, Products.Description, Products.ImageUrl, Products.IsActive, Products.IsApproved, Products.IsHome, Categories.MainCategoryId, AVG(ProductRatings.Rating) AS Rating, COUNT(ProductRatings.Rating) AS RatingCount FROM Products INNER JOIN Categories ON Products.CategoryId=Categories.Id INNER JOIN ProductRatings ON Products.Id=ProductRatings.ProductId WHERE Products.Id IN (SELECT DISTINCT ProductId FROM ProductRatings WHERE UserId IN (SELECT TOP 5 UserId FROM PearsonCorrelation WHERE PearsonKorelasyonu > 0 ORDER BY PearsonKorelasyonu DESC) AND Products.DeletedAt IS NULL GROUP BY ProductId) GROUP BY Products.Id, Categories.Id, Categories.Name, Categories.Url, Products.Name, Products.Url, Products.Price, Products.Quantity, Products.Description, Products.ImageUrl, Products.IsActive, Products.IsApproved, Products.IsHome, Categories.MainCategoryId";
            var recommendedProducts = await connection.QueryAsync(query, new { UserId = userId });
            return recommendedProducts;
        }

        public async Task<dynamic> GetMostSelledProducts(int minRating = 2)
        {
            var query = @"SELECT o.ProductId AS Id, p.Name, p.Price, p.Url, p.ImageUrl, c.Name AS CategoryName, c.Url AS CategoryUrl, AVG(pr.Rating) AS Rating, (SELECT COUNT(*) FROM ProductRatings WHERE ProductId = o.ProductId) AS RatingCount FROM OrderItems o INNER JOIN Products p ON o.ProductId = p.Id INNER JOIN ProductRatings pr ON p.Id = pr.ProductId INNER JOIN Categories c ON p.CategoryId = c.Id GROUP BY o.ProductId, p.Name, p.Price, p.Url, p.ImageUrl, c.Name, c.Url HAVING AVG(pr.Rating) > 2 ORDER BY SUM(o.Quantity) DESC;";

            var products = await connection.QueryAsync(query, new { Rating = minRating });

            return products.ToList();
        }

        public async Task<IEnumerable<CategoryRating>> GetMostSelledCategories()
        {
            var query = @"SELECT c.Id, c.Name, c.Url, c.ImageUrl FROM OrderItems o INNER JOIN Products p ON o.ProductId = p.Id INNER JOIN Categories c ON p.CategoryId = c.Id GROUP BY c.Id, c.Name, c.Url, c.ImageUrl ORDER BY SUM(o.Quantity) DESC;";

            var categories = await connection.QueryAsync<CategoryRating>(query);

            return categories.ToList();
        }
    }
}
