using Dapper;
using ECommerceApp.Context;
using ECommerceApp.Contracts;
using ECommerceApp.Dto;
using System.Data;

namespace ECommerceApp.Repository
{
    public class ProductRepository : IProductRepository
    {
        private readonly IDbConnection connection;
        public ProductRepository(DapperContext context)
        {
            connection = context.CreateConnection();
        }

        public async Task<Product> CreateProduct(Product product)
        {
            var query = "INSERT INTO Products (CategoryId, Name, Url, Price, Quantity, Description, ImageUrl) OUTPUT INSERTED.[Id] VALUES (@CategoryId,  @Name, @Url, @Price, @Quantity, @Description, @ImageUrl)";

            var parameters = new DynamicParameters();
            parameters.Add("CategoryId", product.CategoryId);
            parameters.Add("Name", product.Name);
            parameters.Add("Url", product.Url);
            parameters.Add("Price", product.Price);
            parameters.Add("Quantity", product.Quantity);
            parameters.Add("Description", product.Description);
            parameters.Add("ImageUrl", product.ImageUrl);

            //await connection.ExecuteAsync(query, parameters);
            var id = await connection.QuerySingleAsync<int>(query, parameters);

            var createdProduct = new Product
            {
                Id = id,
                CategoryId = product.CategoryId,
                Name = product.Name,
                Url = product.Url,
                Price = product.Price,
                Quantity = product.Quantity,
                Description = product.Description,
                ImageUrl = product.ImageUrl,
            };

            return createdProduct;
        }

        public async Task DeleteProduct(int id)
        {
            //var query = "DELETE FROM Products WHERE Id = @id";
            var query = "UPDATE Products SET DeletedAt = GETDATE() WHERE Id = @id";

            await connection.ExecuteAsync(query, new { id });

        }

        public async Task<ProductPagination> GetProducts(int pageNo, int pageSize)
        {
            var query = @"SELECT * FROM Products WHERE DeletedAt IS NULL ORDER BY Id OFFSET @pageSize * (@pageNo - 1) ROWS FETCH NEXT @pageSize ROWS ONLY";
            var products = await connection.QueryAsync<Product>(query, new { pageNo, pageSize });
            var pageQuery = @"SELECT COUNT(*) as TotalCount, CEILING(COUNT(*) * 1.0 / @pageSize) as TotalPages FROM Products WHERE DeletedAt IS NULL";
            var pagination = await connection.QuerySingleAsync<Pagination>(pageQuery, new { pageSize });

            var productPagination = new ProductPagination
            {
                PageNo = pageNo,
                PageSize = pageSize,
                TotalCount = pagination.TotalCount,
                TotalPages = pagination.TotalPages,
                Products = products
            };

            return productPagination;
        }

        public async Task<ProductForCategoryListDto> GetProductById(int id)
        {
            var query = "SELECT Products.Id, Categories.Id as CategoryId, Categories.Name as CategoryName, Categories.Url as CategoryUrl, Products.Name, Products.Url, Products.Price, Products.Quantity, Products.Description, Products.ImageUrl, Products.IsActive, Products.IsApproved, Products.IsHome, Categories.MainCategoryId FROM Products INNER JOIN Categories on Products.CategoryId=Categories.Id WHERE Products.Id = @id AND Products.DeletedAt IS NULL";
            var product = await connection.QuerySingleOrDefaultAsync<ProductForCategoryListDto>(query, new { id });
            if (product is not null)
            {
                var subQuery = "SELECT * FROM ProductImages WHERE ProductId = @id";
                IEnumerable<ProductImages> productImages = await connection.QueryAsync<ProductImages>(subQuery, new { id });
                //category.SubCategories = categories2;
                product.ProductImages = productImages;
                var ratingQuery = "SELECT FORMAT(AVG(CAST(Rating AS DECIMAL(3,2))), 'N2') AS TotalRating, COUNT(case when Rating = 1 then Rating end) as OneStar, COUNT(case when Rating = 2 then Rating end) as TwoStar, COUNT(case when Rating = 3 then Rating end) as ThreeStar, COUNT(case when Rating = 4 then Rating end) as FourStar, COUNT(case when Rating = 5 then Rating end) as FiveStar FROM ProductRatings WHERE ProductRatings.ProductId = @id";
                ProductTotalRating totalRating = await connection.QuerySingleOrDefaultAsync<ProductTotalRating>(ratingQuery, new { id });
                product.ProductTotalRating = totalRating;
            }
            return product;
        }

        public async Task<bool> IsProductUrlUnique(string url)
        {
            var query = "SELECT COUNT(*) FROM Products WHERE Url = @url";
            var count = await connection.QuerySingleOrDefaultAsync<int>(query, new { url });
            if (count > 0)
            {
                return false;
            }
            return true;
        }

        public async Task<ProductForCategoryListDtoPagination> GetProductsByCategoryId(int id, int pageNo, int pageSize)
        {
            var query = "SELECT Products.Id, Categories.Id as CategoryId, Categories.Name as CategoryName, Categories.Url as CategoryUrl, Products.Name, Products.Url, Products.Price, Products.Quantity, Products.Description, Products.ImageUrl, Products.IsActive, Products.IsApproved, Products.IsHome, Categories.MainCategoryId FROM Products INNER JOIN Categories on Products.CategoryId=Categories.Id WHERE (CategoryId = @id OR MainCategoryId = @id) AND Products.DeletedAt IS NULL ORDER BY Id OFFSET @pageSize * (@pageNo - 1) ROWS FETCH NEXT @pageSize ROWS ONLY";
            var products = await connection.QueryAsync<ProductForCategoryListDto>(query, new { id, pageNo, pageSize });
            var pageQuery = @"SELECT COUNT(*) as TotalCount, CEILING(COUNT(*) * 1.0 / @pageSize) as TotalPages FROM Products INNER JOIN Categories on Products.CategoryId=Categories.Id WHERE (CategoryId = @id OR MainCategoryId = @id) AND Products.DeletedAt IS NULL";
            var pagination = await connection.QuerySingleAsync<Pagination>(pageQuery, new { id, pageSize });

            var productPagination = new ProductForCategoryListDtoPagination
            {
                PageNo = pageNo,
                PageSize = pageSize,
                TotalCount = pagination.TotalCount,
                TotalPages = pagination.TotalPages,
                Products = products
            };

            return productPagination;
        }

