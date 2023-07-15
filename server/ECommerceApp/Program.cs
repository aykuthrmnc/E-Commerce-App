using ECommerceApp.Context;
using ECommerceApp.Contracts;
using ECommerceApp.Repository;
using EmailService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using System.Reflection;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// SWAGGER
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));

    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "E-Commerce App",
        Version = "v1",
    });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Standard Authorization header using the Bearer scheme (\"bearer {token}\")",
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement {
        {
            new OpenApiSecurityScheme {
                Reference = new OpenApiReference {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
    options.ExampleFilters();
});

builder.Services.AddSingleton<DapperContext>();
builder.Services.AddScoped<ICompanyRepository, CompanyRepository>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IProductRatingRepository, ProductRatingRepository>();
//builder.Services.AddDbContext<DapperContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("SqlConnection")));
//builder.Services.AddDbContext<EcommerceAppContext>(); // Code-First
builder.Services.AddSwaggerExamplesFromAssemblies(Assembly.GetEntryAssembly());

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("EnableCORS", builder =>
    {
        builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

// AUTHENTICATION
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(opt =>
{
    opt.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        //ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        //ValidIssuer = "https://localhost:44303",
        //ValidAudience = "https://localhost:44303",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value)),
        //NameClaimType = "id"
    };
});

// AUTHORIZATION
builder.Services.AddAuthorization(opt =>
{
    opt.AddPolicy("Admin", policy => policy.RequireClaim("RoleId", "1"));
});

// EMAIL
builder.Services.AddSingleton(builder.Configuration.GetSection("EmailConfiguration").Get<EmailConfiguration>());
builder.Services.AddScoped<IEmailSender, EmailSender>();

// LOGGING
//builder.Logging.ClearProviders();
//var path = builder.Configuration.GetValue<string>("Logging:FilePath");
//var logger = new LoggerConfiguration().Enrich.FromLogContext().WriteTo.File(path, rollingInterval: RollingInterval.Day).CreateLogger();
//builder.Logging.AddSerilog(logger);


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    //app.UseStaticFiles();
    app.UseStaticFiles(new StaticFileOptions()
    {
        FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources")),
        RequestPath = new PathString("/Resources")
    });
}

app.UseHttpsRedirection();

app.UseCors("EnableCORS");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
