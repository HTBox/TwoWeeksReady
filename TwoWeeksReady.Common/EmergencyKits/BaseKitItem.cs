using Newtonsoft.Json;

namespace TwoWeeksReady.Common.EmergencyKits
{
	public class BaseKitItem
	{
		[JsonProperty(PropertyName = "id")]
		public string Id { get; set; }

		[JsonProperty(PropertyName = "name")]
		public string Name { get; set; }

		[JsonProperty(PropertyName = "description")]
		public string Description { get; set; }

		[JsonProperty(PropertyName = "photo")]
		public string Photo { get; set; } // URL or byte[] ?

		[JsonProperty(PropertyName = "quantityPerCount")]
		public int QuantityPerCount { get; set; } //per person or pet, 14 days

		[JsonProperty(PropertyName = "quantityUnit")]
		public string QuantityUnit { get; set; } //measurement unit, 14 days
	}
}