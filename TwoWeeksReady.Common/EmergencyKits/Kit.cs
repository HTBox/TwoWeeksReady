using Newtonsoft.Json;
using System.Collections.Generic;

namespace TwoWeeksReady.Common.EmergencyKits
{
	public class Kit
	{
		[JsonProperty(PropertyName = "id")]
		public string Id { get; set; }

		[JsonProperty(PropertyName = "baseKitId")]
		public string BaseKitId { get; set; }

		[JsonProperty(PropertyName = "userId")]
		public string UserId { get; set; }

		[JsonProperty(PropertyName = "name")]
		public string Name { get; set; }

		[JsonProperty(PropertyName = "kitItems")]
		public List<KitItem> Items { get; set; } = new List<KitItem>();
	}
}