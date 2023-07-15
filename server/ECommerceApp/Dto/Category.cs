namespace ECommerceApp.Dto
{
    public class CategoryCreate
    {
        public string Name { get; set; } = null!;
        public string? Url { get; set; }
        public string? Description { get; set; }
        public int MainCategoryId { get; set; }

    }
    public class CategoryUpdate : CategoryCreate
    {
        public int Id { get; set; }
    }
    public class Category : CategoryUpdate
    {
        public IEnumerable<Category>? SubCategories { get; set; }

        //public DateTime? CreatedAt { get; set; }
        //public DateTime? ModifiedAt { get; set; }
        //public DateTime? DeletedAt { get; set; }
    }
    public class CategoryRating
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string ImageUrl { get; set; }

    }
}
