namespace ECommerceApp.Dto
{
    public class Location
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? PhoneNumber { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? Country { get; set; }
        public string? City { get; set; }
        public int? ZipCode { get; set; }
        public string? Description { get; set; }
    }
}
