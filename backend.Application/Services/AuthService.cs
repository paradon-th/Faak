using backend.Application.DTOs.Auth;
using backend.Application.Interfaces;
using backend.Domain.Entities;

namespace backend.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public AuthService(IUserRepository userRepository, IPasswordHasher passwordHasher, IJwtTokenGenerator jwtTokenGenerator)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            var existingUser = await _userRepository.GetByEmailAsync(request.Email);
            if (existingUser != null)
            {
                throw new Exception("Email already exists");
            }

            var user = new User
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Email = request.Email,
                Phone = request.Phone,
                Role = request.Role,
                PasswordHash = _passwordHasher.HashPassword(request.Password),
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.AddAsync(user);

            var token = _jwtTokenGenerator.GenerateToken(user);

            return new AuthResponse
            {
                Token = token,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role
            };
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);
            if (user == null)
            {
                throw new Exception("Invalid email or password");
            }

            if (!_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
            {
                throw new Exception("Invalid email or password");
            }

            var token = _jwtTokenGenerator.GenerateToken(user);

            return new AuthResponse
            {
                Token = token,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role
            };
        }
    }
}
