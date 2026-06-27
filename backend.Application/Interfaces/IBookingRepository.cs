using backend.Domain.Entities;

namespace backend.Application.Interfaces
{
    public interface IBookingRepository
    {
        Task<IEnumerable<Booking>> GetByCustomerIdAsync(Guid customerId);
        Task<IEnumerable<Booking>> GetByLocationIdAsync(Guid locationId);
        Task<IEnumerable<Booking>> GetByPartnerIdAsync(Guid partnerId);
        Task<Booking?> GetByIdAsync(Guid id);
        Task AddAsync(Booking booking);
        Task UpdateAsync(Booking booking);
    }
}
