namespace ECommerceApp.Dto
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }

        //public DateTime? CreatedAt { get; set; }
        //public DateTime? ModifiedAt { get; set; }
    }
    public class OrderItemDto : OrderItem
    {
        public string? Name { get; set; }
        public string? Url { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
    }
}
