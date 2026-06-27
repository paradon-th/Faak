namespace backend.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Role { get; set; } = string.Empty; // e.g., CUSTOMER, PARTNER, ADMIN
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Location> Locations { get; set; } = new List<Location>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
