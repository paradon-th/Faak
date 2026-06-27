using backend.Application.DTOs.Location;
using backend.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationController : ControllerBase
    {
        private readonly ILocationService _locationService;

        public LocationController(ILocationService locationService)
        {
            _locationService = locationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var locations = await _locationService.GetAllLocationsAsync();
            return Ok(locations);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var location = await _locationService.GetLocationByIdAsync(id);
            if (location == null) return NotFound(new { message = "Location not found" });
            return Ok(location);
        }

        [Authorize(Roles = "Partner,Admin")]
        [HttpGet("my-locations")]
        public async Task<IActionResult> GetMyLocations()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid partnerId))
            {
                return Unauthorized("Invalid user token");
            }

            var locations = await _locationService.GetPartnerLocationsAsync(partnerId);
            return Ok(locations);
        }

        [Authorize(Roles = "Partner,Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateLocationRequest request)
        {
            try
            {
                var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid partnerId))
                {
                    return Unauthorized("Invalid user token");
                }

                var location = await _locationService.CreateLocationAsync(request, partnerId);
                return Ok(location);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
