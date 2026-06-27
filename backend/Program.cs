using backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Register Application Services and Repositories
builder.Services.AddScoped<backend.Application.Interfaces.IUserRepository, backend.Infrastructure.Repositories.UserRepository>();
builder.Services.AddScoped<backend.Application.Interfaces.ILocationRepository, backend.Infrastructure.Repositories.LocationRepository>();
builder.Services.AddScoped<backend.Application.Interfaces.IBookingRepository, backend.Infrastructure.Repositories.BookingRepository>();
builder.Services.AddScoped<backend.Application.Interfaces.IPasswordHasher, backend.Infrastructure.Authentication.PasswordHasher>();
builder.Services.AddScoped<backend.Application.Interfaces.IJwtTokenGenerator, backend.Infrastructure.Authentication.JwtTokenGenerator>();
builder.Services.AddScoped<backend.Application.Services.IAuthService, backend.Application.Services.AuthService>();
builder.Services.AddScoped<backend.Application.Services.ILocationService, backend.Application.Services.LocationService>();
builder.Services.AddScoped<backend.Application.Services.IBookingService, backend.Application.Services.BookingService>();

// Configure Entity Framework Core with PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is missing");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });
builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(options =>
    {
        options.RouteTemplate = "openapi/{documentName}.json";
    });
    app.MapScalarApiReference(options => 
    {
        options.WithTitle("Faak API")
               .WithTheme(ScalarTheme.DeepSpace)
               .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
    });
}

// app.UseHttpsRedirection(); // Removed to prevent CORS issues with HTTP/HTTPS redirects

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var passwordHasher = scope.ServiceProvider.GetRequiredService<backend.Application.Interfaces.IPasswordHasher>();
    
    context.Database.Migrate();

    if (!context.Locations.Any())
    {
        var partnerId = Guid.NewGuid();
        context.Users.Add(new backend.Domain.Entities.User
        {
            Id = partnerId,
            Name = "Faak Partner",
            Email = "partner@faak.com",
            PasswordHash = passwordHasher.HashPassword("partner123"),
            Phone = "0812345678",
            Role = "Partner",
            CreatedAt = DateTime.UtcNow
        });

        context.Locations.AddRange(new List<backend.Domain.Entities.Location>
        {
            new backend.Domain.Entities.Location
            {
                Id = Guid.NewGuid(),
                PartnerId = partnerId,
                Name = "Siam Paragon - Lockers",
                Address = "991 Rama I Rd, Pathum Wan, Bangkok 10330",
                Latitude = 13.7468,
                Longitude = 100.5350,
                Description = "Secure lockers located on G Floor near South Exit.",
                CapacitySmall = 20,
                CapacityLarge = 10,
                Status = "Active",
                CreatedAt = DateTime.UtcNow
            },
            new backend.Domain.Entities.Location
            {
                Id = Guid.NewGuid(),
                PartnerId = partnerId,
                Name = "Asok BTS Station",
                Address = "Sukhumvit Rd, Khlong Toei Nuea, Watthana, Bangkok 10110",
                Latitude = 13.7367,
                Longitude = 100.5600,
                Description = "Convenient luggage storage right inside the BTS station.",
                CapacitySmall = 15,
                CapacityLarge = 5,
                Status = "Active",
                CreatedAt = DateTime.UtcNow
            },
            new backend.Domain.Entities.Location
            {
                Id = Guid.NewGuid(),
                PartnerId = partnerId,
                Name = "Chatuchak Market Drop-off",
                Address = "Kamphaeng Phet 2 Rd, Chatuchak, Bangkok 10900",
                Latitude = 13.8000,
                Longitude = 100.5500,
                Description = "Shop safely without carrying your bags. Near Gate 1.",
                CapacitySmall = 30,
                CapacityLarge = 15,
                Status = "Active",
                CreatedAt = DateTime.UtcNow
            }
        });

        context.SaveChanges();
    }
}

app.Run();
