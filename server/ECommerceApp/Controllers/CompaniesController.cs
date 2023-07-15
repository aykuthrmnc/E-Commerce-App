using ECommerceApp.Contracts;
using ECommerceApp.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.Controllers
{
    [NonController]
    [Route("companies")]
    [ApiController]
    public class CompaniesController : ControllerBase
    {
        private readonly ICompanyRepository _companyRepo;

        public CompaniesController(ICompanyRepository companyRepo)
        {
            _companyRepo = companyRepo;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetCompanies()
        {
            var companies = await _companyRepo.GetCompanies();

            return Ok(companies);
        }

        /// <summary>
        /// Company Id gerekli
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <remarks>
        /// Benzer Istek:
        /// 
        ///     {
        ///        "Id": 1,
        ///        "name": "Item #1",
        ///        "isComplete": true
        ///     }
        /// 
        /// </remarks>
        /// <response code="201">Id'si olan tek company donecek</response>
        /// <response code="400">Id yoksa donecek</response>
        [Authorize]
        [HttpGet("{id}", Name = "CompanyById")]
        public async Task<IActionResult> GetCompanyById(int id)
        {
            //var userId = User.Claims.FirstOrDefault(x => x.Type == "UserName");
            //var user = User.FindFirstValue("UserName");
            var company = await _companyRepo.GetCompanyById(id);
            if (company == null)
            {
                return NotFound();
            }
            return Ok(company);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCompany([FromBody] CompanyForCreationDto company)
        {
            var createdCompany = await _companyRepo.CreateCompany(company);

            return CreatedAtRoute("CompanyById", new { id = createdCompany.Id }, createdCompany);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCompany(int id, [FromBody] CompanyForUpdateDto company)
        {
            var dbCompany = await _companyRepo.GetCompanyById(id);
            if (dbCompany is null)
            {
                return NotFound();
            }

            await _companyRepo.UpdateCompany(id, company);

            return Ok(await _companyRepo.GetCompanyById(id));
            //return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCompany(int id)
        {
            var dbCompany = await _companyRepo.GetCompanyById(id);
            if (dbCompany is null)
            {
                return NotFound();
            }

            await _companyRepo.DeleteCompany(id);

            return NoContent();
        }

        [HttpGet("ByEmployeeId/{id}")]
        public async Task<IActionResult> GetCompanyForEmployee(int id)
        {
            var company = await _companyRepo.GetCompanyByEmployeeId(id);
            if (company == null)
            {
                return NotFound();
            }
            return Ok(company);
        }

        [HttpGet("{id}/MultipleResult")]
        public async Task<IActionResult> GetMultipleResults(int id)
        {
            var company = await _companyRepo.GetMultipleResults(id);
            if (company == null)
            {
                return NotFound();
            }
            return Ok(company);
        }

        [HttpGet("MultipleMapping")]
        public async Task<IActionResult> GetMultipleMapping()
        {
            var companies = await _companyRepo.MultipleMapping();

            return Ok(companies);
        }

        [HttpGet("deneme")]
        public async Task<IActionResult> GetCompaniesDeneme(string? q, string? filter, string? fields, string? sortBy, int pageNo = 1, int pageSize = 10)
        {
            var products = await _companyRepo.GetCompaniesDeneme(q, filter, fields, sortBy, pageNo, pageSize);
            return Ok(products);
        }
    }
}
