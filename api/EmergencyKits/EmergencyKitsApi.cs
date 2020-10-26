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

namespace TwoWeeksReady.EmergencyKits
{
    public static class EmergencyKitsApi
    {
        [FunctionName("emergencykits")]
        public static async Task<IActionResult> GetList(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)]
            HttpRequest req,
            [CosmosDB( databaseName: "2wr", collectionName: "emergencykits", ConnectionStringSetting = "CosmosDBConnection")]
            DocumentClient client,
            ILogger log)
        {
          
            log.LogInformation($"Getting list of emergency kits");            
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
