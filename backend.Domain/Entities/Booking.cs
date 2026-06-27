namespace backend.Domain.Entities;

public class Booking
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public Guid LocationId { get; set; }
    public DateTime DropoffTime { get; set; }
    public DateTime PickupTime { get; set; }
    public int SmallBags { get; set; }
    public int LargeBags { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; } = "PENDING"; // PAID, CHECKED_IN, COMPLETED, CANCELLED
    public string QrCodeData { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public User Customer { get; set; } = null!;
    public Location Location { get; set; } = null!;
    public Payment? Payment { get; set; }
    public Review? Review { get; set; }
}
