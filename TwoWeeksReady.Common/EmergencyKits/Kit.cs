using Newtonsoft.Json;
using System.Collections.Generic;

namespace TwoWeeksReady.Common.EmergencyKits
{
	public class Kit
	{
		[JsonProperty(PropertyName = "id")]
		public string Id { get; set; }

		[JsonProperty(PropertyName = "userId")]
		public string UserId { get; set; }

		[JsonProperty(PropertyName = "name")]
		public string Name { get; set; }

		[JsonProperty(PropertyName = "color")]
		public string Color { get; set; } //hex color

		[JsonProperty(PropertyName = "icon")]
		public string Icon { get; set; } //material design icon

		[JsonProperty(PropertyName = "kitItems")]
		public List<KitItem> Items { get; set; } = new List<KitItem>();
	}
}