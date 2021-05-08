using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;

namespace CosmosEmulator
{
  internal class CosmosInitializer
  {
    // Hardcoded in the emulator
    const string ConnectionString = "AccountEndpoint=https://localhost:8081/;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";
    const string DbName = "2wr";

    internal async Task<int> Run()
    {
      try
      {
        Console.WriteLine($"Creating Cosmos Client");
        var client = new CosmosClient(ConnectionString);
        Console.WriteLine($"Creating Database: {DbName}");
        var db = await client.CreateDatabaseIfNotExistsAsync(DbName);
        switch (db.StatusCode)
        {
          case HttpStatusCode.OK:
            Console.WriteLine($"Database Already Existed: {DbName}");
            break;
          case HttpStatusCode.Created:
            Console.WriteLine($"Database Created: {DbName}");
            break;
          default:
            {
              Console.WriteLine($"Database failed to Create: {DbName}");
              return -1;
            }
        }

        var collections = new []
        {
          (name: "emergencykits", key: "/userId"),
          (name: "familymembers", key: "/id"),
          (name: "familyplans", key: "/userid"),
          (name: "hazardhunts", key: "/id"),
          (name: "hazardinformation", key: "/id")
        };

        foreach (var collection in collections)
        {
          Console.WriteLine($"Creating collection: {collection.name}");
          var response = await db.Database.CreateContainerIfNotExistsAsync(collection.name, collection.key, 400);
          switch (db.StatusCode)
          {
            case HttpStatusCode.Created:
              Console.WriteLine($"Created Container {collection.name} Successfully.");
              break;
            case HttpStatusCode.OK:
              Console.WriteLine($"Container {collection.name} Exists.");
              break;
            default:
              {
                Console.WriteLine($"Collection failed to Create: {collection.name}.");
                return -1;
              }
          }
        };

        Console.WriteLine($"Setup complete....");

        return 0;
      }
      catch (Exception ex)
      {
        Console.WriteLine($"Failed to setup Emulator: {ex}");
      }

      return -1;
    }
  }
}