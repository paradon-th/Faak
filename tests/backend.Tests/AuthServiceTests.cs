using System;
using System.Threading.Tasks;
using backend.Application.DTOs.Auth;
using backend.Application.Interfaces;
using backend.Application.Services;
using backend.Domain.Entities;
using FluentAssertions;
using Moq;
using Xunit;

namespace backend.Tests
{
    public class AuthServiceTests
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IPasswordHasher> _passwordHasherMock;
        private readonly Mock<IJwtTokenGenerator> _jwtTokenGeneratorMock;
        private readonly AuthService _authService;

        public AuthServiceTests()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _passwordHasherMock = new Mock<IPasswordHasher>();
            _jwtTokenGeneratorMock = new Mock<IJwtTokenGenerator>();

            _authService = new AuthService(
                _userRepositoryMock.Object,
                _passwordHasherMock.Object,
                _jwtTokenGeneratorMock.Object);
        }

        [Fact]
        public async Task RegisterAsync_WithExistingEmail_ShouldThrowException()
        {
            // Arrange
            var request = new RegisterRequest { Email = "test@example.com" };
            _userRepositoryMock.Setup(repo => repo.GetByEmailAsync(request.Email))
                .ReturnsAsync(new User());

            // Act
            Func<Task> act = async () => await _authService.RegisterAsync(request);

            // Assert
            await act.Should().ThrowAsync<Exception>().WithMessage("Email already exists");
        }

        [Fact]
        public async Task RegisterAsync_WithValidData_ShouldReturnAuthResponse()
        {
            // Arrange
            var request = new RegisterRequest 
            { 
                Email = "new@example.com", 
                Name = "Test User",
                Password = "Password123",
                Role = "Customer"
            };

            _userRepositoryMock.Setup(repo => repo.GetByEmailAsync(request.Email))
                .ReturnsAsync((User?)null);
                
            _passwordHasherMock.Setup(hasher => hasher.HashPassword(request.Password))
                .Returns("hashed_password");
                
            _jwtTokenGeneratorMock.Setup(generator => generator.GenerateToken(It.IsAny<User>()))
                .Returns("valid_token");

            // Act
            var result = await _authService.RegisterAsync(request);

            // Assert
            result.Should().NotBeNull();
            result.Token.Should().Be("valid_token");
            result.Name.Should().Be(request.Name);
            result.Email.Should().Be(request.Email);
            result.Role.Should().Be(request.Role);
            _userRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<User>()), Times.Once);
        }

        [Fact]
        public async Task LoginAsync_WithNonExistingEmail_ShouldThrowException()
        {
            // Arrange
            var request = new LoginRequest { Email = "nonexisting@example.com" };
            _userRepositoryMock.Setup(repo => repo.GetByEmailAsync(request.Email))
                .ReturnsAsync((User?)null);

            // Act
            Func<Task> act = async () => await _authService.LoginAsync(request);

            // Assert
            await act.Should().ThrowAsync<Exception>().WithMessage("Invalid email or password");
        }

        [Fact]
        public async Task LoginAsync_WithWrongPassword_ShouldThrowException()
        {
            // Arrange
            var request = new LoginRequest { Email = "test@example.com", Password = "wrong_password" };
            var user = new User { Email = request.Email, PasswordHash = "hashed_password" };
            
            _userRepositoryMock.Setup(repo => repo.GetByEmailAsync(request.Email))
                .ReturnsAsync(user);
                
            _passwordHasherMock.Setup(hasher => hasher.VerifyPassword(request.Password, user.PasswordHash))
                .Returns(false);

            // Act
            Func<Task> act = async () => await _authService.LoginAsync(request);

            // Assert
            await act.Should().ThrowAsync<Exception>().WithMessage("Invalid email or password");
        }

        [Fact]
        public async Task LoginAsync_WithValidCredentials_ShouldReturnAuthResponse()
        {
            // Arrange
            var request = new LoginRequest { Email = "test@example.com", Password = "correct_password" };
            var user = new User { Email = request.Email, Name = "Test User", Role = "Customer", PasswordHash = "hashed_password" };
            
            _userRepositoryMock.Setup(repo => repo.GetByEmailAsync(request.Email))
                .ReturnsAsync(user);
                
            _passwordHasherMock.Setup(hasher => hasher.VerifyPassword(request.Password, user.PasswordHash))
                .Returns(true);
                
            _jwtTokenGeneratorMock.Setup(generator => generator.GenerateToken(user))
                .Returns("valid_token");

            // Act
            var result = await _authService.LoginAsync(request);

            // Assert
            result.Should().NotBeNull();
            result.Token.Should().Be("valid_token");
            result.Email.Should().Be(request.Email);
            result.Name.Should().Be(user.Name);
        }
    }
}
