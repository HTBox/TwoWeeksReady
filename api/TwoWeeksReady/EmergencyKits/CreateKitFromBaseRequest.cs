using Newtonsoft.Json;

namespace TwoWeeksReady.EmergencyKits
{
    public class CreateKitFromBaseRequest
    {        
        [JsonProperty(PropertyName = "baseKitId")]
        public string BaseKitId {get; set;}

        [JsonProperty(PropertyName="name")]
        public string Name {get;set;}
        
        [JsonProperty(PropertyName = "count")]
        public int Count {get;set;}
    }
}