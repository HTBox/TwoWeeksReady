using Newtonsoft.Json;

namespace TwoWeeksReady.EmergencyKits
{
    public class CreateKitFromBaseRequest
    {        
        [JsonProperty(PropertyName = "baseKitId")]
        public string BaseKitId {get; set;}
        
        [JsonProperty(PropertyName = "kit")]
        public Kit Kit {get; set;}
        
        [JsonProperty(PropertyName = "count")]
        public int Count {get;set;}

        [JsonProperty(PropertyName = "unit")]
        public string Unit {get;set;}
    }
}