        public async Task UpdateProduct(Product product)
        {
            var query = "UPDATE Products SET CategoryId = ISNULL(@CategoryId, CategoryId), Name = ISNULL(@Name, Name), Url = ISNULL(@Url, Url), Price = ISNULL(@Price, Price), Quantity = ISNULL(@Quantity, Quantity), Discount = ISNULL(@Discount, Discount), Description = ISNULL(@Description, Description), ImageUrl = ISNULL(@ImageUrl, ImageUrl), IsActive = ISNULL(@IsActive, IsActive), IsApproved = ISNULL(@IsApproved, IsApproved), IsHome = ISNULL(@IsHome, IsHome), ModifiedAt = GETDATE() WHERE Id = @Id";

            var parameters = new DynamicParameters();
            parameters.Add("Id", product.Id);
            parameters.Add("CategoryId", product.CategoryId);
            parameters.Add("Name", product.Name);
            parameters.Add("Url", product.Url);
            parameters.Add("Price", product.Price);
            parameters.Add("Quantity", product.Quantity);
            parameters.Add("Discount", product.Discount);
            parameters.Add("Description", product.Description);
            parameters.Add("ImageUrl", product.ImageUrl);
            parameters.Add("IsActive", product.IsActive);
            parameters.Add("IsApproved", product.IsApproved);
            parameters.Add("IsHome", product.IsHome);

            await connection.ExecuteAsync(query, parameters);
        }

        public async Task<ProductImages> GetProductImageById(int id)
        {
            var query = "SELECT * FROM ProductImages WHERE Id = @id";
            var productImages = await connection.QuerySingleOrDefaultAsync(query, new { id });
            return productImages;
        }

        public async Task<IEnumerable<ProductImages>> GetProductImagesByProductId(int id)
        {
            var query = "SELECT * FROM ProductImages WHERE Id = @id";
            var productImages = await connection.QueryAsync<ProductImages>(query, new { id });
            return productImages;
        }
        public async Task<ProductImages> AddImagesToProduct(ProductImages productImages)
        {
            var query = "INSERT INTO ProductImages (ProductId, ImageUrl) OUTPUT INSERTED.[Id] VALUES (@ProductId, @ImageUrl)";

            var parameters = new DynamicParameters();
            parameters.Add("ProductId", productImages.ProductId);
            parameters.Add("ImageUrl", productImages.ImageUrl);

            var id = await connection.QuerySingleAsync<int>(query, parameters);

            var createdProductImages = new ProductImages
            {
                Id = id,
                ProductId = productImages.ProductId,
                ImageUrl = productImages.ImageUrl,
            };

            return createdProductImages;
        }

        public async Task AddMultipleImagesToProduct(ProductImagesMultiple productImages)
        {
            var query = "INSERT INTO ProductImages (ProductId, ImageUrl) VALUES (@ProductId, @ImageUrl)";

            var parameters = new DynamicParameters();
            parameters.Add("ProductId", productImages.ProductId);
            parameters.Add("ImageUrl", productImages.ImageUrl);

            await connection.QuerySingleOrDefaultAsync(query, parameters);
        }

        public async Task DeleteImagesByProductId(int productId)
        {
            var query = "DELETE FROM ProductImages WHERE ProductId = @ProductId";

            await connection.ExecuteAsync(query, new { productId });
        }

        public async Task DeleteImageById(int id)
        {
            var query = "DELETE FROM ProductImages WHERE Id = @id";

            await connection.ExecuteAsync(query, new { id });
        }

        public async Task<SearchDtoPagination> SearchItems(string? searchString, int pageNo, int pageSize)
        {
            var query = "SELECT * FROM Products WHERE (Name LIKE @searchString OR Description LIKE @searchString) AND DeletedAt IS NULL ORDER BY Id OFFSET @pageSize * (@pageNo - 1) ROWS FETCH NEXT @pageSize ROWS ONLY";
            var products = await connection.QueryAsync<Product>(query, new { searchString = "%" + searchString + "%", pageNo, pageSize });
            var query2 = "SELECT * FROM Categories WHERE Name LIKE @searchString OR Description LIKE @searchString";
            var categories = await connection.QueryAsync<Category>(query2, new { searchString = "%" + searchString + "%" });
            var pageQuery = @"SELECT COUNT(*) as TotalCount, CEILING(COUNT(*) * 1.0 / @pageSize) as TotalPages FROM Products WHERE (Name LIKE @searchString OR Description LIKE @searchString) AND DeletedAt IS NULL";
            var pagination = await connection.QuerySingleAsync<Pagination>(pageQuery, new { searchString = "%" + searchString + "%", pageSize });

            var searchModel = new SearchDtoPagination
            {
                PageNo = pageNo,
                PageSize = pageSize,
                TotalCount = pagination.TotalCount,
                TotalPages = pagination.TotalPages,
                Categories = categories,
                Products = products
            };

            return searchModel;
        }

    }
}
