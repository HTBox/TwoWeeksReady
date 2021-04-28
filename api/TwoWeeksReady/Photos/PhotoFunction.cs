using System.IO;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using AzureFunctions.OidcAuthentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using TwoWeeksReady.Common;

namespace TwoWeeksReady.Photos
{
  public class PhotoFunction : BaseFunction
  {
    public PhotoFunction(IApiAuthentication apiAuthentication) : 
      base(apiAuthentication)
    {
    }

    [FunctionName("photo-add")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] 
        HttpRequest req,
        ILogger log)
    {
      log.LogInformation("Attempting to upload image.");

      if (!(await Authorized(req, log))) return new UnauthorizedResult();

      // Dummy to return just the logo for now.
      return new OkObjectResult("https://raw.githubusercontent.com/HTBox/TwoWeeksReady/master/assets/images/twoweeksready.png");
    }
  }
}

