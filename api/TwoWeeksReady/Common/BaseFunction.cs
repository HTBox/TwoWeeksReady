using System.Security.Claims;
using System.Threading.Tasks;
using AzureFunctions.OidcAuthentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Documents.Client;
using Microsoft.Extensions.Logging;

namespace TwoWeeksReady.Common
{
  public abstract class BaseFunction
  {
    protected const string DefaultDatabaseName = "2wr";
    protected const string DefaultDbConnectionName = "CosmosDbConnection";

    protected BaseFunction(IApiAuthentication apiAuthentication)
    {
      ApiAuthentication = apiAuthentication;
    }

    protected IApiAuthentication ApiAuthentication
    {
      get;
      private set;
    }
    protected ClaimsPrincipal Principal
    {
      get;
      private set;
    }

    protected async Task<bool> Authorized(HttpRequest req, ILogger log)
    {
      var authorizationResult = await ApiAuthentication.AuthenticateAsync(req.Headers);
      if (authorizationResult.Failed)
      {
        log.LogWarning(authorizationResult.FailureReason);
        return false;
      }

      Principal = authorizationResult.User;
      return true;
    }

  }
}
