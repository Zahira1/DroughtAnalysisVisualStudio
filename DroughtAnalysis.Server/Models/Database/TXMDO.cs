namespace DroughtAnalysis.Server.Models.Database
{
    public partial class TXMDO
    {
        
        public string OBJECTID { get; set; } = null!;
        public string Location { get; set; } = null!;
        public int ForPct { get; set; }
        public int AllPct { get; set; }
        public DateOnly Date { get; set; }
    }
}

