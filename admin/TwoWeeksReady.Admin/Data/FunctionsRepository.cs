using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using TwoWeeksReady.Admin.Security;
using TwoWeeksReady.Common.EmergencyKits;

namespace TwoWeeksReady.Admin.Data
{
    public class FunctionsRepository : IRepository
    {
        private readonly HttpClient _httpClient;
        private readonly TokenProvider _tokenProvider;

        public FunctionsRepository(IHttpClientFactory httpClientFactory, TokenProvider tokenProvider)
        {
            this._httpClient = httpClientFactory.CreateClient("ApiClient");
            _tokenProvider = tokenProvider;
            this._httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", tokenProvider.AccessToken);
        }
        public Task<IEnumerable<BaseKit>> GetAllBaseKits()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<HazardHunt>> GetAllHazardHunts()
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<HazardInfo>> GetAllHazardInfos()
        {
            return await _httpClient.GetFromJsonAsync<IList<HazardInfo>>("hazardinfo-list");
        }

        public Task<BaseKit> GetBaseKitById(string id)
        {
            throw new NotImplementedException();
        }

        public Task<HazardHunt> GetHazardHuntById(string id)
        {
            throw new NotImplementedException();
        }

        public async Task<HazardInfo> GetHazardInfoById(string id)
        {
            return await _httpClient.GetFromJsonAsync<HazardInfo>($"hazardinfo-by-id/{id}");
        }

        public Task<BaseKitItem> SaveBaseKitItem(BaseKitItem kit)
        {
            throw new NotImplementedException();
        }

        public Task<HazardHunt> SaveHazardHunt(HazardHunt hazardHunt)
        {
            throw new NotImplementedException();
        }

        public async Task<HazardInfo> SaveHazardInfo(HazardInfo hazardInfo)
        {
            var response = await _httpClient.PutAsJsonAsync("hazardinfo-update", hazardInfo);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<HazardInfo>();
            } 
            else
            {
                throw new Exception("Error saving hazard info");
            }
        }
    }
}
