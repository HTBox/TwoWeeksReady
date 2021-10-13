using Newtonsoft.Json;

public class HazardBaseInfo
{
    [JsonProperty(PropertyName = "id")]
    public string Id { get; set; }

    [JsonProperty(PropertyName = "name")]
    public string Name { get; set; }

    [JsonProperty(PropertyName = "description")]
    public string Description { get; set; }

    [JsonProperty(PropertyName = "iconUrl")]
    public string IconUrl {get; set;}

    /// <summary>
    /// URL of image or video describing the hazard
    /// </summary>
    [JsonProperty(PropertyName = "mediaUrl")]
    public string MediaUrl { get; set; }  

    [JsonProperty(PropertyName = "externalLinks")]
    public string[] ExternalLinks { get; set; }

    /// <summary>
    /// HTML used in the Before section of the UI for this Hazard
    /// </summary>
    [JsonProperty(PropertyName = "beforeSafetyDetails")]
    public string BeforeSafetyDetails {get; set;}

    /// <summary>
    /// HTML used in the During section of the UI for this Hazard
    /// </summary>
    [JsonProperty(PropertyName = "duringSafetyDetails")]
    public string DuringSafetyDetails {get; set;}
    
    /// <summary>
    /// HTML used in the After section of the UI for this Hazard
    /// </summary>
    [JsonProperty(PropertyName = "afterSafetyDetails")]    
    public string AfterSafetyDetails {get; set;}
}