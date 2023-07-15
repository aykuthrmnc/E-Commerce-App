using ECommerceApp.Contracts;
using ECommerceApp.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerceApp.Controllers
{
    [Route("productratings")]
    [ApiController]
    public class ProductRatingsController : ControllerBase
    {
        private readonly IProductRepository _productRepo;
        private readonly IProductRatingRepository _productRatingRepository;

        public ProductRatingsController(IProductRepository productRepo, IProductRatingRepository productRatingRepository)
        {
            _productRepo = productRepo;
            _productRatingRepository = productRatingRepository;
        }

        [HttpGet("{productId}")]
        public async Task<IActionResult> GetProductRatings(int productId, int pageNo = 1, int pageSize = 10)
        {
            var productRatings = await _productRatingRepository.GetProductRatings(productId, pageNo, pageSize);
            return Ok(productRatings);
        }

        [HttpGet("/productrating")]
        [Authorize]
        public async Task<IActionResult> GetProductRating(int productId, int orderId)
        {
            var productRating = await _productRatingRepository.GetProductRating(productId, orderId, User.FindFirstValue("Id"));
            return Ok(productRating);
        }

        [HttpPut("/productrating")]
        [Authorize]
        public async Task<IActionResult> CreateOrUpdateProductRating(ProductRating product)
        {
            product.UserId = int.Parse(User.FindFirstValue("Id"));
            await _productRatingRepository.CreateOrUpdateRating(product);
            return Ok("Değerlendirme işlemi başarılı.");
        }

        [HttpGet("/recommendation")]
        [Authorize]
        public async Task<IActionResult> GetRecommendedProducts()
        {
            var recommendedProducts = await _productRatingRepository.GetRecommendedProducts(User.FindFirstValue("Id"));

            return Ok(recommendedProducts);
        }
        
        [HttpGet("/most-selled-products")]
        public async Task<IActionResult> GetMostSelledProducts()
        {
            var products = await _productRatingRepository.GetMostSelledProducts(2);

            return Ok(products);
        }
        
        [HttpGet("/most-selled-categories")]
        public async Task<IActionResult> GetMostSelledCategories()
        {
            var categories = await _productRatingRepository.GetMostSelledCategories();

            return Ok(categories);
        }
    }
}
