using backend.Application.DTOs.Booking;
using backend.Application.Interfaces;
using backend.Domain.Entities;

namespace backend.Application.Services
{
    public interface IBookingService
    {
        Task<BookingDto> CreateBookingAsync(CreateBookingRequest request, Guid customerId);
        Task<IEnumerable<BookingDto>> GetCustomerBookingsAsync(Guid customerId);
        Task<IEnumerable<BookingDto>> GetPartnerBookingsAsync(Guid partnerId);
        Task<BookingDto> UpdateBookingStatusAsync(Guid bookingId, string status, Guid partnerId);
        Task<BookingDto> PayBookingAsync(Guid bookingId, Guid customerId);
    }

    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly ILocationRepository _locationRepository;

        public BookingService(IBookingRepository bookingRepository, ILocationRepository locationRepository)
        {
            _bookingRepository = bookingRepository;
            _locationRepository = locationRepository;
        }

        public async Task<BookingDto> CreateBookingAsync(CreateBookingRequest request, Guid customerId)
        {
            var location = await _locationRepository.GetByIdAsync(request.LocationId);
            if (location == null) throw new Exception("Location not found");

            // Simple price calculation (Mock logic)
            decimal price = (request.SmallBags * 50) + (request.LargeBags * 100);

            var booking = new Booking
            {
                Id = Guid.NewGuid(),
                CustomerId = customerId,
                LocationId = request.LocationId,
                DropoffTime = request.DropoffTime,
                PickupTime = request.PickupTime,
                SmallBags = request.SmallBags,
                LargeBags = request.LargeBags,
                TotalPrice = price,
                Status = "Pending",
                QrCodeData = $"FAAK-{Guid.NewGuid().ToString().Substring(0, 8)}",
                CreatedAt = DateTime.UtcNow
            };

            await _bookingRepository.AddAsync(booking);

            return MapToDto(booking);
        }

        public async Task<IEnumerable<BookingDto>> GetCustomerBookingsAsync(Guid customerId)
        {
            var bookings = await _bookingRepository.GetByCustomerIdAsync(customerId);
            return bookings.Select(MapToDto);
        }

        public async Task<IEnumerable<BookingDto>> GetPartnerBookingsAsync(Guid partnerId)
        {
            var bookings = await _bookingRepository.GetByPartnerIdAsync(partnerId);
            return bookings.Select(MapToDto);
        }

        public async Task<BookingDto> UpdateBookingStatusAsync(Guid bookingId, string status, Guid partnerId)
        {
            var booking = await _bookingRepository.GetByIdAsync(bookingId);
            if (booking == null) throw new Exception("Booking not found");
            
            // Allow checking location partner ownership eventually, but simple for now
            booking.Status = status;
            await _bookingRepository.UpdateAsync(booking);
            return MapToDto(booking);
        }

        public async Task<BookingDto> PayBookingAsync(Guid bookingId, Guid customerId)
        {
            var booking = await _bookingRepository.GetByIdAsync(bookingId);
            if (booking == null) throw new Exception("Booking not found");
            if (booking.CustomerId != customerId) throw new Exception("Unauthorized");
            if (booking.Status != "Pending") throw new Exception("Booking is already paid or cancelled");

            booking.Status = "Paid";
            await _bookingRepository.UpdateAsync(booking);
            return MapToDto(booking);
        }

        private static BookingDto MapToDto(Booking booking)
        {
            return new BookingDto
            {
                Id = booking.Id,
                CustomerId = booking.CustomerId,
                LocationId = booking.LocationId,
                DropoffTime = booking.DropoffTime,
                PickupTime = booking.PickupTime,
                SmallBags = booking.SmallBags,
                LargeBags = booking.LargeBags,
                TotalPrice = booking.TotalPrice,
                Status = booking.Status,
                QrCodeData = booking.QrCodeData
            };
        }
    }
}
