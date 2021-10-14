using System.Collections.Generic;
using System.Threading.Tasks;
using TwoWeeksReady.Common.EmergencyKits;

namespace TwoWeeksReady.Admin.Data
{
    public interface IRepository
	{

		Task<BaseKit> GetBaseKitById(string id);

		Task<IEnumerable<BaseKit>> GetAllBaseKits();

		Task<BaseKitItem> SaveBaseKitItem(BaseKitItem kit);

		Task<IEnumerable<HazardHunt>> GetAllHazardHunts();

		Task<HazardHunt> GetHazardHuntById(string id);

		Task<HazardHunt> SaveHazardHunt(HazardHunt hazardHunt);

		Task<IEnumerable<HazardInfo>> GetAllHazardInfos();

		Task<HazardInfo> GetHazardInfoById(string id);

		Task<HazardInfo> SaveHazardInfo(HazardInfo hazardInfo);

		Task<HazardInfo> CreateHazardInfo(HazardInfo hazardInfo);
	}

}
