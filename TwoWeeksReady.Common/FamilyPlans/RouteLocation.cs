using System.Collections.Generic;
using Newtonsoft.Json;

namespace TwoWeeksReady.Common.FamilyPlans
{
  public class RouteLocation
  {
    [JsonProperty("id")]
    public string Id { get; set; }
    [JsonProperty("name")]
    public string Name { get; set; }
    [JsonProperty("images")]
    public List<string> Images { get; set; }
    [JsonProperty("instructions")]
    public string Instructions { get; set; }
    [JsonProperty("address")]
    public Address Address { get; set; }
  }
}