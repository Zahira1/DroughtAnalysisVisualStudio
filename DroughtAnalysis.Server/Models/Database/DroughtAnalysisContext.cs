using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace DroughtAnalysis.Server.Models.Database

{
    public partial class DroughtAnalysisContext : DbContext
    {
        public DroughtAnalysisContext()
        {
        }

        public DroughtAnalysisContext(DbContextOptions<DroughtAnalysisContext> options)
            : base(options)
        {
        }
        public virtual DbSet<COUNTY> COUNTY { get; set; } = null!;
        public virtual DbSet<TXMDO> TXMDO { get; set; } = null!;
        public virtual DbSet<TXSDO> TXSDO { get; set; } = null!;
        public virtual DbSet<TXUSDM> TXUSDM { get; set; } = null!;
    }
 //   protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
   // {
     //   if (!optionsBuilder.IsConfigured)
       // {
         //   optionsBuilder.UseSqlServer("name=DefaultConnection");
        //}
    //}
    //protected override void OnModelCreating(ModelBuilder modelBuilder)
    //{
      //  modelBuilder.Entity<COUNTY>(entity =>
        //{
          //  entity.HasKey(e => e.OBJECTID);
            //entity.ToTable("COUNTY");
            //entity.Property(e => e.OBJECTID).HasColumnName("OBJECTID");
            //entity.Property(e => e.Name).HasColumnName("Name");
            //entity.Property(e => e.ForestAcres).HasColumnName("ForestAcres");
            //entity.Property(e => e.AllAcres).HasColumnName("AllAcres");
        //});

        //modelBuilder.Entity<TXMDO>(entity =>
        //{
          //  entity.HasKey(e => e.OBJECTID);
            //entity.ToTable("TXMDO");
            //entity.Property(e => e.OBJECTID).HasColumnName("OBJECTID");
            //entity.Property(e => e.Location).HasColumnName("Location");
            //entity.Property(e => e.ForPct).HasColumnName("ForPct");
            //entity.Property(e => e.AllPct).HasColumnName("AllPct");
            //entity.Property(e => e.Date).HasColumnName("Date");
        //});

        //modelBuilder.Entity<TXSDO>(entity =>
        //{
          //  entity.HasKey(e => e.OBJECTID);
            //entity.ToTable("TXSDO");
            //entity.Property(e => e.OBJECTID).HasColumnName("OBJECTID");
            //entity.Property(e => e.Location).HasColumnName("Location");
            //entity.Property(e => e.ForPct).HasColumnName("ForPct");
            //entity.Property(e => e.AllPct).HasColumnName("AllPct");
            //entity.Property(e => e.Date).HasColumnName("Date");
        //});

        //modelBuilder.Entity<TXUSDM>(entity =>
        //{
          //  entity.HasKey(e => e.OBJECTID);
            //entity.ToTable("TXUSDM");
            //entity.Property(e => e.OBJECTID).HasColumnName("OBJECTID");
            //entity.Property(e => e.Location).HasColumnName("Location");
            //entity.Property(e => e.ForPct).HasColumnName("ForPct");
            //entity.Property(e => e.AllPct).HasColumnName("AllPct");
            //entity.Property(e => e.Date).HasColumnName("Date");
        //});
    //}


}
