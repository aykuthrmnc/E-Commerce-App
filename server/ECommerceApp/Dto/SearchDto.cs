namespace ECommerceApp.Dto
{
    public class SearchDto
    {
        public IEnumerable<Product> Products { get; set; }
        public IEnumerable<Category> Categories { get; set; }
    }

    public class SearchDtoPagination : Pagination
    {
        public IEnumerable<Product> Products { get; set; }
        public IEnumerable<Category> Categories { get; set; }
    }
}
