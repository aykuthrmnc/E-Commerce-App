using Dapper;
using ECommerceApp.Context;
using ECommerceApp.Contracts;
using ECommerceApp.Entities;
using System.Data;

namespace ECommerceApp.Repository
{
    public class CompanyRepository : ICompanyRepository
    {
        private readonly DapperContext _context;

        public CompanyRepository(DapperContext context) => _context = context;

        public async Task<IEnumerable<Company>> GetCompanies()
        {
            var query = "SELECT * FROM Companies";
            using (var connection = _context.CreateConnection())
            {
                var companies = await connection.QueryAsync<Company>(query);
                return companies.ToList();
            }
        }

        public async Task<Company> GetCompanyById(int id)
        {
            var query = "SELECT * FROM Companies WHERE Id = @Id";
            using (var connection = _context.CreateConnection())
            {
                var company = await connection.QuerySingleOrDefaultAsync<Company>(query, new { id });
                return company;
            }
        }

        public async Task<Company> CreateCompany(CompanyForCreationDto company)
        {
            var query = "INSERT INTO Companies (Name, Address, Country) VALUES (@Name, @Address, @Country)" + "SELECT CAST(SCOPE_IDENTITY() as int)";

            var parameters = new DynamicParameters();
            parameters.Add("Name", company.Name, DbType.String);
            parameters.Add("Address", company.Address, DbType.String);
            parameters.Add("Country", company.Country, DbType.String);

            using (var connection = _context.CreateConnection())
            {
                //await connection.ExecuteAsync(query, parameters);
                var id = await connection.QuerySingleAsync<int>(query, parameters);

                var createdCompany = new Company
                {
                    Id = id,
                    Name = company.Name,
                    Address = company.Address,
                    Country = company.Country,
                };

                return createdCompany;
            }
        }

        public async Task UpdateCompany(int id, CompanyForUpdateDto company)
        {
            var query = "UPDATE Companies SET Name = @Name, Address = ISNULL(@Address, Address), Country = ISNULL(@Country, Country) where Id = @Id";
            var parameters = new DynamicParameters();
            parameters.Add("Id", id, DbType.Int32);
            parameters.Add("Name", company.Name);
            parameters.Add("Address", company.Address);
            parameters.Add("Country", company.Country);

            using (var connection = _context.CreateConnection())
            {
                await connection.ExecuteAsync(query, parameters);
            }
        }

        public async Task DeleteCompany(int id)
        {
            var query = "DELETE FROM Companies WHERE Id = @Id";

            using (var connection = _context.CreateConnection())
            {
                await connection.ExecuteAsync(query, new { id });
            }
        }

        public async Task<Company> GetCompanyByEmployeeId(int id)
        {
            var procedureName = "ShowCompanyByEmployeeId";
            var parameters = new DynamicParameters();
            parameters.Add("Id", id, DbType.Int32, ParameterDirection.Input);

            using (var connection = _context.CreateConnection())
            {
                var company = await connection.QueryFirstOrDefaultAsync<Company>(procedureName, parameters, commandType: CommandType.StoredProcedure);

                return company;
            }
        }

        public async Task<Company> GetMultipleResults(int id)
        {
            var query = "SELECT * FROM Companies WHERE Id = @Id;" + "SELECT * FROM Employees WHERE CompanyId = @Id";

            using (var connection = _context.CreateConnection())
            {
                using (var multi = await connection.QueryMultipleAsync(query, new { id }))
                {
                    var company = await multi.ReadSingleOrDefaultAsync<Company>();
                    if (company is not null)
                    {
                        company.Employees = (await multi.ReadAsync<Employee>()).ToList();
                    }

                    return company;
                }
            }
        }

        public async Task<List<Company>> MultipleMapping()
        {
            var query = "SELECT * FROM Companies c JOIN Employees e ON c.Id = e.CompanyId";

            using (var connection = _context.CreateConnection())
            {
                var companyDict = new Dictionary<int, Company>();
                var companies = await connection.QueryAsync(
                    query, (Company company, Employee employee) =>
                    {
                        if (companyDict.TryGetValue(company.Id, out var currentCompany))
                        {
                            currentCompany = company;
                            companyDict.Add(currentCompany.Id, currentCompany);
                        }

                        currentCompany.Employees.Add(employee);

                        return currentCompany;
                    }
                );

                return companies.Distinct().ToList();
            }
        }

        public async Task CreateMultipleCompanies(List<Company> companies)
        {
            var query = "INSERT INTO Companies (Name, Address, Country) VALUES (@Name, @Address, @Country)";

            using (var connection = _context.CreateConnection())
            {
                connection.Open();

                using (var transaction = connection.BeginTransaction())
                {
                    foreach (var company in companies)
                    {
                        var parameters = new DynamicParameters();
                        parameters.Add("Name", company.Name);
                        parameters.Add("Address", company.Address);
                        parameters.Add("Country", company.Country);

                        await connection.ExecuteAsync(query, parameters, transaction);
                    }
                    transaction.Commit();

                }

            }
        }

        public async Task<dynamic> GetCompaniesDeneme(string? q, string? filter, string? fields, string? sortBy, int pageNo, int pageSize)
        {
            var selectClause = fields != null ? fields : "*";
            var whereClause = filter != null ? $"WHERE {filter}" : "";
            if (!string.IsNullOrEmpty(q))
            {
                whereClause += (string.IsNullOrEmpty(whereClause) ? "WHERE" : "AND") +
                               $" (title LIKE '%{q}%' OR body LIKE '%{q}%')";
            }
            var orderByClause = !string.IsNullOrEmpty(sortBy) ? $"ORDER BY {sortBy}" : "ORDER BY Id";
            var offset = (pageNo - 1) * pageSize;
            var limit = pageSize;

            var query = $"SELECT {selectClause} FROM Products {whereClause} {orderByClause} OFFSET {offset} ROWS FETCH NEXT {limit} ROWS ONLY";

            using var connection = _context.CreateConnection();

            var products = await connection.QueryAsync(query);

            var pageQuery = $"SELECT COUNT(*) as TotalCount, CEILING(COUNT(*) * 1.0 / @pageSize) as TotalPages FROM Products {whereClause}";
            var pagination = await connection.QuerySingleAsync(pageQuery, new { pageSize });

            var productPagination = new
            {
                PageNo = pageNo,
                PageSize = pageSize,
                TotalCount = pagination.TotalCount,
                TotalPages = pagination.TotalPages,
                Products = products
            };

            return productPagination;
        }
    }
}
