using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;

using System.Net;



namespace DroughtAnalysis.Server.Helper
{
    public static class OpenXmlImages
    {
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

            m_wordProcessingDocument.Close();
        }

    }
}




