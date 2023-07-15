namespace ECommerceApp.Dto
{
    public class Cart
    {
        public int ProductId { get; set; }
        public int UserId { get; set; }
        public int Quantity { get; set; }
        //public DateTime? CreatedAt { get; set; }
        //public DateTime? ModifiedAt { get; set; }
    }

    public class CartDto : Cart
    {
        public int Id { get; set; }
        public decimal Price { get; set; }
        public decimal Discount { get; set; }
        public string? Name { get; set; }
        public string? Url { get; set; }
        public string? ImageUrl { get; set; }
        public string? CategoryName { get; set; }
        public string? CategoryUrl { get; set; }
    }
}
