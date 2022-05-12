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

		[JsonProperty(PropertyName = "iconUrl")]
		public string IconUrl { get; set; } 

		[JsonProperty(PropertyName = "items")]
		public List<BaseKitItem> Items { get; set; } = new List<BaseKitItem>();
	}
}