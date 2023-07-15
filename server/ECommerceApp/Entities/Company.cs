namespace ECommerceApp.Entities
{
    public class Company
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Address { get; set; }
        public string? Country { get; set; }
        public List<Employee> Employees { get; set; } = new List<Employee>();
    }
    public class CompanyForCreationDto
    {
        public string? Name { get; set; }
        public string? Address { get; set; }
        public string? Country { get; set; }
    }
    public class CompanyForUpdateDto
    {
        public string? Name { get; set; }
        public string? Address { get; set; }
        public string? Country { get; set; }
    }
}
