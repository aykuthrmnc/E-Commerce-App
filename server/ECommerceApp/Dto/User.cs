using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ECommerceApp.Dto
{
    public class User
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public string Username { get; set; } = null!;
        public byte[] PasswordHash { get; set; } = null!;
        public byte[] PasswordSalt { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;

        //public DateTime? CreatedAt { get; set; }
        //public DateTime? ModifiedAt { get; set; }
    }

    public class UserDto
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public string Username { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string Token { get; set; } = null!;

        //public DateTime? CreatedAt { get; set; }
        //public DateTime? ModifiedAt { get; set; }
    }

    public class LoginModel
    {
        // /// <example>1</example>
        [Required]
        public string Username { get; set; }
        // /// <example>1</example>
        [Required]
        public string Password { get; set; }
        public byte[]? PasswordSalt { get; set; }
        public byte[]? PasswordHash { get; set; }
    }

    public class RegisterModel : LoginModel
    {
        [JsonIgnore]
        public int Id { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Email { get; set; }
        public string? PhoneNumber { get; set; }
    }
}
