using Microsoft.Office.Interop.Word;
using System;
using System.IO;


namespace DroughtAnalysis.Server.Helper
{
    public class Doc2Pdf
    {
        public class DocxToPdf
        {
            public static string ConvertDocxToPDF(string docPath)
            {
                Application app = new();
                string pdfPath = docPath.Replace(".docx", ".pdf");
                Document wordDoc = null;
                try
                {
                    wordDoc = app.Documents.Open(docPath);
                    wordDoc.ExportAsFixedFormat(pdfPath, WdExportFormat.wdExportFormatPDF);
                    wordDoc.Close();
                    app.Quit();
                    wordDoc = null;
                    app = null;
                }
                catch (Exception ex)
                {
                    throw (ex);
                }
                finally
                {
                    if (wordDoc != null) { wordDoc.Close(); wordDoc = null; }
                    if (app != null) { app.Quit(); app = null; }
                    GC.Collect();
                    GC.WaitForPendingFinalizers();
                    //Delete word document
                    File.Delete(docPath);

                }
                return pdfPath;
            }
        }
    }
}


