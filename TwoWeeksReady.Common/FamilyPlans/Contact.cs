using Newtonsoft.Json;

namespace TwoWeeksReady.Common.FamilyPlans
{
  public class Contact
  {
    [JsonProperty("fullName")]
    public string FullName { get; set; }
    [JsonProperty("cellPhone")]
    public string CellPhone { get; set; }
    [JsonProperty("email")]
    public string Email { get; set; }
    [JsonProperty("schoolInformation")]
    public string SchoolInformation { get; set; }
    [JsonProperty("workInformation")]
    public string WorkInformation { get; set; }
    [JsonProperty("medicalInformation")]
    public string MedicalInformation { get; set; }
    [JsonProperty("notifyLastLocation")]
    public bool NotifyLastLocation { get; set; }
    [JsonProperty("sharePlanWith")]
    public bool SharePlanWith { get; set; }
  }
}