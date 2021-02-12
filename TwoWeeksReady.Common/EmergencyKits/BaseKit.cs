using System.Collections.Generic;
using Newtonsoft.Json;

namespace TwoWeeksReady.Common.EmergencyKits
{
	public class BaseKit
	{
		[JsonProperty(PropertyName = "id")]
		public string Id { get; set; }

		[JsonProperty(PropertyName = "name")]
		public string Name { get; set; }

		[JsonProperty(PropertyName = "icon")]
		public string Icon { get; set; } // material icon 

		[JsonProperty(PropertyName = "items")]
		public List<BaseKitItem> Items { get; set; } = new List<BaseKitItem>();
	}
}