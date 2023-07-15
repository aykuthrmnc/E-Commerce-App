using ECommerceApp.Contracts;
using ECommerceApp.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.Controllers
{
    [Route("categories")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepo;

        public CategoryController(ICategoryRepository categoryRepo)
        {
            _categoryRepo = categoryRepo;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<Category>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _categoryRepo.GetMultipleCategories();

            return Ok(categories);
        }

        /// <response code="404">Kategori Bulunamadı.</response>
        [HttpGet("{id}", Name = "CategoryById")]
        [ProducesResponseType(typeof(Category), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            //var userId = User.Claims.FirstOrDefault(x => x.Type == "UserName");
            //var user = User.FindFirstValue("UserName");
            var category = await _categoryRepo.GetCategoryById(id);
            if (category == null)
            {
                return NotFound("Kategori Bulunamadı.");
            }
            return Ok(category);
        }

        [HttpPost]
        [Authorize(Policy = "Admin")]
        [ProducesResponseType(typeof(Category), StatusCodes.Status200OK)]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryCreate category)
        {
            var createdCategory = await _categoryRepo.CreateCategory(category);

            return CreatedAtRoute("CategoryById", new { id = createdCategory.Id }, createdCategory);
        }

        /// <response code="404">Kategori Bulunamadı.</response>
        [HttpPut]
        [Authorize(Policy = "Admin")]
        [ProducesResponseType(typeof(Category), StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateCategory([FromBody] CategoryUpdate category)
        {
            var dbCategory = await _categoryRepo.GetCategoryById(category.Id);
            if (dbCategory is null)
            {
                return NotFound("Kategori Bulunamadı.");
            }
            
            await _categoryRepo.UpdateCategory(category);

            return Ok(await _categoryRepo.GetCategoryById(category.Id));
            //return NoContent();
        }

        /// <response code="200">Başarıyla Silindi.</response>
        /// <response code="404">Kategori Bulunamadı.</response>
        [HttpDelete("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var dbCategory = await _categoryRepo.GetCategoryById(id);
            if (dbCategory is null)
            {
                return NotFound("Kategori Bulunamadı.");
            }

            await _categoryRepo.DeleteCategory(id);

            return Ok("Başarıyla Silindi.");
        }
    }
}
