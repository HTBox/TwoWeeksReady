using System;
using System.Threading.Tasks;

namespace CosmosEmulator
{
  class Program
  {
    static async Task<int> Main(string[] args)
    {
      if (args.Length == 1 && args[0].ToLower() == "/setup")
      {
        Console.WriteLine("Starting to setup the CosmosDB Emulator.");
        return await new CosmosInitializer().Run();
      }
      else
      {
        Console.WriteLine("No command specified.");
        return 0;
      }
    }
  }
}
