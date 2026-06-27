using backend.Application.DTOs.Location;
using backend.Application.Interfaces;
using backend.Domain.Entities;

namespace backend.Application.Services
{
    public interface ILocationService
    {
        Task<IEnumerable<LocationDto>> GetAllLocationsAsync();
        Task<LocationDto?> GetLocationByIdAsync(Guid id);
        Task<IEnumerable<LocationDto>> GetPartnerLocationsAsync(Guid partnerId);
        Task<LocationDto> CreateLocationAsync(CreateLocationRequest request, Guid partnerId);
    }

    public class LocationService : ILocationService
    {
        private readonly ILocationRepository _locationRepository;

        public LocationService(ILocationRepository locationRepository)
        {
            _locationRepository = locationRepository;
        }

        public async Task<IEnumerable<LocationDto>> GetAllLocationsAsync()
        {
            var locations = await _locationRepository.GetAllAsync();
            return locations.Select(l => new LocationDto
            {
                Id = l.Id,
                Name = l.Name,
                Address = l.Address,
                Latitude = l.Latitude,
                Longitude = l.Longitude,
                Description = l.Description,
                CapacitySmall = l.CapacitySmall,
                CapacityLarge = l.CapacityLarge,
                Status = l.Status
            });
        }

        public async Task<IEnumerable<LocationDto>> GetPartnerLocationsAsync(Guid partnerId)
        {
            var locations = await _locationRepository.GetByPartnerIdAsync(partnerId);
            return locations.Select(l => new LocationDto
            {
                Id = l.Id,
                Name = l.Name,
                Address = l.Address,
                Latitude = l.Latitude,
                Longitude = l.Longitude,
                Description = l.Description,
                CapacitySmall = l.CapacitySmall,
                CapacityLarge = l.CapacityLarge,
                Status = l.Status
            });
        }

        public async Task<LocationDto?> GetLocationByIdAsync(Guid id)
        {
            var location = await _locationRepository.GetByIdAsync(id);
            if (location == null) return null;
            return new LocationDto
            {
                Id = location.Id,
                Name = location.Name,
                Address = location.Address,
                Latitude = location.Latitude,
                Longitude = location.Longitude,
                Description = location.Description,
                CapacitySmall = location.CapacitySmall,
                CapacityLarge = location.CapacityLarge,
                Status = location.Status
            };
        }

        public async Task<LocationDto> CreateLocationAsync(CreateLocationRequest request, Guid partnerId)
        {
            var location = new Location
            {
                Id = Guid.NewGuid(),
                PartnerId = partnerId,
                Name = request.Name,
                Address = request.Address,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                Description = request.Description,
                CapacitySmall = request.CapacitySmall,
                CapacityLarge = request.CapacityLarge,
                Status = "Active",
                CreatedAt = DateTime.UtcNow
            };

            await _locationRepository.AddAsync(location);

            return new LocationDto
            {
                Id = location.Id,
                Name = location.Name,
                Address = location.Address,
                Latitude = location.Latitude,
                Longitude = location.Longitude,
                Description = location.Description,
                CapacitySmall = location.CapacitySmall,
                CapacityLarge = location.CapacityLarge,
                Status = location.Status
            };
        }
    }
}
