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

		private List<HazardHunt> _HazardHunt = new List<HazardHunt>()
		{
			new HazardHunt
			{
				 Id = "ABCDEFG",
				 Name = "Bookshelf Safety",
				 Description = "Strap the bookshelf to the wall"
			}
		};

		private List<HazardInfo> _HazardInfo = new List<HazardInfo>()
		{
			new HazardInfo
			{
				 Id = "BEGIN",
				 Name = "Earthquakes",
				 Description = "All about earthquakes"
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

		public Task<BaseKitItem> SaveBaseKitItem(BaseKitItem kitItem)
        {		
			return Task.FromResult(kitItem);
        }


		public Task<IEnumerable<HazardHunt>> GetAllHazardHunts()
        {
			return Task.FromResult(_HazardHunt.AsEnumerable());
        }

		public Task<HazardHunt> GetHazardHuntById(string id)
		{
			return Task.FromResult(_HazardHunt.FirstOrDefault(h => h.Id == id));
		}


		public Task<HazardHunt> SaveHazardHunt(HazardHunt hazardHunt)
		{			
			return Task.FromResult(hazardHunt);
		}

		public Task<IEnumerable<HazardInfo>> GetAllHazardInfos()
		{
			return Task.FromResult(_HazardInfo.AsEnumerable());
		}

		public Task<HazardInfo> GetHazardInfoById(string id)
		{
			return Task.FromResult(_HazardInfo.FirstOrDefault(h => h.Id == id));
		}

		public Task<HazardInfo> SaveHazardInfo(HazardInfo hazardInfo)
		{
			return Task.FromResult(hazardInfo);
		}
	}

}
