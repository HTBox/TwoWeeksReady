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
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using OidcApiAuthorization.Abstractions;
using OidcApiAuthorization.Models;

namespace TwoWeeksReady.EmergencyKits
{
    public class EmergencyKitsApi
    {
        private readonly IApiAuthorization _apiAuthorization;

        public EmergencyKitsApi(IApiAuthorization apiAuthorization)
        {
            _apiAuthorization = apiAuthorization;
        }

        [FunctionName("emergencykits")]
        public async Task<IActionResult> GetList(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)]
            HttpRequest req,
            [CosmosDB( databaseName: "2wr", collectionName: "emergencykits", ConnectionStringSetting = "CosmosDBConnection")]
            DocumentClient client,
            ILogger log)
        {
          
            log.LogInformation($"Getting list of emergency kits");      
            var authorizationResult = await _apiAuthorization.AuthorizeAsync(req.Headers);
            if (authorizationResult.Failed)
            {
                log.LogWarning(authorizationResult.FailureReason);
                return new UnauthorizedResult();
            }      
            Uri collectionUri = UriFactory.CreateDocumentCollectionUri("2wr", "emergencykits");
            var query = client.CreateDocumentQuery<EmergencyKit>(collectionUri).AsDocumentQuery();
            var emergencyKits = new List<EmergencyKit>();
            while (query.HasMoreResults)
            {
                var result = await query.ExecuteNextAsync<EmergencyKit>();
                emergencyKits.AddRange(result);                
            }

            return new OkObjectResult(emergencyKits);
        }
    }
}
