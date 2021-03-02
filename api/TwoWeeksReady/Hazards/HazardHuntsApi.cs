using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using AzureFunctions.OidcAuthentication;

namespace TwoWeeksReady.Hazards
{
    public class HazardHuntsApi
    {
        private readonly IApiAuthentication _apiAuthentication;

        public HazardHuntsApi(IApiAuthentication apiAuthentication)
        {
            _apiAuthentication = apiAuthentication;
        }

        [FunctionName("hazardhunts")]
        public async Task<IActionResult> GetList(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)]
            HttpRequest req,
            [CosmosDB( databaseName: "2wr", collectionName: "hazardhunts", ConnectionStringSetting = "CosmosDBConnection")] 
            DocumentClient client,
            ILogger log)
        {
            log.LogInformation("Getting list of hazards to hunt");
            
            var authorizationResult = await _apiAuthentication.AuthenticateAsync(req.Headers);
            if (authorizationResult.Failed)
            {
                log.LogWarning(authorizationResult.FailureReason);
                return new UnauthorizedResult();
            }

            Uri collectionUri = UriFactory.CreateDocumentCollectionUri("2wr", "hazardhunts");
            var query = client.CreateDocumentQuery<HazardHunt>(collectionUri).AsDocumentQuery();
            var hazards = new List<HazardHunt>();

            while (query.HasMoreResults)
            {
                var result = await query.ExecuteNextAsync<HazardHunt>();
                hazards.AddRange(result);               
            }

            return new OkObjectResult(hazards);
        }
    }
}
