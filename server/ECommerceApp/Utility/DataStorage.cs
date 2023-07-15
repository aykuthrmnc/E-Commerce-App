using ECommerceApp.Entities;

namespace ECommerceApp.Utility
{
    public static class DataStorage
    {
        public static List<Employee> GetAllEmployees() => new List<Employee> {
            new Employee { Id = 1, Name = "Aykut", Age = 25, Position = "Developer", CompanyId = 1 },
            new Employee { Id = 1, Name = "Aykut2", Age = 27, Position = "Developer2", CompanyId = 2 },
            new Employee { Id = 1, Name = "Aykut3", Age = 29, Position = "Developer3", CompanyId = 3 },
            new Employee { Id = 1, Name = "Aykut4", Age = 21, Position = "Developer4", CompanyId = 4 },
        };
    }
}
