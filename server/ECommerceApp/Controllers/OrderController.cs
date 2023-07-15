using ECommerceApp.Contracts;
using ECommerceApp.Dto;
using ECommerceApp.Utility;
using Iyzipay;
using Iyzipay.Model;
using Iyzipay.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PuppeteerSharp;
using System.Globalization;
using System.Security.Claims;

namespace ECommerceApp.Controllers
{
    [Authorize]
    [Route("order")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository _orderRepo;
        private readonly ICartRepository _cartRepo;
        public OrderController(IOrderRepository orderRepo, ICartRepository cartRepo)
        {
            _orderRepo = orderRepo;
            _cartRepo = cartRepo;
        }

        /// <response code="404">Sipariş Bulunmamaktadır.</response>
        [HttpGet(Name = "GetOrder")]
        [ProducesResponseType(typeof(List<OrderDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetOrder()
        {
            var userId = User.FindFirstValue("Id");
            var order = await _orderRepo.GetOrder(userId);
            if (!order.Any())
            {
                return NotFound("Sipariş Bulunmamaktadır.");
            }
            return Ok(order);
        }

        /// <response code="404">Sepette Ürün Bulunmamaktadır.</response>
        [HttpPost]
        [ProducesResponseType(typeof(List<OrderDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> CreateOrder(Order order)
        {
            var userId = User.FindFirstValue("Id");
            var cart = await _cartRepo.GetCart(userId);
            if (!cart.Any())
            {
                return NotFound("Sepetinizde Ürün Bulunmamaktadır.");
            }

            await _orderRepo.CreateOrder(userId, order, cart);
            await _cartRepo.ClearCart(userId);

            return CreatedAtRoute("GetOrder", null, order);
        }

        [HttpPost("deneme")]
        public async Task<IActionResult> OrderWithCreditCard(OrderPayment order)
        {
            var userId = User.FindFirstValue("Id");
            var cart = await _cartRepo.GetCart(userId);
            if (!cart.Any())
            {
                return NotFound("Sepetinizde Ürün Bulunmamaktadır.");
            }

            decimal total = 0;
            //foreach (var item in cart)
            //{
            //    total += item.Price * item.Quantity;
            //}

            Options options = new()
            {
                ApiKey = "API KEY",
                SecretKey = "SECRET KEY",
                BaseUrl = "https://sandbox-api.iyzipay.com"
            };


            PaymentCard paymentCard = new()
            {
                CardHolderName = order.CardName,
                CardNumber = order.CardNumber,
                ExpireMonth = order.CardMonth,
                ExpireYear = order.CardYear,
                Cvc = order.CardCvc,
                RegisterCard = 0
            };

            Buyer buyer = new()
            {
                Id = "BY789",
                Name = order.FirstName,
                Surname = order.LastName,
                GsmNumber = order.PhoneNumber,
                Email = order.Email,
                IdentityNumber = "74300864791",
                LastLoginDate = "2015-10-05 12:43:35",
                RegistrationDate = "2013-04-21 15:12:09",
                RegistrationAddress = "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
                Ip = "85.34.78.112",
                City = order.City,
                Country = order.Country,
                ZipCode = order.ZipCode.ToString(),
            };

            Address shippingAddress = new()
            {
                ContactName = order.CardName,
                City = order.City,
                Country = order.Country,
                Description = order.Description,
                ZipCode = order.ZipCode.ToString()
            };

            Address billingAddress = new()
            {
                ContactName = order.CardName,
                City = order.City,
                Country = order.Country,
                Description = order.Description,
                ZipCode = order.ZipCode.ToString()
            };

            List<BasketItem> basketItems = new();
            foreach (var item in cart)
            {
                total += item.Price * item.Quantity;
                BasketItem firstBasketItem = new()
                {
                    Id = item.Id.ToString(),
                    Name = item.Name,
                    Category1 = item.CategoryName,
                    Category2 = item.CategoryName,
                    ItemType = BasketItemType.PHYSICAL.ToString(),
                    Price = (item.Price * item.Quantity).ToString(CultureInfo.InvariantCulture)
                };
                basketItems.Add(firstBasketItem);
            }

            CreatePaymentRequest request = new()
            {
                Locale = Locale.TR.ToString(),
                ConversationId = "123456789",
                Price = total.ToString(CultureInfo.InvariantCulture),
                PaidPrice = total.ToString(CultureInfo.InvariantCulture),
                Currency = Currency.TRY.ToString(),
                Installment = 1,
                BasketId = "B67832",
                PaymentChannel = PaymentChannel.WEB.ToString(),
                PaymentGroup = PaymentGroup.PRODUCT.ToString(),
                PaymentCard = paymentCard,
                Buyer = buyer,
                ShippingAddress = shippingAddress,
                BillingAddress = billingAddress,
                BasketItems = basketItems
            };


            Payment payment = Payment.Create(request, options);
            if (payment.Status == "success")
            {
                await _orderRepo.CreateOrder(userId, order, cart);
                await _cartRepo.ClearCart(userId);
                return CreatedAtRoute("GetOrder", null, order);
            }
            return BadRequest(new { payment, total });
        }

        [HttpGet("invoice/{id}")]
        public async Task<IActionResult> CreatePDFWithPuppeteerSharp(int id)
        {
            var userId = User.FindFirstValue("Id");
            var order = await _orderRepo.GetOrderById(userId, id);
            if (order is not null)
            {
                using var browserFetcher = new BrowserFetcher();
                await browserFetcher.DownloadAsync(); // BrowserFetcher.DefaultChromiumRevision
                var browser = await Puppeteer.LaunchAsync(new LaunchOptions { Headless = true }); // ExecutablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

                //var htmlCode = "";
                //using StreamReader reader = new StreamReader(Path.Combine("Resources", "html", "fatura.html"));
                //htmlCode = reader.ReadToEnd();

                //await page.EmulateMediaTypeAsync(MediaType.Screen);
                //var pdfContent = await page.PdfStreamAsync(new PdfOptions
                //{
                //    Format = PaperFormat.A4,
                //    PrintBackground = true
                //});

                var page = await browser.NewPageAsync();
                await page.SetContentAsync(TemplateGenerator.GetInvoiceString(order));
                //await page.PdfAsync(Path.Combine(@"resources/pdf", "fatura.pdf"));
                //var result = await page.GetContentAsync(); // HTML Ciktisi Almak Icin

                return new FileContentResult(await page.PdfDataAsync(), "application/pdf")
                {
                    FileDownloadName = "fatura.pdf"
                };
            }
            return NotFound("Sipariş Bulunmamaktadır.");

        }
    }
}
