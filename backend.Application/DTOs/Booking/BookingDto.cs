namespace backend.Application.DTOs.Booking
{
    public class BookingDto
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public Guid LocationId { get; set; }
        public DateTime DropoffTime { get; set; }
        public DateTime PickupTime { get; set; }
        public int SmallBags { get; set; }
        public int LargeBags { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; } = string.Empty;
        public string QrCodeData { get; set; } = string.Empty;
    }

    public class CreateBookingRequest
    {
        public Guid LocationId { get; set; }
        public DateTime DropoffTime { get; set; }
        public DateTime PickupTime { get; set; }
        public int SmallBags { get; set; }
        public int LargeBags { get; set; }
    }
}
