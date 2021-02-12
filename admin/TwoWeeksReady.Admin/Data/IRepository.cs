using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TwoWeeksReady.Common.EmergencyKits;

namespace TwoWeeksReady.Admin.Data
{
	public interface IRepository
	{

		Task<BaseKit> GetBaseKitById(string id);

		Task<IEnumerable<BaseKit>> GetAllBaseKits();

	}

}
