using backend.Application.Interfaces;
using backend.Domain.Entities;
using backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Infrastructure.Repositories
{
    public class LocationRepository : ILocationRepository
    {
        private readonly ApplicationDbContext _context;

        public LocationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Location>> GetAllAsync()
        {
            return await _context.Locations.ToListAsync();
        }

        public async Task<Location?> GetByIdAsync(Guid id)
        {
            return await _context.Locations.FindAsync(id);
        }

        public async Task<IEnumerable<Location>> GetByPartnerIdAsync(Guid partnerId)
        {
            return await _context.Locations.Where(l => l.PartnerId == partnerId).ToListAsync();
        }

        public async Task AddAsync(Location location)
        {
            await _context.Locations.AddAsync(location);
            await _context.SaveChangesAsync();
        }
    }
}
