using System;
using System.IO;
using Microsoft.AspNetCore.Mvc;

namespace withweb.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class StatisticsController : ControllerBase
{
    private Microsoft.AspNetCore.Hosting.IHostingEnvironment _env;
    private readonly ILogger<StatisticsController> _logger;

    public StatisticsController(ILogger<StatisticsController> logger, Microsoft.AspNetCore.Hosting.IHostingEnvironment env)
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
    public string Post([FromBody] AppInfosStats postData)
    {
        string path = getServerPath() + "/client-updates/statistics.txt";
        FileStream? fstream = null;
        StreamWriter? swriter = null;
        try
        {
            fstream = new FileStream(path, FileMode.Append, FileAccess.Write);
            swriter = new StreamWriter(fstream);
            string data = $"\n--- {DateTime.Now} ---\n action: {postData.action}\n app_id: {postData.app_id}\n device_id: {postData.device_id}\n platform: {postData.platform}\n custom_id: {postData.custom_id}\n version_name: {postData.version_name}\n version_build: {postData.version_build}\n version_code: {postData.version_code}\n version_os: {postData.version_os}";
            swriter.WriteLine(data);
        }
        catch (Exception ex)
        { return "not ok"; }
        finally
        {
            swriter?.Close();
            fstream?.Close();
        }
        return "ok";
    }

}

public class AppInfosStats
{
    public string action { get; set; } // can be set, delete, set_fail, reset, revert
    public string app_id { get; set; } // app identifier in the store
    public string device_id { get; set; } // unique id per app install
    public string platform { get; set; } // or android
    public string custom_id { get; set; } // represent your user
    public string version_name { get; set; } // version of the web build
    public string version_build { get; set; } // version of the native build
    public string version_code { get; set; } // build number of the native build
    public string version_os { get; set; } // OS version of the device
    public string plugin_version { get; set; }// to make your api behave differently with different plugins
    public bool is_emulator { get; set; }
    public bool is_prod { get; set; }
}