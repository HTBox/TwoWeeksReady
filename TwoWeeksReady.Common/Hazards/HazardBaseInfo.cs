using Newtonsoft.Json;

public class HazardBaseInfo
{
    [JsonProperty(PropertyName = "id")]
    public string Id { get; set; }

    [JsonProperty(PropertyName = "name")]
    public string Name { get; set; }

    [JsonProperty(PropertyName = "description")]
    public string Description { get; set; }

    [JsonProperty(PropertyName = "photo")]
    public string Photo { get; set; }  // URL or byte[] ?

    [JsonProperty(PropertyName = "directive")]
    public string Directive { get; set; }

    [JsonProperty(PropertyName = "externalLink")]
    public string ExternalLink { get; set; }
}