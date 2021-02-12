using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TwoWeeksReady.Common.EmergencyKits;

namespace TwoWeeksReady.Admin.Data
{
	public class StubRepository : IRepository
	{

		private List<BaseKit> _BaseKits = new List<BaseKit>
		{

			new BaseKit {
					Id="1234",
					Name="Emergency Kit",
					Icon="mdi-medical-bag",
					Items = new List<BaseKitItem> {
						new BaseKitItem {
							Id="1",
							Name="Flashlight",
							Description="You need a flashlight if the power is out",
							Photo="",
							QuantityUnit="Flashlights",
							QuantityPerCount=1
						},
						new BaseKitItem {
							Id="2",
							Name="Cans Of Soup",
							Description="You need to eat - nonperishable soup is easy to prepare",
							Photo="",
							QuantityUnit="Cans",
							QuantityPerCount=14
						},
					}
			}

		};

		public Task<IEnumerable<BaseKit>> GetAllBaseKits()
		{
			return Task.FromResult(_BaseKits.AsEnumerable());
		}

		public Task<BaseKit> GetBaseKitById(string id)
		{
			return Task.FromResult(_BaseKits.FirstOrDefault(b => b.Id == id));
		}
	}

}
