using System;
using Newtonsoft.Json;

namespace TwoWeeksReady.Common.FamilyPlans
{
  public class Child
  {
    [JsonProperty("id")]
    public string Id { get; set; }
    [JsonProperty("name")]
    public string Name { get; set; }
    [JsonProperty("birthday")]
    public DateTime Birthday { get; set; }
    [JsonProperty("phoneNumber")]
    public string PhoneNumber { get; set; }
    [JsonProperty("image")]
    public string Image { get; set; }
    [JsonProperty("schoolName")]
    public string SchoolName { get; set; }
    [JsonProperty("schoolAddress")]
    public Address SchoolAddress { get; set; }
    [JsonProperty("schoolPhone")]
    public string SchoolPhone { get; set; }
    [JsonProperty("relationship")]
    public string Relationship { get; set; }

  }
}