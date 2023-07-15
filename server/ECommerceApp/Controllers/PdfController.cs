using ECommerceApp.Utility;
using Microsoft.AspNetCore.Mvc;
using PuppeteerSharp;
using System.Diagnostics;

namespace ECommerceApp.Controllers
{
    [Route("pdf")]
    [ApiController]
    public class PdfController : ControllerBase
    {
        [HttpGet("ChromePdf")]
        public IActionResult CreatePDFWithChrome()
        {
            var url = "https://admin.posandmenu.com/";
            var chromePath = @"C:\Program Files\Google\Chrome\Application\chrome.exe";
            var output = Path.Combine(@"C:\Users\UserName\Downloads", "chrome.pdf");
            using (var p = new Process())
            {
                p.StartInfo.FileName = chromePath;
                p.StartInfo.Arguments = $"--headless --disable-gpu --print-to-pdf={output} {url}";
                p.Start();
                p.WaitForExit();
            }

            return Ok();
        }

        [HttpGet("PuppeteerSharp")]
        public async Task<IActionResult> CreatePDFWithPuppeteerSharp()
        {
            using var browserFetcher = new BrowserFetcher(Product.Firefox);
            await browserFetcher.DownloadAsync();
            var browser = await Puppeteer.LaunchAsync(new LaunchOptions { Headless = true });

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
            await page.SetContentAsync(TemplateGenerator.GetHTMLString());
            await page.PdfAsync(Path.Combine(@"C:\Users\UserName\Downloads", "fatura.pdf"));
            var result = await page.GetContentAsync(); // HTML Ciktisi Almak Icin

            return Ok(result);
        }
    }
}
