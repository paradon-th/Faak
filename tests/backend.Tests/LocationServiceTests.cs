using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Application.DTOs.Location;
using backend.Application.Interfaces;
using backend.Application.Services;
using backend.Domain.Entities;
using FluentAssertions;
using Moq;
using Xunit;

namespace backend.Tests
{
    public class LocationServiceTests
    {
        private readonly Mock<ILocationRepository> _locationRepositoryMock;
        private readonly LocationService _locationService;

        public LocationServiceTests()
        {
            _locationRepositoryMock = new Mock<ILocationRepository>();
            _locationService = new LocationService(_locationRepositoryMock.Object);
        }

        [Fact]
        public async Task GetAllLocationsAsync_ShouldReturnAllLocations()
        {
            // Arrange
            var mockLocations = new List<Location>
            {
                new Location { Id = Guid.NewGuid(), Name = "Loc 1", Status = "Active" },
                new Location { Id = Guid.NewGuid(), Name = "Loc 2", Status = "Active" }
            };
            _locationRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(mockLocations);

            // Act
            var result = await _locationService.GetAllLocationsAsync();

            // Assert
            result.Should().HaveCount(2);
            result.First().Name.Should().Be("Loc 1");
        }

        [Fact]
        public async Task GetLocationByIdAsync_WhenExists_ShouldReturnLocation()
        {
            // Arrange
            var id = Guid.NewGuid();
            var mockLocation = new Location { Id = id, Name = "Test Loc", Status = "Active" };
            _locationRepositoryMock.Setup(repo => repo.GetByIdAsync(id)).ReturnsAsync(mockLocation);

            // Act
            var result = await _locationService.GetLocationByIdAsync(id);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(id);
            result.Name.Should().Be("Test Loc");
        }

        [Fact]
        public async Task GetLocationByIdAsync_WhenNotExists_ShouldReturnNull()
        {
            // Arrange
            var id = Guid.NewGuid();
            _locationRepositoryMock.Setup(repo => repo.GetByIdAsync(id)).ReturnsAsync((Location?)null);

            // Act
            var result = await _locationService.GetLocationByIdAsync(id);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task GetPartnerLocationsAsync_ShouldReturnPartnerLocations()
        {
            // Arrange
            var partnerId = Guid.NewGuid();
            var mockLocations = new List<Location>
            {
                new Location { Id = Guid.NewGuid(), PartnerId = partnerId, Name = "Partner Loc 1" }
            };
            _locationRepositoryMock.Setup(repo => repo.GetByPartnerIdAsync(partnerId)).ReturnsAsync(mockLocations);

            // Act
            var result = await _locationService.GetPartnerLocationsAsync(partnerId);

            // Assert
            result.Should().HaveCount(1);
            result.First().Name.Should().Be("Partner Loc 1");
        }

        [Fact]
        public async Task CreateLocationAsync_ShouldReturnCreatedLocationDto()
        {
            // Arrange
            var partnerId = Guid.NewGuid();
            var request = new CreateLocationRequest
            {
                Name = "New Location",
                Address = "123 Street",
                Latitude = 1.0,
                Longitude = 2.0,
                Description = "Desc",
                CapacitySmall = 10,
                CapacityLarge = 5
            };

            // Act
            var result = await _locationService.CreateLocationAsync(request, partnerId);

            // Assert
            result.Should().NotBeNull();
            result.Name.Should().Be(request.Name);
            result.Address.Should().Be(request.Address);
            result.Status.Should().Be("Active");
            
            _locationRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<Location>()), Times.Once);
        }
    }
}
