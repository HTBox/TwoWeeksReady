using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TwoWeeksReady.Admin.Security;
using TwoWeeksReady.Common.EmergencyKits;

namespace TwoWeeksReady.Admin.Data
{
    public class FunctionsRepository : IRepository
    {
        private TokenProvider _tokenProvider;

        public FunctionsRepository(TokenProvider tokenProvider)
        {
            this._tokenProvider = tokenProvider;
        }
        public Task<IEnumerable<BaseKit>> GetAllBaseKits()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<HazardHunt>> GetAllHazardHunts()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<HazardInfo>> GetAllHazardInfos()
        {
            throw new NotImplementedException();
        }

        public Task<BaseKit> GetBaseKitById(string id)
        {
            throw new NotImplementedException();
        }

        public Task<HazardHunt> GetHazardHuntById(string id)
        {
            throw new NotImplementedException();
        }

        public Task<HazardInfo> GetHazardInfoById(string id)
        {
            throw new NotImplementedException();
        }

        public Task<BaseKitItem> SaveBaseKitItem(BaseKitItem kit)
        {
            throw new NotImplementedException();
        }

        public Task<HazardHunt> SaveHazardHunt(HazardHunt hazardHunt)
        {
            throw new NotImplementedException();
        }

        public Task<HazardInfo> SaveHazardInfo(HazardInfo hazardInfo)
        {
            throw new NotImplementedException();
        }
    }
}
