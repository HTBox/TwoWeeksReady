using System.Collections.Generic;

namespace TwoWeeksReady.Common.FamilyPlans
{
  public class RouteLocation
  {
    public string Name { get; set; }
    public List<string> ImageUrls { get; set; }
    public string Instructions { get; set; }
    public Address Address { get; set; }
  }
}