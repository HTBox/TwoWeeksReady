using Microsoft.Extensions.Configuration;
using System.IO;
using System.Linq;

namespace TwoWeeksReady.Admin.Data
{
    /// <summary>
    /// Provides a list of image that are available within the 2wr client app.
    /// These are use in Hazard Info and in Base Kits
    /// </summary>
    public class ClientImageService
    {
        public readonly IConfiguration _configuration;
        public readonly ClientImage[] clientImages;

        public ClientImageService(IConfiguration configuration)
        {
            _configuration = configuration;

            var imagePaths = File.ReadAllLines("./client-images.txt");
            var appUrl = _configuration["2wrAppUrl"].TrimEnd('/');

            clientImages = imagePaths
                                .Select(i => i.Replace("\\", "/"))
                                .Select(i => new ClientImage
                                {
                                    AbsolutePath = ToAbsolutePath(i),
                                    RelativePath = i
                                }).ToArray();
        }


        public ClientImage[] Images => clientImages;

        public string ToAbsolutePath(string relativeImagePath)
        {
            var appUrl = _configuration["2wrAppUrl"].TrimEnd('/');
            if (string.IsNullOrEmpty(relativeImagePath))
            {
                return appUrl;
            }
            
            return $"{appUrl}/{relativeImagePath.TrimStart('/')}";
        }
    }
}
