using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
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
using TwoWeeksReady.Common.FamilyPlans;

namespace TwoWeeksReady.FamilyPlans
{
  public class FamilyPlansApi
  {

    private const string DatabaseName = "2wr";
    private const string CollectionName = "familyplans";
    private const string CosmoseDbConnection = "CosmosDBConnection";

    private readonly IApiAuthentication _apiAuthentication;
    private ClaimsPrincipal _user;

    public FamilyPlansApi(IApiAuthentication apiAuthentication)
    {
      _apiAuthentication = apiAuthentication;
    }


    [FunctionName("familyplans-get")]
    public async Task<IActionResult> GetList(
      [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)]
      HttpRequest req,
      [CosmosDB( databaseName: DatabaseName, collectionName: CollectionName, ConnectionStringSetting = CosmoseDbConnection)]
      DocumentClient client,
      ILogger log)
    {

      if (!(await Authorized(req, log))) return new UnauthorizedResult();

      log.LogInformation($"Getting list of family plans");

      Uri collectionUri = UriFactory.CreateDocumentCollectionUri(DatabaseName, CollectionName);

      var query = client.CreateDocumentQuery<FamilyPlan>(collectionUri)
        .Where(e => e.UserId == _user.Identity.Name)
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

    [FunctionName("familyplans-update")]
    public async Task<IActionResult> CreateFamilyPlans(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
        HttpRequest req,
        [CosmosDB(databaseName: DatabaseName, collectionName: CollectionName, ConnectionStringSetting = CosmoseDbConnection)]
        DocumentClient client,
        ILogger log)
    {

      if (!(await Authorized(req, log))) return new UnauthorizedResult();

      log.LogInformation($"Creating a Family Plan");

      try
      {
        var content = await new StreamReader(req.Body).ReadToEndAsync();
        var thePlan = JsonConvert.DeserializeObject<FamilyPlan>(content);

        Uri collectionUri = UriFactory.CreateDocumentCollectionUri(DatabaseName, CollectionName);

        if (string.IsNullOrWhiteSpace(thePlan.Id) && string.IsNullOrWhiteSpace(thePlan.UserId))
        {
          thePlan.Id = Guid.NewGuid().ToString();
          thePlan.UserId = _user.Identity.Name;

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
                      .Where(e => e.UserId == _user.Identity.Name && e.Id == thePlan.Id)
                      .AsEnumerable<FamilyPlan>().FirstOrDefault();

          if (existingPlan is null) return new BadRequestResult();

          // Update Plan
          var docUri = UriFactory.CreateDocumentUri(DatabaseName, CollectionName, thePlan.Id);
          Document document = await client.ReplaceDocumentAsync(docUri, thePlan);

          return new OkObjectResult(thePlan);
        }

      }
      catch (Exception ex)
      {
        log.LogCritical($"Failed to create the new Family Plan: {ex}");
      }

      return new BadRequestResult();
    }

    private async Task<bool> Authorized(HttpRequest req, ILogger log)
    {
      var authorizationResult = await _apiAuthentication.AuthenticateAsync(req.Headers);
      if (authorizationResult.Failed)
      {
        log.LogWarning(authorizationResult.FailureReason);
        return false;
      }

      _user = authorizationResult.User;
      return true;
    }
  }
}
