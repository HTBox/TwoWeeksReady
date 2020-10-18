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

namespace TwoWeeksReady.FamilyMembers
{
    public static class FamilyMembersApi
    {
        [FunctionName("familymembers")]
        public static async Task<IActionResult> GetList(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)]
            HttpRequest req,
            [CosmosDB( databaseName: "2wr", collectionName: "familymembers", ConnectionStringSetting = "CosmosDBConnection")] 
            DocumentClient client,
                ILogger log)
        {
            log.LogInformation($"Getting list of family members");
            
            Uri collectionUri = UriFactory.CreateDocumentCollectionUri("2wr", "familymembers");

            var query = client.CreateDocumentQuery<FamilyMember>(collectionUri).AsDocumentQuery();
            var familyMembers = new List<FamilyMember>();
            while (query.HasMoreResults)
            {
                var result = await query.ExecuteNextAsync<FamilyMember>();
                familyMembers.AddRange(result);
                
            }

            return new OkObjectResult(familyMembers);
        }
    }
}
