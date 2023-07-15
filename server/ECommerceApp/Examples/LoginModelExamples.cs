using ECommerceApp.Dto;
using Swashbuckle.AspNetCore.Filters;

namespace ECommerceApp.Examples
{
    public class LoginModelExamples : IMultipleExamplesProvider<LoginModel>
    {
        public IEnumerable<SwaggerExample<LoginModel>> GetExamples()
        {
            yield return SwaggerExample.Create(
                "Aykut",
                new LoginModel()
                {
                    Username = "1",
                    Password = "1",
                });
            yield return SwaggerExample.Create(
                "Aykut2",
                new LoginModel()
                {
                    Username = "2",
                    Password = "2",
                });
        }
    }
}
