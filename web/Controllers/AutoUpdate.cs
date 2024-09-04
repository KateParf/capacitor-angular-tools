using System.Text.Json;
using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;

namespace withweb.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AutoUpdateController : ControllerBase
{
    private Microsoft.AspNetCore.Hosting.IHostingEnvironment _env;
    private readonly ILogger<AutoUpdateController> _logger;

    public AutoUpdateController(ILogger<AutoUpdateController> logger, Microsoft.AspNetCore.Hosting.IHostingEnvironment env)
    {
        _env = env;
        _logger = logger;
    }

    private string getServerPath()
    {
        var webRoot = _env.WebRootPath;
        return webRoot;
    }

    [HttpPost()]
    public UpdateData Post([FromBody] PostData postData)
    {
        string path = getServerPath() + "/client-updates/";
        // если папка существует
        if (Directory.Exists(path))
        {
            string[] dirs = Directory.GetDirectories(path);
            string lastVer = Path.GetFileName(dirs.Last());

            string server = "https://seregapru.ru:8443";
            string url = server + $"/client-updates/{lastVer}/com.smsit.capacitordemo_{lastVer}.zip";
            
            UpdateData data = new UpdateData();
            data.version = lastVer;
            data.url = url; 
            
            return data;
        }
        else
        {
            throw new Exception("Указанной папки не существует");
        }
    }

}

public class UpdateData {
    public string version { get; set; }
    public string url { get; set; }
}

public class PostData {
  public string platform { get; set; }
  public string device_id { get; set; }
  public string app_id { get; set; }
  public string custom_id { get; set; }
  public string plugin_version { get; set; }
  public string version_build { get; set; }
  public string version_code { get; set; }
  public string version_name { get; set; }
  public string version_os { get; set; }
  public bool is_emulator { get; set; }
  public bool is_prod { get; set; }
}