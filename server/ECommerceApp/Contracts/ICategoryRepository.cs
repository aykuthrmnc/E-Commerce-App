using ECommerceApp.Dto;

namespace ECommerceApp.Contracts
{
    public interface ICategoryRepository
    {
        public Task<Category> CreateCategory(CategoryCreate category);
        public Task DeleteCategory(int id);
        public Task<IEnumerable<Category>> GetCategories();
        public Task<IEnumerable<Category>> GetMultipleCategories();
        public Task<Category> GetCategoryById(int id);
        public Task UpdateCategory(CategoryUpdate category);

    }
}
