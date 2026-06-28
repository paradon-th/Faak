using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Application.DTOs.Booking;
using backend.Application.Interfaces;
using backend.Application.Services;
using backend.Domain.Entities;
using FluentAssertions;
using Moq;
using Xunit;

namespace backend.Tests
{
    public class BookingServiceTests
    {
        private readonly Mock<IBookingRepository> _bookingRepositoryMock;
        private readonly Mock<ILocationRepository> _locationRepositoryMock;
        private readonly BookingService _bookingService;

        public BookingServiceTests()
        {
            _bookingRepositoryMock = new Mock<IBookingRepository>();
            _locationRepositoryMock = new Mock<ILocationRepository>();
            _bookingService = new BookingService(_bookingRepositoryMock.Object, _locationRepositoryMock.Object);
        }

        [Fact]
        public async Task CreateBookingAsync_WhenLocationNotFound_ShouldThrowException()
        {
            // Arrange
            var request = new CreateBookingRequest { LocationId = Guid.NewGuid() };
            _locationRepositoryMock.Setup(repo => repo.GetByIdAsync(request.LocationId))
                .ReturnsAsync((Location?)null);

            // Act
            Func<Task> act = async () => await _bookingService.CreateBookingAsync(request, Guid.NewGuid());

            // Assert
            await act.Should().ThrowAsync<Exception>().WithMessage("Location not found");
        }

        [Fact]
        public async Task CreateBookingAsync_WithValidData_ShouldCalculatePriceAndReturnDto()
        {
            // Arrange
            var locationId = Guid.NewGuid();
            var customerId = Guid.NewGuid();
            var request = new CreateBookingRequest 
            { 
                LocationId = locationId,
                SmallBags = 2, // 2 * 50 = 100
                LargeBags = 1  // 1 * 100 = 100 (Total 200)
            };
            
            _locationRepositoryMock.Setup(repo => repo.GetByIdAsync(locationId))
                .ReturnsAsync(new Location { Id = locationId });

            // Act
            var result = await _bookingService.CreateBookingAsync(request, customerId);

            // Assert
            result.Should().NotBeNull();
            result.TotalPrice.Should().Be(200);
            result.Status.Should().Be("Pending");
            result.QrCodeData.Should().StartWith("FAAK-");
            _bookingRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<Booking>()), Times.Once);
        }

        [Fact]
        public async Task PayBookingAsync_WhenNotPending_ShouldThrowException()
        {
            // Arrange
            var bookingId = Guid.NewGuid();
            var customerId = Guid.NewGuid();
            var booking = new Booking { Id = bookingId, CustomerId = customerId, Status = "Paid" };
            
            _bookingRepositoryMock.Setup(repo => repo.GetByIdAsync(bookingId))
                .ReturnsAsync(booking);

            // Act
            Func<Task> act = async () => await _bookingService.PayBookingAsync(bookingId, customerId);

            // Assert
            await act.Should().ThrowAsync<Exception>().WithMessage("Booking is already paid or cancelled");
        }

        [Fact]
        public async Task PayBookingAsync_WhenValid_ShouldUpdateStatusToPaid()
        {
            // Arrange
            var bookingId = Guid.NewGuid();
            var customerId = Guid.NewGuid();
            var booking = new Booking { Id = bookingId, CustomerId = customerId, Status = "Pending" };
            
            _bookingRepositoryMock.Setup(repo => repo.GetByIdAsync(bookingId))
                .ReturnsAsync(booking);

            // Act
            var result = await _bookingService.PayBookingAsync(bookingId, customerId);

            // Assert
            result.Status.Should().Be("Paid");
            _bookingRepositoryMock.Verify(repo => repo.UpdateAsync(It.IsAny<Booking>()), Times.Once);
        }

        [Fact]
        public async Task UpdateBookingStatusAsync_ShouldUpdateStatus()
        {
            // Arrange
            var bookingId = Guid.NewGuid();
            var booking = new Booking { Id = bookingId, Status = "Paid" };
            
            _bookingRepositoryMock.Setup(repo => repo.GetByIdAsync(bookingId))
                .ReturnsAsync(booking);

            // Act
            var result = await _bookingService.UpdateBookingStatusAsync(bookingId, "CheckedIn", Guid.NewGuid());

            // Assert
            result.Status.Should().Be("CheckedIn");
            _bookingRepositoryMock.Verify(repo => repo.UpdateAsync(It.IsAny<Booking>()), Times.Once);
        }
    }
}
