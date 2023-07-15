using ECommerceApp.Contracts;
using ECommerceApp.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.Controllers
{
    [Route("products")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository _productRepo;
        private readonly ILogger<ProductController> _logger;

        public ProductController(IProductRepository productRepo, ILogger<ProductController> logger)
        {
            _productRepo = productRepo;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<ProductPagination>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetProducts(int pageNo = 1, int pageSize = 10)
        {
            var products = await _productRepo.GetProducts(pageNo, pageSize);
            return Ok(products);
        }

        /// <response code="404">Ürün Bulunamadı.</response>
        [HttpGet("{id}", Name = "ProductById")]
        [ProducesResponseType(typeof(ProductForCategoryListDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetProductById(int id)
        {
            //var userId = User.Claims.FirstOrDefault(x => x.Type == "UserName");
            //var user = User.FindFirstValue("UserName");
            var product = await _productRepo.GetProductById(id);
            if (product == null)
            {
                return NotFound("Ürün Bulunamadı.");
            }
            return Ok(product);
        }

        /// <response code="404">Ürün Bulunamadı.</response>
        [HttpGet("/products/category/{id}", Name = "ProductByCategoryId")]
        [ProducesResponseType(typeof(ProductForCategoryListDtoPagination), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetProductsByCategoryId(int id, int pageNo = 1, int pageSize = 10)
        {
            var product = await _productRepo.GetProductsByCategoryId(id, pageNo, pageSize);
            if (product == null)
            {
                return NotFound("Ürün Bulunamadı.");
            }
            return Ok(product);
        }

        /// <summary>
        /// CategoryId, Name, Url, Price, Quantity, Description, ImageUrl
        /// </summary>
        /// <response code="404">Ürün Bulunamadı.</response>
        [HttpPost]
        [Authorize(Policy = "Admin")]
        [ProducesResponseType(typeof(ProductForCategoryListDto), StatusCodes.Status201Created)]
        public async Task<IActionResult> CreateProduct([FromForm] Product product)
        {
            if (!await _productRepo.IsProductUrlUnique(product.Url))
            {
                return BadRequest("Ürün url'si eşsiz olmalıdır.");
            }

            if (product.File is not null)
            {
                product.ImageUrl = @"resources/images/products/" + product.ImageUrl + Path.GetExtension(product.File.FileName);
                try
                {
                    //string path = Path.Combine(@"resources\images\products", product.ImageUrl);
                    using (Stream stream = new FileStream(product.ImageUrl, FileMode.Create))
                    {
                        product.File.CopyTo(stream);
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            var createdProduct = await _productRepo.CreateProduct(product);

            if (createdProduct is null)
            {
                return NotFound("Ürün Bulunamadı.");
            }

            return CreatedAtRoute("ProductById", new { id = createdProduct.Id }, createdProduct);
        }

        /// <remarks>
        /// Gönderilmesi gerekenler: id, CategoryId, Name, Url, Price, Quantity, Description, ImageUrl, IsActive, IsApproved, IsHome
        /// </remarks>
        /// /// <response code="404">Ürün Bulunamadı.</response>
        [HttpPut]
        [Authorize(Policy = "Admin")]
        [ProducesResponseType(typeof(ProductForCategoryListDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateProduct([FromForm] Product product)
        {
            var dbProduct = await _productRepo.GetProductById(product.Id);
            if (dbProduct is null)
            {
                return NotFound("Ürün Bulunamadı.");
            }

            if (product.File is not null)
            {
                product.ImageUrl = @"resources/images/products/" + product.ImageUrl + Path.GetExtension(product.File.FileName);

                try
                {
                    using (Stream stream = new FileStream(product.ImageUrl, FileMode.Create))
                    {
                        product.File.CopyTo(stream);
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            } else
            {
                product.ImageUrl = null;
            }

            await _productRepo.UpdateProduct(product);

            return Ok(await _productRepo.GetProductById(product.Id));
            //return NoContent();
        }

        /// <response code="400">Aynı isimli resim bulunmaktadır.</response>
        /// <response code="404">Ürün Bulunamadı.</response>
        [HttpDelete("{id}")]
        [Authorize(Policy = "Admin")]
        [ProducesResponseType(typeof(ProductImages), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var dbProduct = await _productRepo.GetProductById(id);
            if (dbProduct is null)
            {
                return NotFound("Ürün Bulunamadı.");
            }
            try
            {
                foreach (var dbProductImage in dbProduct.ProductImages)
                {
                    System.IO.File.Delete(dbProductImage.ImageUrl);
                    await _productRepo.DeleteImageById(dbProductImage.Id);
                }

                System.IO.File.Delete(dbProduct.ImageUrl);
                await _productRepo.DeleteProduct(id);
            }
            catch (Exception ex)
            {
                return BadRequest($"Resim Silinemedi. " + ex.Message);
            }



            return NoContent();
        }

        [HttpPost("/products/images")]
        //[Authorize(Policy = "Admin")]
        public async Task<IActionResult> AddImagesToProduct([FromForm] ProductImages productImages)
        {
            var dbProduct = await _productRepo.GetProductById(productImages.ProductId);
            if (dbProduct is null)
            {
                return NotFound("Ürün Bulunamadı.");
            }
            productImages.ImageUrl = @"resources/images/product-details/" + productImages.ImageUrl + Path.GetExtension(productImages.File.FileName);
            if (dbProduct.ProductImages.Where(i => i.ImageUrl == productImages.ImageUrl).Any())
            {
                return BadRequest("Aynı isimli resim bulunmaktadır.");
            }

            try
            {
                //string path = Path.Combine(@"resources\images\product-details", productImages.ImageUrl);
                using (Stream stream = new FileStream(productImages.ImageUrl, FileMode.Create))
                {
                    productImages.File.CopyTo(stream);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            var createdProductImages = await _productRepo.AddImagesToProduct(productImages);

            return Ok(createdProductImages);
        }

        /// <response code="200">Başarıyla Kaydedildi.</response>
        /// <response code="400">Aynı isimli resim bulunmaktadır.</response>
        /// <response code="404">Ürün Bulunamadı.</response>
        [HttpPost("/products/multipleimages")]
        //[Authorize(Policy = "Admin")]
        public async Task<IActionResult> AddMultipleImages([FromForm] ProductImagesMultiple productImages)
        {
            //foreach (var file in productImages.File)
            //{
            //    if (!file.ContentType.Contains("image"))
            //    {
            //        return BadRequest("Sadece image türünde dosya eklenebilir.");
            //    }
            //}

            var dbProduct = await _productRepo.GetProductById(productImages.ProductId);
            if (dbProduct is null)
            {
                return NotFound("Ürün Bulunamadı.");
            }
            var imageUrl = @"resources/images/product-details/" + productImages.ImageUrl;
            for (int i = 0; i < productImages.File.Count; i++)
            {
                productImages.ImageUrl = imageUrl;
                //productImages.ImageUrl = productImages.ImageUrl + "-" + i + Path.GetExtension(productImages.File[i].FileName);
                productImages.ImageUrl = productImages.ImageUrl + "-" + DateTime.Now.Ticks + Path.GetExtension(productImages.File[i].FileName);
                if (dbProduct.ProductImages.Where(i => i.ImageUrl == productImages.ImageUrl).Any())
                {
                    return BadRequest("Aynı isimli resim bulunmaktadır.");
                }

                try
                {
                    //string path = Path.Combine(@"C:\Users\aykut\OneDrive\Belgeler\Visual Studio Code\React\ecommerce-app\public\images\product-details", productImages.ImageUrl);
                    using (Stream stream = new FileStream(productImages.ImageUrl, FileMode.Create))
                    {
                        productImages.File[i].CopyTo(stream);
                    }
                    await _productRepo.AddMultipleImagesToProduct(productImages);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            return Ok("Başarıyla Kaydedildi.");
        }

        /// <response code="200">Başarıyla Kaydedildi.</response>
        /// <response code="404">Ürün Bulunamadı.</response>
        [HttpPut("/products/multipleimages")]
        //[Authorize(Policy = "Admin")]
        public async Task<IActionResult> UpdateMultipleImages([FromForm] ProductImagesMultiple productImages)
        {
            var dbProduct = await _productRepo.GetProductById(productImages.ProductId);
            if (dbProduct is null)
            {
                return NotFound("Ürün Bulunamadı.");
            }
            //IEnumerable<ProductImages> dbProductImages = await _productRepo.GetProductImagesByProductId(productImages.ProductId);

            //var current = System.IO.Directory.GetCurrentDirectory(); Bulunulan statik dosya klasorunu bulmak icin

            foreach (var dbProductImage in dbProduct.ProductImages)
            {
                System.IO.File.Delete(dbProductImage.ImageUrl);
            }

            await _productRepo.DeleteImagesByProductId(productImages.ProductId);

            var imageUrl = @"resources/images/product-details/" + productImages.ImageUrl;
            for (int i = 0; i < productImages.File.Count; i++)
            {
                productImages.ImageUrl = imageUrl;
                //productImages.ImageUrl = productImages.ImageUrl + "-" + i + Path.GetExtension(productImages.File[i].FileName);
                productImages.ImageUrl = productImages.ImageUrl + "-" + DateTime.Now.Ticks + Path.GetExtension(productImages.File[i].FileName);

                try
                {
                    using (Stream stream = new FileStream(productImages.ImageUrl, FileMode.Create))
                    {
                        productImages.File[i].CopyTo(stream);
                    }
                    await _productRepo.AddMultipleImagesToProduct(productImages);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            return Ok("Başarıyla Kaydedildi.");
        }

        /// <response code="200">Başarıyla Silindi.</response>
        /// <response code="404">Ürün Bulunamadı.</response>
        [HttpDelete("/products/multipleimages/{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> DeleteMultipleImage(int id)
        {
            var dbProduct = await _productRepo.GetProductImagesByProductId(id);
            if (dbProduct is null)
            {
                return NotFound("Resim Bulunamadı.");
            }
            try
            {
                System.IO.File.Delete(dbProduct.FirstOrDefault().ImageUrl);
                await _productRepo.DeleteImageById(id);
            }
            catch (Exception ex)
            {
                return BadRequest($"Resim Silinemedi. " + ex.Message);
            }

            return Ok("Başarıyla Silindi.");
        }

        [HttpGet("/search")]
        [ProducesResponseType(typeof(SearchDtoPagination), StatusCodes.Status200OK)]
        public async Task<IActionResult> SearchItems(string? search = "", int pageNo = 1, int pageSize = 10)
        {
            var searchModel = await _productRepo.SearchItems(search, pageNo, pageSize);

            return Ok(searchModel);
        }
    }
}
