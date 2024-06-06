namespace DroughtAnalysis.Server.Models.Database
{
    public partial class COUNTY
    {
        public string OBJECTID { get; set; } = null!;
        public string Name { get; set; } = null!;
        public int ForestAcres { get; set; }
        public int AllAcres { get; set; }
    }
}
