using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using AzureFunctions.OidcAuthentication;
using TwoWeeksReady.Authorization;

namespace TwoWeeksReady.Hazards
{
   public class HazardInfoApi : HazardApiBase<HazardInfo>
   {
      private const string CollectionName = "hazardinformation";

      private const string FuncPrefix = "hazardinfo";

      public HazardInfoApi(IApiAuthentication apiAuthentication) : base(apiAuthentication)
      {
      }

      [FunctionName(FuncPrefix + "-list")]
      public async Task<IActionResult> GetDocuments(
          [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)]
            HttpRequest req,
          [CosmosDB(DatabaseName, CollectionName, ConnectionStringSetting = ConnectionStringKey)]
            DocumentClient client,
          ILogger log)
      {
         return await GetDocuments(req, client, log, CollectionName);
      }


      [FunctionName(FuncPrefix + "-by-id")]
      public async Task<IActionResult> GetDocument(
       [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = FuncPrefix + "-by-id/{id}")]
            HttpRequest req,
       string id,
       [CosmosDB(DatabaseName, CollectionName, ConnectionStringSetting = ConnectionStringKey)]
            DocumentClient client,
       ILogger log)
      {
         return await GetDocument(req, id, client, log, CollectionName);
      }


      [FunctionName(FuncPrefix + "-create")]
      public async Task<IActionResult> CreateDocument(
          [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
            HttpRequest req,
          [CosmosDB( DatabaseName, CollectionName, ConnectionStringSetting = ConnectionStringKey)]
            DocumentClient client,
          ILogger log)
      {
         return await CreateDocument(req, client, log, CollectionName, Roles.Admin);
      }


      [FunctionName(FuncPrefix + "-update")]
      public async Task<IActionResult> UpdateDocument(
          [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = null)]
            HttpRequest req,
          [CosmosDB( DatabaseName, CollectionName, ConnectionStringSetting = ConnectionStringKey)]
            DocumentClient client,
          ILogger log)
      {
         return await UpdateDocument(req, client, log, CollectionName, Roles.Admin);
      }


      [FunctionName(FuncPrefix + "-delete")]
      public async Task<IActionResult> DeleteDocument(
          [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = FuncPrefix + "-delete/{id}")]
            HttpRequest req,
          string id,
          [CosmosDB( DatabaseName, CollectionName, ConnectionStringSetting = ConnectionStringKey)]
            DocumentClient client,
          ILogger log)
      {
         return await DeleteDocument(req, id, client, log, CollectionName);
      }
   }
}
