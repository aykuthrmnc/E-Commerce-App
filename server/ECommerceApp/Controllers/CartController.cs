using ECommerceApp.Contracts;
using ECommerceApp.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerceApp.Controllers
{
    [Authorize]
    [Route("cart")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartRepository _cartRepo;
        public CartController(ICartRepository cartRepo)
        {
            _cartRepo = cartRepo;
        }

        /// <response code="400">Sepette Ürün Bulunamadı.</response>
        [HttpGet]
        [ProducesResponseType(typeof(List<CartDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCart()
        {
            var userId = User.FindFirstValue("Id");
            var cart = await _cartRepo.GetCart(userId);
            if (cart == null)
            {
                return NotFound("Sepette Ürün Bulunamadı.");
            }
            return Ok(cart);
        }

        /// <response code="400">Ürün Bulunamadı.</response>
        [HttpGet("{productId}", Name = "CartById")]
        [ProducesResponseType(typeof(CartDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCartProductById(int productId)
        {
            var userId = User.FindFirstValue("Id");
            var product = await _cartRepo.GetCartProductById(userId, productId);

            if (product == null)
            {
                return NotFound("Ürün Bulunamadı.");
            }
            return Ok(product);
        }

        /// <response code="404">Ürün Sepete Eklenemedi.</response>
        [HttpPost]
        [ProducesResponseType(typeof(CartDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> AddProductToCart(Cart cart)
        {
            var userId = User.FindFirstValue("Id");


            //if (product is null)
            //{
            //    await _cartRepo.AddProductToCart(userId, cart);
            //}
            //else
            //{
            //    await _cartRepo.UpdateProductCart(userId, cart);
            //}

            await _cartRepo.AddOrUpdateCart(userId, cart);

            var cartModel = await _cartRepo.GetCartProductById(userId, cart.ProductId);
            if (cartModel == null)
            {
                return NotFound("Ürün Sepete Eklenemedi.");
            }

            return Ok(cartModel);
        }

        /// <response code="404">Ürün Sepete Eklenemedi.</response>
        [HttpPut]
        [ProducesResponseType(typeof(CartDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateCart(Cart cart)
        {
            var userId = User.FindFirstValue("Id");


            //if (product is null)
            //{
            //    await _cartRepo.AddProductToCart(userId, cart);
            //}
            //else
            //{
            await _cartRepo.UpdateProductCart(userId, cart);
            //}

            //await _cartRepo.AddOrUpdateCart(userId, cart);

            var cartModel = await _cartRepo.GetCartProductById(userId, cart.ProductId);
            if (cartModel == null)
            {
                return NotFound("Ürün Sepete Eklenemedi.");
            }

            return Ok(cartModel);
        }

        /// <response code="200">Başarıyla Silindi.</response>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCart(int id)
        {
            await _cartRepo.DeleteCart(id);

            return Ok("Başarıyla Silindi.");
        }
    }
}
