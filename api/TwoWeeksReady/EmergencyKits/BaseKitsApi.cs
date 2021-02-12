using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using AzureFunctions.OidcAuthentication;

namespace TwoWeeksReady.EmergencyKits
{
    public class BaseKitsApi
    {
        private readonly IApiAuthentication _apiAuthentication;

        public BaseKitsApi(IApiAuthentication apiAuthentication)
        {
            _apiAuthentication = apiAuthentication;
        }

        [FunctionName("basekits")]
        public async Task<IActionResult> GetKits(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)]
            HttpRequest req,
            [CosmosDB( databaseName: "2wr", collectionName: "basekits", ConnectionStringSetting = "CosmosDBConnection")]
            DocumentClient client,
            ILogger log)
        {
          
            log.LogInformation($"Getting list of base kits");      
            var authorizationResult = await _apiAuthentication.AuthenticateAsync(req.Headers);
            if (authorizationResult.Failed)
            {
                log.LogWarning(authorizationResult.FailureReason);
                return new UnauthorizedResult();
            }      
            Uri collectionUri = UriFactory.CreateDocumentCollectionUri("2wr", "basekits");
            var query = client.CreateDocumentQuery<BaseKit>(collectionUri, new FeedOptions{EnableCrossPartitionQuery = true})
                                .AsDocumentQuery();

            var baseKits = new List<BaseKit>();
            while (query.HasMoreResults)
            {
                var result = await query.ExecuteNextAsync<BaseKit>();
                baseKits.AddRange(result);            
            }

            return new OkObjectResult(baseKits);
        }

    }
}
