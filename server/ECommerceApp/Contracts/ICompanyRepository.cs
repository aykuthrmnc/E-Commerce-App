using ECommerceApp.Entities;

namespace ECommerceApp.Contracts
{
    public interface ICompanyRepository
    {
        public Task<IEnumerable<Company>> GetCompanies();
        public Task<Company> GetCompanyById(int id);
        public Task<Company> CreateCompany(CompanyForCreationDto company);
        public Task UpdateCompany(int id, CompanyForUpdateDto company);
        public Task DeleteCompany(int id);
        public Task<Company> GetCompanyByEmployeeId(int id);
        public Task<Company> GetMultipleResults(int id);
        public Task<List<Company>> MultipleMapping();
        public Task<dynamic> GetCompaniesDeneme(string? q, string? filter, string? fields, string? sortBy, int pageNo, int pageSize);
    }
}
