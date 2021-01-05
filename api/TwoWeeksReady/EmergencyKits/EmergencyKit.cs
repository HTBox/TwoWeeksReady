using Newtonsoft.Json;

namespace TwoWeeksReady.EmergencyKits
{
    public class EmergencyKit
    {        
        [JsonProperty(PropertyName = "id")]
        public string Id {get; set;}

        [JsonProperty(PropertyName = "userId")]
        public string UserId {get; set;}

        [JsonProperty(PropertyName = "name")]
        public string Name {get; set;}
        
         [JsonProperty(PropertyName = "color")]
        public string Color {get;set;}
    }
}