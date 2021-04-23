using Newtonsoft.Json;

namespace TwoWeeksReady.Common.FamilyPlans
{
  public class Address
  {
    [JsonProperty(PropertyName = "address1")]
    public string Address1 { get; set; }
    [JsonProperty(PropertyName = "address2")]
    public string Address2 { get; set; }
    [JsonProperty(PropertyName = "cityTown")]
    public string CityTown { get; set; }
    [JsonProperty(PropertyName = "stateProvince")]
    public string StateProvince { get; set; }
    [JsonProperty(PropertyName = "postalCode")]
    public string PostalCode { get; set; }
  }
}