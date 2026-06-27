namespace backend.Domain.Entities;

public class Payment
{
    public Guid Id { get; set; }
    public Guid BookingId { get; set; }
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string Status { get; set; } = "PENDING"; // SUCCESS, FAILED
    public string TransactionRef { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Booking Booking { get; set; } = null!;
}
