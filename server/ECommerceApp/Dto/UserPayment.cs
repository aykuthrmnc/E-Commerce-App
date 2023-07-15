namespace ECommerceApp.Dto
{
    public partial class UserPayment
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string PaymentType { get; set; } = null!;
        public string AccountName { get; set; } = null!;
        public int AccountNumber { get; set; }
        public DateTime ExpiryDate { get; set; }
    }
}
