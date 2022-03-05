using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AzureFunctions.OidcAuthentication;
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
using TwoWeeksReady.Authorization;
using TwoWeeksReady.Common.EmergencyKits;

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
            var query = client.CreateDocumentQuery<BaseKit>(collectionUri, new FeedOptions { EnableCrossPartitionQuery = true })
                                .AsDocumentQuery();

            var baseKits = new List<BaseKit>();
            while (query.HasMoreResults)
            {
                var result = await query.ExecuteNextAsync<BaseKit>();
                baseKits.AddRange(result);
            }

            return new OkObjectResult(baseKits);
        }

        [FunctionName("basekit-by-id")]
        public async Task<IActionResult> GetKit(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "basekit-by-id/{id}")]
            HttpRequest req,
            string id,
            [CosmosDB( databaseName: "2wr", collectionName: "basekits", ConnectionStringSetting = "CosmosDBConnection")]
            DocumentClient client,
            ILogger log)
        {
            var authorizationResult = await _apiAuthentication.AuthenticateAsync(req.Headers);
            if (authorizationResult.Failed)
            {
                log.LogWarning(authorizationResult.FailureReason);
                return new UnauthorizedResult();
            }

            if (String.IsNullOrWhiteSpace(id))
            {
                return new BadRequestObjectResult("Kit id was not specified.");
            }

            log.LogInformation($"Getting single base kit");
            Uri collectionUri = UriFactory.CreateDocumentCollectionUri("2wr", "basekits");
            var baseKit = client.CreateDocumentQuery<BaseKit>(collectionUri, new FeedOptions { EnableCrossPartitionQuery = true })
                                .Where(b => b.Id == id).FirstOrDefault();

            if (baseKit == null)
            {
                log.LogWarning($"Kit: {id} not found.");
                return new BadRequestObjectResult("Kit not found.");
            }

            return new OkObjectResult(baseKit);
        }

        [FunctionName("basekit-create")]
        public async Task<IActionResult> CreateBaseKit(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
        HttpRequest req,
            [CosmosDB(databaseName: "2wr", collectionName: "basekits", ConnectionStringSetting = "CosmosDBConnection")]
        DocumentClient client,
            ILogger log)
        {

            log.LogInformation($"Creating a base kit");
            var authorizationResult = await _apiAuthentication.AuthenticateAsync(req.Headers);
            if (authorizationResult.Failed)
            {
                log.LogWarning(authorizationResult.FailureReason);
                return new UnauthorizedResult();
            }

            if (!authorizationResult.IsInRole(Roles.Admin))
            {
                log.LogWarning($"User is not in the {Roles.Admin} role");
                return new UnauthorizedResult();
            }

            var content = await new StreamReader(req.Body).ReadToEndAsync();
            var newBaseKit = JsonConvert.DeserializeObject<BaseKit>(content);
            newBaseKit.Id = Guid.NewGuid().ToString();
            if (newBaseKit.Items.Count > 0)
            {
                newBaseKit.Items.ForEach(ki => { ki.Id = Guid.NewGuid().ToString(); });
            }

            Uri collectionUri = UriFactory.CreateDocumentCollectionUri("2wr", "basekits");
            Document document = await client.CreateDocumentAsync(collectionUri, newBaseKit);

            return new OkObjectResult(newBaseKit);
        }

        [FunctionName("basekit-update")]
        public async Task<IActionResult> UpdateBaseKit(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = null)]
          HttpRequest req,
            [CosmosDB( databaseName: "2wr", collectionName: "basekits", ConnectionStringSetting = "CosmosDBConnection")]
          DocumentClient client,
            ILogger log)
        {

            log.LogInformation($"Updating a base kit");
            var authorizationResult = await _apiAuthentication.AuthenticateAsync(req.Headers);
            if (authorizationResult.Failed)
            {
                log.LogWarning(authorizationResult.FailureReason);
                return new UnauthorizedResult();
            }

            if (!authorizationResult.IsInRole(Roles.Admin))
            {
                log.LogWarning($"User is not in the {Roles.Admin} role");
                return new UnauthorizedResult();
            }

            var content = await new StreamReader(req.Body).ReadToEndAsync();
            var kit = JsonConvert.DeserializeObject<BaseKit>(content);

            //verify existing document (not upserting as this is an update only function)
            var baseKitUri = UriFactory.CreateDocumentUri("2wr", "basekits", kit.Id);
            BaseKit existingKit = null;
            try
            {
                existingKit = (await client.ReadDocumentAsync<BaseKit>(baseKitUri, new RequestOptions { PartitionKey = new PartitionKey(kit.Id) })).Document;
            }
            catch (DocumentClientException ex)
            {
                if (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    log.LogWarning($"Base Kit: {kit.Id} not found.");
                    return new BadRequestObjectResult("Base Kit not found.");
                }
            }

            if (kit.Items.Count > 0)
            {
                kit.Items.ForEach(ki =>
                {
                    if (String.IsNullOrWhiteSpace(ki.Id))
                    {
                        ki.Id = Guid.NewGuid().ToString();
                    }
                });
            }
            Document document = await client.ReplaceDocumentAsync(baseKitUri, kit, new RequestOptions { PartitionKey = new PartitionKey(existingKit.Id) });

            return new OkObjectResult(kit);
        }

        [FunctionName("basekit-delete")]
        public async Task<IActionResult> DeleteBaseKit(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "basekit-delete/{id}")]
          HttpRequest req,
            string id,
            [CosmosDB( databaseName: "2wr", collectionName: "basekits", ConnectionStringSetting = "CosmosDBConnection")]
          DocumentClient client,
            ILogger log)
        {

            log.LogInformation($"Deleting a base kit");
            var authorizationResult = await _apiAuthentication.AuthenticateAsync(req.Headers);
            if (authorizationResult.Failed)
            {
                log.LogWarning(authorizationResult.FailureReason);
                return new UnauthorizedResult();
            }
            if (!authorizationResult.IsInRole(Roles.Admin))
            {
                log.LogWarning($"User is not in the {Roles.Admin} role");
                return new UnauthorizedResult();
            }

            if (String.IsNullOrWhiteSpace(id))
            {
                return new BadRequestObjectResult("Base Kit id was not specified.");
            }

            //verify existing document
            var baseKitUri = UriFactory.CreateDocumentUri("2wr", "basekits", id);
            BaseKit existingKit = null;
            try
            {
                existingKit = (await client.ReadDocumentAsync<BaseKit>(baseKitUri, new RequestOptions { PartitionKey = new PartitionKey(id) })).Document;
            }
            catch (DocumentClientException ex)
            {
                if (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    log.LogWarning($"Base Kit: {id} not found.");
                    return new BadRequestObjectResult("Base Kit not found.");
                }
            }

            Document document = await client.DeleteDocumentAsync(baseKitUri, new RequestOptions { PartitionKey = new PartitionKey(existingKit.Id) });
            return new OkObjectResult(true);
        }

    }
}
