using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Net.Mail;
using System.Net;
using Microsoft.Extensions.Logging;
using Home4Paws.API.Models.Pets;

namespace Home4Paws.API.Services.Notifications
{
    public interface IEmailService
    {
        Task SendReportConfirmationAsync(PetReportResponse report);
        Task SendPotentialMatchAsync(PetReportResponse originalReport, PetReportResponse matchingReport);
        Task SendStatusUpdateAsync(PetReportResponse report, string previousStatus);
        Task SendReunionConfirmationAsync(PetReportResponse report);
        Task SendUrgentAlertAsync(PetReportResponse report);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;
        private readonly SmtpClient _smtpClient;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;

            // Configure SMTP client
            var smtpConfig = _configuration.GetSection("SmtpSettings");
            _smtpClient = new SmtpClient(smtpConfig["Host"])
            {
                Port = int.Parse(smtpConfig["Port"]),
                Credentials = new NetworkCredential(smtpConfig["Username"], smtpConfig["Password"]),
                EnableSsl = true
            };
        }

        public async Task SendReportConfirmationAsync(PetReportResponse report)
        {
            var subject = $"Pet Report Confirmation - {report.ReportType} Pet";
            var body = GenerateReportConfirmationEmail(report);
            await SendEmailAsync(report.Email, subject, body);
        }

        public async Task SendPotentialMatchAsync(PetReportResponse originalReport, PetReportResponse matchingReport)
        {
            var subject = "Potential Match Found for Your Pet";
            var body = GenerateMatchNotificationEmail(originalReport, matchingReport);
            await SendEmailAsync(originalReport.Email, subject, body);
        }

        public async Task SendStatusUpdateAsync(PetReportResponse report, string previousStatus)
        {
            var subject = $"Status Update - Your Pet Report ({report.ReportType})";
            var body = GenerateStatusUpdateEmail(report, previousStatus);
            await SendEmailAsync(report.Email, subject, body);
        }

        public async Task SendReunionConfirmationAsync(PetReportResponse report)
        {
            var subject = "🎉 Pet Reunion Confirmed!";
            var body = GenerateReunionEmail(report);
            await SendEmailAsync(report.Email, subject, body);
        }

        public async Task SendUrgentAlertAsync(PetReportResponse report)
        {
            var subject = "🚨 URGENT: Lost Pet Alert";
            var body = GenerateUrgentAlertEmail(report);
            await SendEmailAsync(report.Email, subject, body);
        }

        private async Task SendEmailAsync(string to, string subject, string body)
        {
            try
            {
                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_configuration["SmtpSettings:FromEmail"], "Home4Paws"),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };
                mailMessage.To.Add(to);

                await _smtpClient.SendMailAsync(mailMessage);
                _logger.LogInformation($"Email sent successfully to {to}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error sending email: {ex.Message}");
                throw;
            }
        }

        private string GenerateReportConfirmationEmail(PetReportResponse report)
        {
            return $@"
                <h2>Thank you for submitting your pet report</h2>
                <p>Your report has been received and is being processed.</p>
                <h3>Report Details:</h3>
                <ul>
                    <li>Report ID: {report.Id}</li>
                    <li>Pet Name: {report.Name}</li>
                    <li>Type: {report.Type}</li>
                    <li>Status: {report.Status}</li>
                    <li>Date Reported: {report.DateReported:MMM dd, yyyy}</li>
                </ul>
                <p>We will notify you when there are any updates or potential matches.</p>
                <p>You can view your report at: <a href='{_configuration["AppSettings:BaseUrl"]}/pet-finder/reports/{report.Id}'>View Report</a></p>
            ";
        }

        private string GenerateMatchNotificationEmail(PetReportResponse originalReport, PetReportResponse matchingReport)
        {
            return $@"
                <h2>Potential Match Found!</h2>
                <p>We've found a potential match for your {originalReport.ReportType.ToLower()} pet report.</p>
                <h3>Matching Report Details:</h3>
                <ul>
                    <li>Location: {matchingReport.Location}</li>
                    <li>Date: {matchingReport.LostOrFoundDate:MMM dd, yyyy}</li>
                    <li>Description: {matchingReport.Description}</li>
                </ul>
                <p>To view the full details and contact the reporter, please visit:</p>
                <p><a href='{_configuration["AppSettings:BaseUrl"]}/pet-finder/matches/{originalReport.Id}/{matchingReport.Id}'>View Match Details</a></p>
            ";
        }

        private string GenerateStatusUpdateEmail(PetReportResponse report, string previousStatus)
        {
            return $@"
                <h2>Status Update for Your Pet Report</h2>
                <p>Your report status has been updated:</p>
                <ul>
                    <li>Previous Status: {previousStatus}</li>
                    <li>New Status: {report.Status}</li>
                    <li>Updated At: {report.UpdatedAt:MMM dd, yyyy HH:mm}</li>
                </ul>
                <p>View the latest details: <a href='{_configuration["AppSettings:BaseUrl"]}/pet-finder/reports/{report.Id}'>View Report</a></p>
            ";
        }

        private string GenerateReunionEmail(PetReportResponse report)
        {
            return $@"
                <h2>🎉 Wonderful News - Pet Reunion Confirmed!</h2>
                <p>We're delighted to confirm that the pet from your report has been successfully reunited!</p>
                <h3>Report Details:</h3>
                <ul>
                    <li>Pet Name: {report.Name}</li>
                    <li>Report ID: {report.Id}</li>
                    <li>Reunion Date: {DateTime.UtcNow:MMM dd, yyyy}</li>
                </ul>
                <p>Thank you for using Home4Paws to help reunite pets with their families.</p>
            ";
        }

        private string GenerateUrgentAlertEmail(PetReportResponse report)
        {
            return $@"
                <h2>🚨 Urgent Pet Alert</h2>
                <p>An urgent lost pet report has been filed in your area:</p>
                <h3>Details:</h3>
                <ul>
                    <li>Pet Name: {report.Name}</li>
                    <li>Type: {report.Type}</li>
                    <li>Location: {report.Location}</li>
                    <li>Last Seen: {report.LostOrFoundDate:MMM dd, yyyy HH:mm}</li>
                    <li>Identifying Features: {report.IdentifyingFeatures}</li>
                </ul>
                <p>If you have any information, please contact:</p>
                <p>Phone: {report.Phone}</p>
                <p>View full details: <a href='{_configuration["AppSettings:BaseUrl"]}/pet-finder/reports/{report.Id}'>View Report</a></p>
            ";
        }
    }
}