namespace backend.Domain.Entities;

public class Review
{
    public Guid Id { get; set; }
    public Guid BookingId { get; set; }
    public Guid CustomerId { get; set; }
    public Guid LocationId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Booking Booking { get; set; } = null!;
}
