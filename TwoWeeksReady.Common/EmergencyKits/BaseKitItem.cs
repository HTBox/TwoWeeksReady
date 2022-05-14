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

		[JsonProperty(PropertyName = "quantityPerAdult")]
		public int QuantityPerAdult { get; set; } //per adult
		
		[JsonProperty(PropertyName = "quantityPerChild")]
		public int QuantityPerChild { get; set; } //per child

		[JsonProperty(PropertyName = "quantityPerPet")]
		public int QuantityPerPet { get; set; } //per pet

		[JsonProperty(PropertyName = "quantityUnit")]
		public string QuantityUnit { get; set; } //measurement unit, 14 days
	}
}