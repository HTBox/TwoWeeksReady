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
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using TwoWeeksReady.Authorization;

namespace TwoWeeksReady.Hazards
{
    public abstract class HazardApiBase<T> where T : HazardBaseInfo
    {
        protected const string DatabaseName = "2wr";
        protected const string ConnectionStringKey = "CosmosDBConnection";

        private readonly IApiAuthentication _apiAuthentication;

        protected HazardApiBase(IApiAuthentication apiAuthentication)
        {
            _apiAuthentication = apiAuthentication;
        }

        protected async Task<IActionResult> GetDocuments(HttpRequest req, DocumentClient client, ILogger log, string collectionName)
        {
            log.LogInformation($"Getting {collectionName} list");

            var authorizationResult = await _apiAuthentication.AuthenticateAsync(req.Headers);
            if (authorizationResult.Failed)
            {
                log.LogWarning(authorizationResult.FailureReason);
                return new UnauthorizedResult();
            }

            Uri collectionUri = UriFactory.CreateDocumentCollectionUri(DatabaseName, collectionName);
            var query = client.CreateDocumentQuery<T>(collectionUri).AsDocumentQuery();
            var documents = new List<T>();

            while (query.HasMoreResults)
            {
                var result = await query.ExecuteNextAsync<T>();
                documents.AddRange(result);
            }

            return new OkObjectResult(documents);
        }

        protected async Task<IActionResult> GetDocument(
           HttpRequest req, string id, DocumentClient client, ILogger log, string collectionName)
        {
            var authorizationResult = await _apiAuthentication.AuthenticateAsync(req.Headers);
            if (authorizationResult.Failed)
            {
                log.LogWarning(authorizationResult.FailureReason);
                return new UnauthorizedResult();
            }

            if (String.IsNullOrWhiteSpace(id))
            {
                return new BadRequestObjectResult($"{collectionName}: id was not specified.");
            }

            log.LogInformation($"Getting {collectionName} document, id = {id}");
            Uri collectionUri = UriFactory.CreateDocumentCollectionUri(DatabaseName, collectionName);
            var feedOptions = new FeedOptions { EnableCrossPartitionQuery = false };
            var document = client.CreateDocumentQuery<T>(collectionUri, feedOptions)
               .Where(d => d.Id == id)
               .AsEnumerable().FirstOrDefault();

            if (document == null)
            {
                log.LogWarning($"{collectionName}: {id} not found.");
                return new BadRequestObjectResult($"{collectionName} not found.");
            }

            return new OkObjectResult(document);
        }

        protected async Task<IActionResult> CreateDocument(HttpRequest req, DocumentClient client, ILogger log, string collectionName, string requiredRole = null)
        {
            log.LogInformation($"Creating an {collectionName} document");

            var authorizationResult = await _apiAuthentication.AuthenticateAsync(req.Headers);
            if (authorizationResult.Failed)
            {
                log.LogWarning(authorizationResult.FailureReason);
                return new UnauthorizedResult();
            }

            if (!string.IsNullOrEmpty(requiredRole) && !authorizationResult.IsInRole(requiredRole))
            {
                log.LogWarning($"User is not in the {requiredRole} role");
                return new UnauthorizedResult();
            }

            var content = await new StreamReader(req.Body).ReadToEndAsync();
            var newDocument = JsonConvert.DeserializeObject<T>(content);

            Uri collectionUri = UriFactory.CreateDocumentCollectionUri(DatabaseName, collectionName);
            ResourceResponse<Document> createdDocument = await client.CreateDocumentAsync(collectionUri, newDocument);

            return new OkObjectResult(createdDocument.Resource);
        }

        protected async Task<IActionResult> UpdateDocument(
           HttpRequest req, DocumentClient client, ILogger log, string collectionName, string requiredRole = null)
        {
            log.LogInformation($"Updating an {collectionName} document");
            var authorizationResult = await _apiAuthentication.AuthenticateAsync(req.Headers);
            if (authorizationResult.Failed)
            {
                log.LogWarning(authorizationResult.FailureReason);
                return new UnauthorizedResult();
            }

            if (!string.IsNullOrEmpty(requiredRole) && !authorizationResult.IsInRole(requiredRole))
            {
                log.LogWarning($"User is not in the {requiredRole} role");
                return new UnauthorizedResult();
            }

            var content = await new StreamReader(req.Body).ReadToEndAsync();
            var documentUpdate = JsonConvert.DeserializeObject<T>(content);

            Uri collectionUri = UriFactory.CreateDocumentCollectionUri(DatabaseName, collectionName);

            //verify existing document (not upserting as this is an update only function)
            var feedOptions = new FeedOptions { EnableCrossPartitionQuery = false };
            var existingDocument = client.CreateDocumentQuery<T>(collectionUri, feedOptions)
               .Where(d => d.Id == documentUpdate.Id)
               .AsEnumerable().FirstOrDefault();

            if (existingDocument == null)
            {
                log.LogWarning($"{collectionName}: {documentUpdate.Id} not found.");
                return new BadRequestObjectResult($"{collectionName} not found.");
            }

            var documentUri = UriFactory.CreateDocumentUri(DatabaseName, collectionName, documentUpdate.Id);
            await client.ReplaceDocumentAsync(documentUri, documentUpdate);

            return new OkObjectResult(documentUpdate);
        }

        protected async Task<IActionResult> DeleteDocument(
           HttpRequest req, string id, DocumentClient client, ILogger log, string collectionName, string requiredRole = null)
        {
            log.LogInformation($"Deleting {collectionName} document: id = {id}");
            var authorizationResult = await _apiAuthentication.AuthenticateAsync(req.Headers);
            if (authorizationResult.Failed)
            {
                log.LogWarning(authorizationResult.FailureReason);
                return new UnauthorizedResult();
            }
            
            if (!string.IsNullOrEmpty(requiredRole) && !authorizationResult.IsInRole(requiredRole))
            {
                log.LogWarning($"User is not in the {requiredRole} role");
                return new UnauthorizedResult();
            }

            if (String.IsNullOrWhiteSpace(id))
            {
                return new BadRequestObjectResult($"{collectionName}: id was not specified.");
            }

            Uri collectionUri = UriFactory.CreateDocumentCollectionUri(DatabaseName, collectionName);

            //verify existing document (not upserting as this is an update only function)
            var feedOptions = new FeedOptions { EnableCrossPartitionQuery = false };
            var existingDocument = client.CreateDocumentQuery<T>(collectionUri, feedOptions)
               .Where(d => d.Id == id)
               .AsEnumerable().FirstOrDefault();

            if (existingDocument == null)
            {
                log.LogWarning($"{collectionName}: {id} not found.");
                return new BadRequestObjectResult($"{collectionName} not found.");
            }

            var documentUri = UriFactory.CreateDocumentUri(DatabaseName, collectionName, id);

            await client.DeleteDocumentAsync(documentUri, new RequestOptions
            {
                PartitionKey = new PartitionKey(id)
            });

            return new OkObjectResult(true);
        }
    }
}