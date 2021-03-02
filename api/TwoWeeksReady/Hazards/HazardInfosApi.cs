using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using AzureFunctions.OidcAuthentication;
using System.Collections.Generic;
using Microsoft.Azure.Documents.Linq;

namespace TwoWeeksReady.Hazards
{
     public class HazardInfosApi
    {
        private readonly IApiAuthentication _apiAuthentication;

        public HazardInfosApi(IApiAuthentication apiAuthentication)
        {
            _apiAuthentication = apiAuthentication;
        }

        [FunctionName("hazardinfos")]
        public async Task<IActionResult> GetList(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)]
            HttpRequest req,
            [CosmosDB( databaseName: "2wr", collectionName: "hazardinfos", ConnectionStringSetting = "CosmosDBConnection")] 
            DocumentClient client,
            ILogger log)
        {
            log.LogInformation("Getting information about hazards");
            
            var authorizationResult = await _apiAuthentication.AuthenticateAsync(req.Headers);
            if (authorizationResult.Failed)
            {
                log.LogWarning(authorizationResult.FailureReason);
                return new UnauthorizedResult();
            }

            Uri collectionUri = UriFactory.CreateDocumentCollectionUri("2wr", "hazardinfos");
            var query = client.CreateDocumentQuery<HazardInfo>(collectionUri).AsDocumentQuery();
            var items = new List<HazardInfo>();

            while (query.HasMoreResults)
            {
                var result = await query.ExecuteNextAsync<HazardInfo>();
                items.AddRange(result);               
            }

            return new OkObjectResult(items);
        }

    }
}
