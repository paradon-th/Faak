using backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Location> Locations { get; set; } = null!;
    public DbSet<Booking> Bookings { get; set; } = null!;
    public DbSet<Payment> Payments { get; set; } = null!;
    public DbSet<Review> Reviews { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Booking>()
            .HasOne(b => b.Location)
            .WithMany(l => l.Bookings)
            .HasForeignKey(b => b.LocationId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Booking>()
            .HasOne(b => b.Customer)
            .WithMany(u => u.Bookings)
            .HasForeignKey(b => b.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Location>()
            .HasOne(l => l.Partner)
            .WithMany(u => u.Locations)
            .HasForeignKey(l => l.PartnerId)
            .OnDelete(DeleteBehavior.Cascade);
            
        modelBuilder.Entity<Booking>()
            .HasOne(b => b.Payment)
            .WithOne(p => p.Booking)
            .HasForeignKey<Payment>(p => p.BookingId)
            .OnDelete(DeleteBehavior.Cascade);
            
        modelBuilder.Entity<Booking>()
            .HasOne(b => b.Review)
            .WithOne(r => r.Booking)
            .HasForeignKey<Review>(r => r.BookingId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
