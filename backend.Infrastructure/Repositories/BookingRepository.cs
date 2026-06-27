using backend.Application.Interfaces;
using backend.Domain.Entities;
using backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Infrastructure.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly ApplicationDbContext _context;

        public BookingRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Booking>> GetByCustomerIdAsync(Guid customerId)
        {
            return await _context.Bookings.Where(b => b.CustomerId == customerId).ToListAsync();
        }

        public async Task<IEnumerable<Booking>> GetByLocationIdAsync(Guid locationId)
        {
            return await _context.Bookings.Where(b => b.LocationId == locationId).ToListAsync();
        }

        public async Task<IEnumerable<Booking>> GetByPartnerIdAsync(Guid partnerId)
        {
            return await _context.Bookings
                .Include(b => b.Location)
                .Where(b => b.Location.PartnerId == partnerId)
                .ToListAsync();
        }

        public async Task<Booking?> GetByIdAsync(Guid id)
        {
            return await _context.Bookings.FindAsync(id);
        }

        public async Task AddAsync(Booking booking)
        {
            await _context.Bookings.AddAsync(booking);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Booking booking)
        {
            _context.Bookings.Update(booking);
            await _context.SaveChangesAsync();
        }
    }
}
