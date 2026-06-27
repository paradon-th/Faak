using backend.Domain.Entities;

namespace backend.Application.Interfaces
{
    public interface ILocationRepository
    {
        Task<IEnumerable<Location>> GetAllAsync();
        Task<Location?> GetByIdAsync(Guid id);
        Task<IEnumerable<Location>> GetByPartnerIdAsync(Guid partnerId);
        Task AddAsync(Location location);
    }
}
