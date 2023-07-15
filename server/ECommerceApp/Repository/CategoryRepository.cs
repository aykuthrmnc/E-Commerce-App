using Dapper;
using ECommerceApp.Context;
using ECommerceApp.Contracts;
using ECommerceApp.Dto;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace ECommerceApp.Repository
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly IDbConnection connection;
        public CategoryRepository(DapperContext context)
        {
            connection = context.CreateConnection();
        }
        public async Task<Category> CreateCategory(CategoryCreate category)
        {
            var query = "INSERT INTO Categories (Name, Url, Description, MainCategoryId) VALUES (@Name, @Url, @Description, ISNULL(@MainCategoryId, 0))" + "SELECT CAST(SCOPE_IDENTITY() as int)";

            var parameters = new DynamicParameters();
            parameters.Add("Name", category.Name, DbType.String);
            parameters.Add("Url", category.Url, DbType.String);
            parameters.Add("Description", category.Description, DbType.String);
            parameters.Add("MainCategoryId", category.MainCategoryId);

            //await connection.ExecuteAsync(query, parameters);
            var id = await connection.QuerySingleAsync<int>(query, parameters);

            var createdCategory = new Category
            {
                Id = id,
                Name = category.Name,
                Url = category.Url,
                Description = category.Description,
                MainCategoryId = category.MainCategoryId,
            };

            return createdCategory;
        }

        public async Task UpdateCategory(CategoryUpdate category)
        {
            var query = "UPDATE Categories SET Name = @Name, Url = ISNULL(@Url, Url), Description = ISNULL(@Description, Description), MainCategoryId = ISNULL(@MainCategoryId, MainCategoryId) where Id = @id";

            var parameters = new DynamicParameters();
            parameters.Add("id", category.Id);
            parameters.Add("Name", category.Name);
            parameters.Add("Url", category.Url);
            parameters.Add("Description", category.Description);
            parameters.Add("MainCategoryId", category.MainCategoryId);

            await connection.ExecuteAsync(query, parameters);
        }

        public async Task DeleteCategory(int id)
        {
            var query = "DELETE FROM Categories WHERE Id = @id";

            await connection.ExecuteAsync(query, new { id });

        }

        public async Task<IEnumerable<Category>> GetCategories()
        {
            var query = "SELECT * FROM Categories";
            var categories = await connection.QueryAsync<Category>(query);
            return categories.ToList();
        }

        public async Task<Category> GetCategoryById(int id)
        {
            var query = "SELECT * FROM Categories WHERE Id = @id";
            var category = await connection.QuerySingleOrDefaultAsync<Category>(query, new { id });
            return category;
        }

        public async Task<IEnumerable<Category>> GetMultipleCategories()
        {
            var query = "SELECT * FROM Categories WHERE MainCategoryId = 0";
            var categories = await connection.QueryAsync<Category>(query);

            var subQuery = "SELECT * FROM Categories WHERE MainCategoryId = @MainCategoryId";
            foreach (var category in categories)
            {
                IEnumerable<Category> categories2 = await connection.QueryAsync<Category>(subQuery, new { MainCategoryId = category.Id });
                category.SubCategories = categories2;
            }

            return categories;
        }
    }
}
