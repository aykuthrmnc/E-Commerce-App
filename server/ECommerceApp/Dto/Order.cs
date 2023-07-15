namespace ECommerceApp.Dto
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int PaymentId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? AddressLine1 { get; set; }
        public string? Country { get; set; }
        public string? City { get; set; }
        public int? ZipCode { get; set; }
        public string? Description { get; set; }
        public bool? OrderState { get; set; }
        public DateTime? CreatedAt { get; set; }
        //public DateTime? ModifiedAt { get; set; }
    }
    public class OrderDto : Order
    {
        public IEnumerable<OrderItemDto>? OrderItems { get; set; }

        //public DateTime? ModifiedAt { get; set; }
    }

    public class OrderPayment : Order
    {
        public string? CardName { get; set; }
        public string? CardNumber { get; set; }
        public string? CardMonth { get; set; }
        public string? CardYear { get; set; }
        public string? CardCvc { get; set; }
    }
}
