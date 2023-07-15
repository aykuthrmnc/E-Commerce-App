using EmailService;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.Controllers
{
    [Route("email")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IEmailSender _emailSender;

        public EmailController(IEmailSender emailSender)
        {
            _emailSender = emailSender;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            await _emailSender.SendEmailAsync("nickname@gmail.com", "Şifre Yenile", $"Parolanızı yenilemek için linke <a href='https://www.linkedin.com/in/aykuthrmnc'>tıklayınız</a>");
            return Ok();
        }
    }
}
