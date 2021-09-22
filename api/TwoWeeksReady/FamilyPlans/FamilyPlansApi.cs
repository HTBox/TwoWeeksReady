using AzureFunctions.OidcAuthentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using TwoWeeksReady.Common;
using TwoWeeksReady.Common.FamilyPlans;

namespace TwoWeeksReady.FamilyPlans
{
  public class FamilyPlansApi : BaseFunction
  {
    const string CollectionName = "familyplans";

    public FamilyPlansApi(IApiAuthentication apiAuthentication)
      : base(apiAuthentication)
    {
    }


    [FunctionName("familyplans-getall")]
    public async Task<IActionResult> GetList(
      [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)]
      HttpRequest req,
      [CosmosDB(databaseName: DefaultDatabaseName,
                collectionName: CollectionName,
                ConnectionStringSetting = DefaultDbConnectionName)]
      DocumentClient client,
      ILogger log)
    {

      if (!(await Authorized(req, log))) return new UnauthorizedResult();

      log.LogInformation($"Getting list of family plans");

      Uri collectionUri = UriFactory.CreateDocumentCollectionUri(DefaultDatabaseName, CollectionName);

      var query = client.CreateDocumentQuery<FamilyPlan>(collectionUri)
        .Where(e => e.UserId == Principal.Identity.Name)
        .AsDocumentQuery();

      var familyPlans = new List<FamilyPlan>();
      while (query.HasMoreResults)
      {
        try
        {
          var result = await query.ExecuteNextAsync<FamilyPlan>();
          familyPlans.AddRange(result);
        }
        catch (Exception ex)
        {
          log.LogError($"Exception thrown in finding family plan - probably empty DocumentDb: {ex}", ex);
          break;
        }
      }

      return new OkObjectResult(familyPlans);
    }

    [FunctionName("familyplans-upsert")]
    public async Task<IActionResult> UpsertFamilyPlan(
      [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
      HttpRequest req,
      [CosmosDB(databaseName: DefaultDatabaseName,
              collectionName: CollectionName,
              ConnectionStringSetting = DefaultDbConnectionName)]
      DocumentClient client,
      ILogger log)
    {

      if (!(await Authorized(req, log))) return new UnauthorizedResult();

      log.LogInformation($"Upserting a Family Plan");

      try
      {
        var content = await new StreamReader(req.Body).ReadToEndAsync();
        var thePlan = JsonConvert.DeserializeObject<FamilyPlan>(content);

        Uri collectionUri = UriFactory.CreateDocumentCollectionUri(DefaultDatabaseName, CollectionName);

        if (string.IsNullOrWhiteSpace(thePlan.Id) && string.IsNullOrWhiteSpace(thePlan.UserId))
        {
          thePlan.Id = Guid.NewGuid().ToString();
          thePlan.UserId = Principal.Identity.Name;

          // Create new plan
          var response = await client.CreateDocumentAsync(collectionUri, thePlan);

          if (response.StatusCode == System.Net.HttpStatusCode.Created)
          {
            return new CreatedResult("", thePlan);
          }
        }
        else
        {
          var existingPlan = client.CreateDocumentQuery<FamilyPlan>(collectionUri, new FeedOptions { EnableCrossPartitionQuery = false })
                      .Where(e => e.UserId == Principal.Identity.Name && e.Id == thePlan.Id)
                      .AsEnumerable<FamilyPlan>().FirstOrDefault();

          if (existingPlan is null) return new BadRequestResult();

          // Update Plan
          var docUri = UriFactory.CreateDocumentUri(DefaultDatabaseName, CollectionName, thePlan.Id);
          Document document = await client.ReplaceDocumentAsync(docUri, thePlan);

          return new OkObjectResult(thePlan);
        }

      }
      catch (Exception ex)
      {
        log.LogCritical($"Failed to upsert the new Family Plan: {ex}");
      }

      return new BadRequestResult();
    }

    [FunctionName("familyplans-delete")]
    public async Task<IActionResult> DeleteFamilyPlan(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "familyplans-delete/{id}")]
        HttpRequest req,
        string id,
        [CosmosDB(databaseName: DefaultDatabaseName,
                  collectionName: CollectionName,
                  ConnectionStringSetting = DefaultDbConnectionName)]
        DocumentClient client,
        ILogger log)
    {

      if (!(await Authorized(req, log))) return new UnauthorizedResult();

      log.LogInformation($"Deleting a Family Plan");

      Uri collectionUri = UriFactory.CreateDocumentCollectionUri(DefaultDatabaseName, CollectionName);



      //verify existing document (not upserting as this is an update only function)
      var options = new FeedOptions()
      {
        EnableCrossPartitionQuery = true
      };
      var existingDocument = client.CreateDocumentQuery<FamilyPlan>(collectionUri, options)
         .Where(d => d.Id == id)
         .AsEnumerable().FirstOrDefault();

      if (existingDocument == null)
      {
        log.LogWarning($"{id} not found.");
        return new BadRequestObjectResult($"Family Plan not found.");
      }

      var documentUri = UriFactory.CreateDocumentUri(DefaultDatabaseName, CollectionName, id);

      await client.DeleteDocumentAsync(documentUri, new RequestOptions
      {
        PartitionKey = new PartitionKey(existingDocument.UserId)
      });

      return new OkObjectResult(true);

    }

  }
}
