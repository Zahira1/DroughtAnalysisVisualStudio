
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using DocumentFormat.OpenXml.Packaging;
using DroughtAnalysis.Server.Models;
using DroughtAnalysis.Server.Controllers.Models;
using System.Configuration;
using DroughtAnalysis.Server.Helper;
namespace DroughtAnalysis.Server.Helper
{
    public static class ReportUtils
    {
        public static RandomFolder CreateRandomFolderName(string reportsFolder)
        {
            //Create the random new folder name which will host the final document
            string finalFolderName = GenerateFolderName(50);

            //Create the new folder
            string newDocumentFolderPath = reportsFolder + finalFolderName;
            Directory.CreateDirectory(newDocumentFolderPath);

            RandomFolder randomFolder = new RandomFolder
            {
                Name = finalFolderName,
                Path = newDocumentFolderPath
            };

            return randomFolder;
        }
        private static string GenerateFolderName(int folderNameLength)
        {
            // To create a random folder name to put the final document inside
            Random random = new();

            const string validChars = "0123456789abcdefghijklmnopqrstuvwyz";

            char[] chars = new char[folderNameLength];
            for (int i = 0; i < folderNameLength; i++)
            {
                chars[i] = validChars[random.Next(validChars.Length)];
            }
            return new string(chars);
        }
        public static string CreateReport(string templateFolder, string reportFolderpath, ReportParams reportParams)
        {
            // Copy the template folder to the new folder

            string templateFilename = "DHAAT.docx";
            string template = templateFolder + "\\" + templateFilename;
            string finalFilename = $"{reportFolderpath}\\{templateFilename}";
            System.IO.File.Copy(template, finalFilename);
            string imageId = "rId4";
            // Replace the Image 
            OpenXmlImages.ReplaceImage(finalFilename, reportParams.content, imageId);
            return finalFilename;
        }
        public static void DeleteOldFolders(string reportsDir)
        {
            DirectoryInfo dir = new(reportsDir);
            DirectoryInfo[] folders = dir.GetDirectories();
            foreach (DirectoryInfo folder in folders)
            {
                if (folder.LastWriteTime < DateTime.Now.AddDays(-1))
                {
                    folder.Delete(true);
                }
            }
        }
        const string validChars = "0123456789abcdefghijklmnopqrstuvwyz";
        private static string GenerateFolderName(Random random, int folderNameLength)
        {
            char[] chars = new char[folderNameLength];
            for (int i = 0; i < folderNameLength; i++)
            {
                chars[i] = validChars[random.Next(validChars.Length)];
            }
            return new string(chars);
        }
        public static void CreateDirectory(string path)
        {
            // creates folder if it doesn't exist
            if (!Directory.Exists(path)) Directory.CreateDirectory(path);
        }

        public static void ReplaceImage(string destinationFile, string mapImageUrl, string imageId)
        {
            WordprocessingDocument m_wordProcessingDocument = WordprocessingDocument.Open(destinationFile, true);
            MainDocumentPart m_mainDocPart = m_wordProcessingDocument.MainDocumentPart;

            // go through the document and pull out the inline image elements
            IEnumerable<Drawing> imageElements = from run in m_mainDocPart.Document.Descendants<DocumentFormat.OpenXml.Wordprocessing.Run>()
                                                 where run.Descendants<Drawing>().First() != null
                                                 select run.Descendants<Drawing>().First();

            ImagePart imagePart = (ImagePart)m_mainDocPart.GetPartById(imageId);

            var webClient = new WebClient();
            byte[] m_imageInBytes = webClient.DownloadData(mapImageUrl);
            BinaryWriter writer = new BinaryWriter(imagePart.GetStream());
            writer.Write(m_imageInBytes);
            writer.Close();

            m_wordProcessingDocument.Clone();
        }


    }
}


