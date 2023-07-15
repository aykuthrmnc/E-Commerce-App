using Dapper;
using ECommerceApp.Context;
using ECommerceApp.Contracts;
using ECommerceApp.Dto;
using System.Data;

namespace ECommerceApp.Repository
{
    public class AuthRepository : IAuthRepository
    {
        //private readonly DapperContext _context;
        private readonly IDbConnection connection;
        public AuthRepository(DapperContext context)
        {
            //_context = context;
            connection = context.CreateConnection();
        }

        public async Task<User> GetUser(LoginModel user)
        {
            var query = "SELECT * FROM Users where Username = @Username";
            //var parameters = new DynamicParameters();
            //parameters.Add("Username", user.Username);
            //parameters.Add("Password", user.Password);


            var dbUser = await connection.QuerySingleOrDefaultAsync<User>(query, user);
            return dbUser;

        }

        public async Task<bool> GetUserByUsername(string Username)
        {
            var query = "SELECT * FROM Users WHERE Username = @Username";

            var dbUser = await connection.QuerySingleOrDefaultAsync<LoginModel>(query, new { Username });
            if (dbUser == null)
            {
                return true;
            }
            return false;

        }

        public async Task<bool> GetUserByEmail(string Email)
        {
            var query = "SELECT * FROM Users WHERE Email = @Email";

            var dbUser = await connection.QuerySingleOrDefaultAsync<LoginModel>(query, new { Email });
            if (dbUser == null)
            {
                return true;
            }
            return false;

        }

        public async Task<RegisterModel> CreateUser(RegisterModel user)
        {
            var query = "INSERT INTO Users (Username, PasswordHash, PasswordSalt, FirstName, LastName, Email, PhoneNumber) VALUES (@Username, @PasswordHash, @PasswordSalt, @FirstName, @LastName, @Email, @PhoneNumber)" + "SELECT CAST(SCOPE_IDENTITY() as int)";
            var parameters = new DynamicParameters();
            parameters.Add("Username", user.Username);
            parameters.Add("PasswordHash", user.PasswordHash);
            parameters.Add("PasswordSalt", user.PasswordSalt);
            parameters.Add("FirstName", user.FirstName);
            parameters.Add("LastName", user.LastName);
            parameters.Add("Email", user.Email);
            parameters.Add("PhoneNumber", user.PhoneNumber);


            var id = await connection.QuerySingleAsync<int>(query, parameters);
            //var id = await connection.QuerySingleAsync<int>(query, new { user });

            var createdUser = new RegisterModel
            {
                Id = id,
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Password = user.Password,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
            };

            return createdUser;

        }
    }
}
