using Newtonsoft.Json;

namespace TwoWeeksReady.Common.FamilyPlans
{
  public class Person
  {
    [JsonProperty("id")]
    public string Id { get; set; }
    [JsonProperty("name")]
    public string Name { get; set; }
    [JsonProperty("age")]
    public int Age { get; set; }
    [JsonProperty("phoneNumber")]
    public string PhoneNumber { get; set; }
    [JsonProperty("image")]
    public string Image { get; set; }

  }
}