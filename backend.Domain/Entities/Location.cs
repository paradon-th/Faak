namespace backend.Domain.Entities;

public class Location
{
    public Guid Id { get; set; }
    public Guid PartnerId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string Description { get; set; } = string.Empty;
    public int CapacitySmall { get; set; }
    public int CapacityLarge { get; set; }
    public string Status { get; set; } = "ACTIVE"; // ACTIVE, INACTIVE
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public User Partner { get; set; } = null!;
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
