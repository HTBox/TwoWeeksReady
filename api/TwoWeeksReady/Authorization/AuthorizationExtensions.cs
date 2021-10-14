using AzureFunctions.OidcAuthentication;
using System.Linq;

namespace TwoWeeksReady.Authorization
{
    public static class AuthorizationExtensions
    {
        public static bool IsInRole(this ApiAuthenticationResult authenticationResult, string roleName)
        {
            var roles = authenticationResult.User.FindAll("https://schemas.2wradmin.com/role");
            return roles.Any(r => r.Value == roleName);
        }
    }
}
