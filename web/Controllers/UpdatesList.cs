using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;

namespace withweb.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class UpdatesListController : ControllerBase
{
    private Microsoft.AspNetCore.Hosting.IHostingEnvironment _env;
    private readonly ILogger<UpdatesListController> _logger;

    public UpdatesListController(ILogger<UpdatesListController> logger, Microsoft.AspNetCore.Hosting.IHostingEnvironment env)
    {
        _env = env;
        _logger = logger;
    }

    private string getServerPath()
    {
        var webRoot = _env.WebRootPath;
        return webRoot;
    }

    [HttpGet()]
    public string[] Get()
    {
        string path = getServerPath() + "/client-updates/";
        // если папка существует
        if (Directory.Exists(path))
        {
            string[] dirs = Directory.GetDirectories(path);
            for (int i = 0; i < dirs.Length; i++)
            {
                dirs[i] = Path.GetFileName(dirs[i]);
            }
            Array.Sort(dirs);
            return dirs;
            //return Path.GetFileName(dirs.Last());
        }
        else
        {
            throw new Exception("Указанной папки не существует");
        }
    }
}
