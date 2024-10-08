using Microsoft.EntityFrameworkCore;
using withweb;



var builder = WebApplication.CreateBuilder(args);



// Add services to the container.

builder.Services.AddControllersWithViews();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
//!! swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

//!! swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "/api/{controller}/{id?}");

app.MapFallbackToFile("index.html");

app.UseCors(opts =>
    {
        //opts.AllowAnyOrigin();
        opts.WithOrigins(new string[]
        {
            "http://localhost",
            "https://localhost"
        });

        opts.AllowAnyHeader();
        opts.AllowAnyMethod();
        opts.AllowCredentials();
    });

app.Run();
