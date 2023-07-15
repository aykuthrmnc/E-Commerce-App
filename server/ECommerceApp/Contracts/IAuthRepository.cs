using ECommerceApp.Dto;

namespace ECommerceApp.Contracts
{
    public interface IAuthRepository
    {
        public Task<User> GetUser(LoginModel user);
        public Task<bool> GetUserByEmail(string Email);
        public Task<bool> GetUserByUsername(string UserName);
        public Task<RegisterModel> CreateUser(RegisterModel user);
    }
}
