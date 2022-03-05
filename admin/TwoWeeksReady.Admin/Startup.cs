using System.Threading.Tasks;
using TwoWeeksReady.Admin.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using TwoWeeksReady.Admin.Security;
using System;
using System.Net.Http;

namespace TwoWeeksReady.Admin;

public static class StartupExtensions
{
    public static IServiceCollection ConfigureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddRazorPages();
        services.AddServerSideBlazor();

        services.Configure<CookiePolicyOptions>(options =>
        {
            options.CheckConsentNeeded = context => true;
            options.MinimumSameSitePolicy = SameSiteMode.None;
        });

        // Add authentication services
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        })
        .AddCookie()
        .AddOpenIdConnect("Auth0", options =>
        {
            options.Authority = $"https://{configuration["Auth0:Domain"]}";

            options.ClientId = configuration["Auth0:ClientId"];
            options.ClientSecret = configuration["Auth0:ClientSecret"];

            options.ResponseType = OpenIdConnectResponseType.Code;
            options.SaveTokens = true;

            options.Scope.Clear();
            options.Scope.Add("openid");
            options.Scope.Add("profile");

            options.CallbackPath = new PathString("/callback");
            options.ClaimsIssuer = "Auth0";

            options.TokenValidationParameters = new TokenValidationParameters
            {
                NameClaimType = "name",
                RoleClaimType = "https://schemas.2wradmin.com/roles"
            };

            options.Events = new OpenIdConnectEvents
            {
                OnRedirectToIdentityProvider = context =>
                {
                    // The context's ProtocolMessage can be used to pass along additional query parameters
                    // to Auth0's /authorize endpoint.
                    // 
                    // Set the audience query parameter to the API identifier to ensure the returned Access Tokens can be used
                    // to call protected endpoints on the corresponding API.
                    context.ProtocolMessage.SetParameter("audience", configuration["Auth0:Audience"]);

                    return Task.FromResult(0);
                },
                OnRedirectToIdentityProviderForSignOut = (context) =>
                {
                    var logoutUri = $"https://{configuration["Auth0:Domain"]}/v2/logout?client_id={configuration ["Auth0:ClientId"]}";

                    var postLogoutUri = context.Properties.RedirectUri;

                    if (!string.IsNullOrEmpty(postLogoutUri))
                    {
                        if (postLogoutUri.StartsWith("/"))
                        {
                            var request = context.Request;
                            postLogoutUri = request.Scheme + "://" + request.Host + request.PathBase + postLogoutUri;
                        }
                    }

                    context.Response.Redirect(logoutUri);
                    context.HandleResponse();

                    return Task.CompletedTask;
                }
            };
        });

        services.AddHttpContextAccessor();
        services.AddHttpClient("ApiClient", (HttpClient client) =>
        {
            client.BaseAddress = new Uri(configuration["ApiUrl"]);
        });

        services.AddScoped<TokenProvider>();
        //services.AddScoped<IRepository, StubRepository>();
        services.AddScoped<IRepository, FunctionsRepository>();
        services.AddSingleton<ClientImageService>();

        return services;
    }

}
