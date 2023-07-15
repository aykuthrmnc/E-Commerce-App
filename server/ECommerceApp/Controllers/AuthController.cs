using ECommerceApp.Contracts;
using ECommerceApp.Dto;
using ECommerceApp.Examples;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.Filters;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace ECommerceApp.Controllers
{
    [Route("auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        //private readonly DapperContext _context;

        //public AuthController(DapperContext context) => _context = context;
        private readonly IAuthRepository _authRepo;
        private readonly IConfiguration _configuration;

        public AuthController(IAuthRepository authRepo, IConfiguration configuration)
        {
            _authRepo = authRepo;
            _configuration = configuration;
        }

        //public static LoginModelHash user = new LoginModelHash();

        /// <response code="400">Girilen değerleri kontrol ediniz.</response>
        /// <response code="404">Kayıtlı kullanıcı bulunamadı. - Kullanıcı adı veya şifre yanlış.</response>
        [HttpPost, Route("login")]
        [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
        [SwaggerRequestExample(typeof(LoginModel), typeof(LoginModelExamples))]
        public async Task<IActionResult> Login([FromBody] LoginModel user)
        {
            if (user == null)
            {
                return BadRequest("Girilen değerleri kontrol ediniz.");
            }

            var dbUser = await _authRepo.GetUser(user);
            if (user.Username != dbUser?.Username)
            {
                return NotFound("Kayıtlı kullanıcı bulunamadı.");
            }
            if (!VerifyPasswordHash(user.Password, dbUser.PasswordHash, dbUser.PasswordSalt))
            {
                return BadRequest("Kullanıcı adı veya şifre yanlış.");
            }

            var userDto = new UserDto
            {
                Id = dbUser.Id,
                Username = dbUser.Username,
                FirstName = dbUser.FirstName,
                LastName = dbUser.LastName,
                Email = dbUser.Email,
                PhoneNumber = dbUser.PhoneNumber,
                RoleId = dbUser.RoleId,
                Token = CreateToken(dbUser)
            };

            return Ok(userDto);
        }

        /// <response code="404">Bu kullanıcı adı kullanılmaktadır. - Bu email kullanılmaktadır. - Kullanıcı adı veya email ile kayıtlı kullanıcı bulunmaktadır.</response>
        [HttpPost, Route("register")]
        [ProducesResponseType(typeof(RegisterModel), StatusCodes.Status201Created)]
        public async Task<ActionResult<RegisterModel>> Register(RegisterModel request)
        {
            if (!await _authRepo.GetUserByUsername(request.Username))
            {
                return BadRequest("Bu kullanıcı adı kullanılmaktadır.");
            }
            if (!await _authRepo.GetUserByEmail(request.Email))
            {
                return BadRequest("Bu email kullanılmaktadır.");
            }

            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);
            request.PasswordHash = passwordHash;
            request.PasswordSalt = passwordSalt;

            var createdUser = await _authRepo.CreateUser(request);
            if (createdUser.Equals(0))
            {
                return BadRequest("Kullanıcı adı veya email ile kayıtlı kullanıcı bulunmaktadır.");
            }
            return Created("/auth/login", new
            {
                createdUser.Id,
                createdUser.Username,
                createdUser.FirstName,
                createdUser.LastName,
                createdUser.Email,
                createdUser.PhoneNumber,
            });
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password.ToString()));
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        private string HashPassword(string password)
        {
            SHA256 hash = SHA256.Create();
            var passwordBytes = Encoding.Default.GetBytes(password);
            var hashedPassword = hash.ComputeHash(passwordBytes);
            return Convert.ToHexString(hashedPassword);
        }

        private string CreateToken(User user)
        {
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value));
            var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
                {
                    //new Claim(ClaimTypes.Name, user.Username)
                    new Claim("Id", user.Id.ToString()),
                    new Claim("RoleId", user.RoleId.ToString()),
                    new Claim("Username", user.Username),
                    new Claim("FirstName", user.FirstName),
                    new Claim("LastName", user.LastName),
                    new Claim("Email", user.Email),
                    new Claim("PhoneNumber", user.PhoneNumber),
                    //new Claim(ClaimTypes.Role, user.RoleId.ToString()),
                };

            var tokenOptions = new JwtSecurityToken(
                //issuer: "https://localhost:44336",
                //audience: "https://localhost:44336",
                //claims: new List<Claim>(),
                claims: claims,
                expires: DateTime.Now.AddYears(1),
                signingCredentials: signingCredentials
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

            return tokenString;
        }
    }
}
