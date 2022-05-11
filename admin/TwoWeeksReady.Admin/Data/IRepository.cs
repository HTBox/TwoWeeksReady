using System.Collections.Generic;
using System.Threading.Tasks;
using TwoWeeksReady.Common.EmergencyKits;

namespace TwoWeeksReady.Admin.Data
{
    public interface IRepository
    {
        Task<IEnumerable<BaseKit>> GetAllBaseKits();
        Task<BaseKit> GetBaseKitById(string id);
        Task<BaseKit> CreateBaseKit(BaseKit kit);
        Task<BaseKit> SaveBaseKit(BaseKit kit);
        Task<bool> DeleteBaseKit(string id);

        Task<IEnumerable<HazardHunt>> GetAllHazardHunts();
        Task<HazardHunt> GetHazardHuntById(string id);
        Task<HazardHunt> CreateHazardHunt(HazardHunt hazardHunt);
        Task<HazardHunt> SaveHazardHunt(HazardHunt hazardHunt);
        Task<bool> DeleteHazardHunt(string id);

        Task<IEnumerable<HazardInfo>> GetAllHazardInfos();
        Task<HazardInfo> GetHazardInfoById(string id);
        Task<HazardInfo> CreateHazardInfo(HazardInfo hazardInfo);
        Task<HazardInfo> SaveHazardInfo(HazardInfo hazardInfo);
        Task<bool> DeleteHazardInfo(string id);
    }

}
