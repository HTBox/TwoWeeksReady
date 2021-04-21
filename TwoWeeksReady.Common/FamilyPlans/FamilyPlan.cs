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

    //public List<WalkThroughStep> Walkthrough { get; set; }
    [JsonProperty("address")]
    public Address Address { get; set; }

    [JsonProperty("phoneNumber")]
    public string PhoneNumber { get; set; }

    //public List<Contact> EmergencyContacts { get; set; }
    //public List<RouteLocation> RouteLocations { get; set; }
    //public List<Person> Children { get; set; }
    //public List<Pet> Pets { get; set; }
  }
}
