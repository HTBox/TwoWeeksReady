using Newtonsoft.Json;

namespace TwoWeeksReady.Common.FamilyPlans
{
  public class Address
  {
    [JsonProperty(PropertyName = "address1")]
    public string Address1 { get; set; }
    [JsonProperty(PropertyName = "address2")]
    public string Address2 { get; set; }
    [JsonProperty(PropertyName = "address3")]
    public string Address3 { get; set; }
  }
}