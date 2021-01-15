using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using AzureFunctions.OidcAuthentication;

[assembly: FunctionsStartup(typeof(TwoWeeksReady.Startup))]

namespace TwoWeeksReady
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddOidcApiAuthorization();
        }
    }
}