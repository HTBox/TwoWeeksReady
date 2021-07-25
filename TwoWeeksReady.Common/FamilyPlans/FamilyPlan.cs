using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace TwoWeeksReady.Common.FamilyPlans
{
  public class FamilyPlan
  {
    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("userid")]
    public string UserId { get; set; }

    [JsonProperty("title")]
    public string Title { get; set; }

    [JsonProperty("address")]
    public Address Address { get; set; }

    [JsonProperty("phoneNumber")]
    public string PhoneNumber { get; set; }

    [JsonProperty("emergecyContacts")]
    public List<Contact> EmergencyContacts { get; set; } = new List<Contact>();

    [JsonProperty("routeLocations")]
    public List<RouteLocation> RouteLocations { get; set; } = new List<RouteLocation>();

    [JsonProperty("children")]
    public List<Child> Children { get; set; } = new List<Child>();

    [JsonProperty("pets")]
    public List<Pet> Pets { get; set; } = new List<Pet>();
  }
}
