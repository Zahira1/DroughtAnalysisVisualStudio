using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using DroughtAnalysis.Server.Models;
using DroughtAnalysis.Server.Helper;
using DocumentFormat.OpenXml.Packaging;
using static DroughtAnalysis.Server.Helper.Doc2Pdf;
using DroughtAnalysis.Server.Controllers.Models;

namespace DroughtAnalysis.Server.Controllers
{
    [Route("ReportService")]
    [ApiController]
    public class ReportServiceController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public ReportServiceController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpPost]
        public async Task<string> PostAsync([FromBody] ReportParams reportParams)
        {
            string report = reportParams.content;

            string templatesFolder = Path.Combine(_env.ContentRootPath, "Templates");
            Console.WriteLine($"Templates Folder Path: {templatesFolder}");
            string reportsFolder = Path.Combine(_env.WebRootPath, "Reports");

            if (!Directory.Exists(reportsFolder))
            {
                Directory.CreateDirectory(reportsFolder);
            }

            ReportUtils.DeleteOldFolders(reportsFolder);

            RandomFolder randomFolder = ReportUtils.CreateRandomFolderName(reportsFolder);
            string reportFolderPath = randomFolder.Path;

            string finalFile = CreateReport(templatesFolder, reportFolderPath, report);
            string pdfPath = DocxToPdf.ConvertDocxToPDF(finalFile);
            string reportRelPath = pdfPath.Replace(_env.WebRootPath, string.Empty);

            return reportRelPath;
        }

        public static string CreateReport(string templateFolder, string reportFolderPath, string reportParams)
        {
            string templateFilename = "DHAAT.docx";
            string template = Path.Combine(templateFolder, templateFilename);
            string finalFilename = Path.Combine(reportFolderPath, templateFilename);
            System.IO.File.Copy(template, finalFilename, true);
            string imageId = "rId4";

            OpenXmlImages.ReplaceImage(finalFilename, reportParams, imageId);
            return finalFilename;
        }
    }
}
