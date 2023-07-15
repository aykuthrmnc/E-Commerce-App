using System.Net.Mail;
using System.Net;

namespace EmailService
{
    public class EmailSender : IEmailSender
    {
        private readonly EmailConfiguration _emailConfig;

        public EmailSender(EmailConfiguration emailConfig)
        {
            _emailConfig = emailConfig;
        }

        public Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            var client = new SmtpClient(_emailConfig.Host, _emailConfig.Port)
            {
                Credentials = new NetworkCredential(_emailConfig.Username, _emailConfig.Password),
                EnableSsl = _emailConfig.EnableSSL
            };

            return client.SendMailAsync(
                new MailMessage(_emailConfig.Username, email, subject, htmlMessage)
                {
                    IsBodyHtml = true
                }
            );
        }
    }
}
