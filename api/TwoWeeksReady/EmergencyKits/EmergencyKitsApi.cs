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
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using AzureFunctions.OidcAuthentication;
using TwoWeeksReady.Common.EmergencyKits;

namespace TwoWeeksReady.EmergencyKits
{
    public class EmergencyKitsApi
    {
        private readonly IApiAuthentication _apiAuthentication;

        public EmergencyKitsApi(IApiAuthentication apiAuthentication)
        {
            _apiAuthentication = apiAuthentication;
        }

        [FunctionName("emergencykits")]
        public async Task<IActionResult> GetKits(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)]
            HttpRequest req,            
            [CosmosDB( databaseName: "2wr", collectionName: "emergencykits", ConnectionStringSetting = "CosmosDBConnection")]
            DocumentClient client,
            ILogger log)
        {
            var authorizationResult = await _apiAuthentication.AuthenticateAsync(req.Headers);
            if (authorizationResult.Failed)
            {
                log.LogWarning(authorizationResult.FailureReason);
                return new UnauthorizedResult();
            } 

           
            log.LogInformation($"Getting list of emergency kits");         
            Uri collectionUri = UriFactory.CreateDocumentCollectionUri("2wr", "emergencykits");
            var query = client.CreateDocumentQuery<Kit>(collectionUri, new FeedOptions{EnableCrossPartitionQuery = false})
                                .Where(e => e.UserId == authorizationResult.User.Identity.Name)
                                .AsDocumentQuery();

            var emergencyKits = new List<Kit>();
            while (query.HasMoreResults)
            {
                var result = await query.ExecuteNextAsync<Kit>();
                emergencyKits.AddRange(result);            
            }

            return new OkObjectResult(emergencyKits); 
        }

       [FunctionName("emergencykit-by-id")]
        public async Task<IActionResult> GetKit(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "emergencykit-by-id/{id}")]
            HttpRequest req,
            string id,
            [CosmosDB( databaseName: "2wr", collectionName: "emergencykits", ConnectionStringSetting = "CosmosDBConnection")]
            DocumentClient client,
            ILogger log)
        {
            var authorizationResult = await _apiAuthentication.AuthenticateAsync(req.Headers);
            if (authorizationResult.Failed)
            {
                log.LogWarning(authorizationResult.FailureReason);
                return new UnauthorizedResult();
            } 

            if(String.IsNullOrWhiteSpace(id))
            {
               return new BadRequestObjectResult("Kit id was not specified.");
            }

           
            log.LogInformation($"Getting single emergency kit");  
            Uri collectionUri = UriFactory.CreateDocumentCollectionUri("2wr", "emergencykits");
            var kit = client.CreateDocumentQuery<Kit>(collectionUri, new FeedOptions{EnableCrossPartitionQuery = false})
                                .Where(e => e.UserId == authorizationResult.User.Identity.Name && e.Id==id)
                                .AsEnumerable<Kit>().FirstOrDefault();

            if(kit == null)
            {
                log.LogWarning($"Kit: {id} not found.");
                return new BadRequestObjectResult("Kit not found.");
            }
        
            return new OkObjectResult(kit);
        }

        [FunctionName("emergencykit-create")]
        public async Task<IActionResult> CreateKit(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
            HttpRequest req,
            [CosmosDB( databaseName: "2wr", collectionName: "emergencykits", ConnectionStringSetting = "CosmosDBConnection")]
            DocumentClient client,
            ILogger log)
        {
          
            log.LogInformation($"Creating an emergency kit");      
            var authorizationResult = await _apiAuthentication.AuthenticateAsync(req.Headers);
            if (authorizationResult.Failed)
            {
                log.LogWarning(authorizationResult.FailureReason);
                return new UnauthorizedResult();
            }

            var content = await new StreamReader(req.Body).ReadToEndAsync();
            var newEmergencyKit = JsonConvert.DeserializeObject<Kit>(content);
            newEmergencyKit.Id = Guid.NewGuid().ToString();
            newEmergencyKit.UserId = authorizationResult.User.Identity.Name;
            if(newEmergencyKit.Items.Count > 0) 
            {
                newEmergencyKit.Items.ForEach(ki => {ki.Id=Guid.NewGuid().ToString(); ki.UserId = authorizationResult.User.Identity.Name;});
            }

            Uri collectionUri = UriFactory.CreateDocumentCollectionUri("2wr", "emergencykits");
            Document document = await client.CreateDocumentAsync(collectionUri, newEmergencyKit);
                 
            return new OkObjectResult(newEmergencyKit);
        }

        [FunctionName("emergencykit-create-from-base-kit")]
        public async Task<IActionResult> CreateFromBaseKit(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
            HttpRequest req,
            [CosmosDB( databaseName: "2wr", collectionName: "emergencykits", ConnectionStringSetting = "CosmosDBConnection")]
            DocumentClient client,
            [CosmosDB( databaseName: "2wr", collectionName: "basekits", ConnectionStringSetting = "CosmosDBConnection")]
            DocumentClient baseKitClient,
            ILogger log)
        {
          
            log.LogInformation($"Creating a new kit off of a base kit");
            var authorizationResult = await _apiAuthentication.AuthenticateAsync(req.Headers);
            if (authorizationResult.Failed)
            {
                log.LogWarning(authorizationResult.FailureReason);
                return new UnauthorizedResult();
            }

            Uri collectionUri = UriFactory.CreateDocumentCollectionUri("2wr", "emergencykits");
            
            var content = await new StreamReader(req.Body).ReadToEndAsync();
            var request = JsonConvert.DeserializeObject<CreateKitFromBaseRequest>(content);
            var kit = new Kit();
            kit.Id = Guid.NewGuid().ToString();
            kit.UserId = authorizationResult.User.Identity.Name;

            //Pull Base kit information by id, Add items from base kit, multiply quantity by the count            
            var baseKitUri = UriFactory.CreateDocumentUri("2wr", "basekits", request.BaseKitId);
            BaseKit baseKit = null;
            try
            {
                baseKit = (await baseKitClient.ReadDocumentAsync<BaseKit>(baseKitUri, new RequestOptions{PartitionKey = new PartitionKey(request.BaseKitId)})).Document;
            }
            catch(DocumentClientException ex)
            {
                if(ex.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    log.LogWarning($"Base Kit: {request.BaseKitId} not found.");
                    return new BadRequestObjectResult("Base Kit not found.");
                }
            }
                       
            baseKit.Items.ForEach(bki => kit.Items.Add(new KitItem{
                Id = Guid.NewGuid().ToString(),
                UserId = authorizationResult.User.Identity.Name,
                Name = bki.Name,
                Description = bki.Description,
                Photo = bki.Photo,
                Quantity = bki.QuantityPerCount * request.Count,
                QuantityUnit = bki.QuantityUnit,
                IsAvailableInKit = false
            }));        

            Document document = await client.CreateDocumentAsync(collectionUri, kit);
           
            return new OkObjectResult(kit);
        }

        [FunctionName("emergencykit-update")]
        public async Task<IActionResult> UpdateKit(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = null)]
            HttpRequest req,
            [CosmosDB( databaseName: "2wr", collectionName: "emergencykits", ConnectionStringSetting = "CosmosDBConnection")]
            DocumentClient client,
            ILogger log)
        {
          
            log.LogInformation($"Updating an emergency kit");      
            var authorizationResult = await _apiAuthentication.AuthenticateAsync(req.Headers);
            if (authorizationResult.Failed)
            {
                log.LogWarning(authorizationResult.FailureReason);
                return new UnauthorizedResult();
            }

            var content = await new StreamReader(req.Body).ReadToEndAsync();
            var kit = JsonConvert.DeserializeObject<Kit>(content);            

            Uri collectionUri = UriFactory.CreateDocumentCollectionUri("2wr", "emergencykits");

            //verify existing document (not upserting as this is an update only function)
            var existingKit = client.CreateDocumentQuery<Kit>(collectionUri, new FeedOptions{EnableCrossPartitionQuery = false})
                                .Where(e => e.UserId == authorizationResult.User.Identity.Name && e.Id==kit.Id)
                                .AsEnumerable<Kit>().FirstOrDefault();

            if(existingKit == null)
            {
                log.LogWarning($"Kit: {kit.Id} not found.");
                return new BadRequestObjectResult("Kit not found.");
            }

            if(kit.Items.Count > 0) 
            {
                kit.Items.ForEach(ki => {
                    if(String.IsNullOrWhiteSpace(ki.Id)){
                        ki.Id=Guid.NewGuid().ToString(); 
                        ki.UserId = authorizationResult.User.Identity.Name;
                    }
                   
                });
            }

            var kitUri = UriFactory.CreateDocumentUri("2wr", "emergencykits", kit.Id);
            Document document = await client.ReplaceDocumentAsync(kitUri, kit);
                 
            return new OkObjectResult(kit);
        }

        [FunctionName("emergencykit-delete")]
        public async Task<IActionResult> DeleteKit(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "emergencykit-delete/{id}")]
            HttpRequest req,
            string id,
            [CosmosDB( databaseName: "2wr", collectionName: "emergencykits", ConnectionStringSetting = "CosmosDBConnection")]
            DocumentClient client,
            ILogger log)
        {
          
            log.LogInformation($"Deleting an emergency kit");
            var authorizationResult = await _apiAuthentication.AuthenticateAsync(req.Headers);
            if (authorizationResult.Failed)
            {
                log.LogWarning(authorizationResult.FailureReason);
                return new UnauthorizedResult();
            }

            if(String.IsNullOrWhiteSpace(id))
            {
               return new BadRequestObjectResult("Kit id was not specified.");
            }           
            
            Uri collectionUri = UriFactory.CreateDocumentCollectionUri("2wr", "emergencykits");

            //verify existing document (not upserting as this is an update only function)
            var existingKit = client.CreateDocumentQuery<Kit>(collectionUri, new FeedOptions{EnableCrossPartitionQuery = false})
                                .Where(e => e.UserId == authorizationResult.User.Identity.Name && e.Id==id)
                                .AsEnumerable<Kit>().FirstOrDefault();

            if(existingKit == null)
            {
                log.LogWarning($"Kit: {id} not found.");
                return new BadRequestObjectResult("Kit not found.");
            }

            var kitUri = UriFactory.CreateDocumentUri("2wr", "emergencykits", id);
            Document document = await client.DeleteDocumentAsync(kitUri, new RequestOptions{PartitionKey = new PartitionKey(authorizationResult.User.Identity.Name)});
                 
            return new OkObjectResult(true);
        }
    }
}
