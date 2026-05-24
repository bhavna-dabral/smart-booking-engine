using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SmartBooking.API.Data; 
using SmartBooking.API.Models;
using System;
using System.Linq;

var builder = WebApplication.CreateBuilder(args);

// --- 1. SERVICE CONTAINER ARCHITECTURE ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register SQLite Pipeline Link 
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=smartbooking.db"));

// --- 2. CORS DOMAIN POLICY HOOKS ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApplication", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

// --- 3. DATABASE MIGRATION ENGINE & DATA SEEDER ---
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        
        // Ensure clean SQLite database generation
        context.Database.EnsureDeleted(); 
        context.Database.EnsureCreated();

        // ==========================================
        // VENDOR 1: SPA & SALONS TRADING PROFILE
        // ==========================================
        var businessSpa = new Business
        {
            Name = "Glow & Grow Wellness Spa",
            BusinessType = "Spa Treatments & Salons", // Matches UI filter text exactly
            OwnerName = "Anuj Dabral",
            Phone = "9876543210",
            Email = "spa@smartbooking.com",
            Address = "Sector 62, Operational Block",
            City = "Noida",
            OpeningTime = "09:00",
            ClosingTime = "21:00",
            CreatedAt = DateTime.UtcNow
        };
        context.Businesses.Add(businessSpa);

        // ==========================================
        // VENDOR 2: RESTAURANTS TRADING PROFILE
        // ==========================================
        var businessFood = new Business
        {
            Name = "The Grand Hackathon Bistro",
            BusinessType = "Restaurants", // Matches UI filter text exactly
            OwnerName = "Anuj Dabral",
            Phone = "9876543211",
            Email = "food@smartbooking.com",
            Address = "Tech Hub Food Court, Block C",
            City = "Noida",
            OpeningTime = "11:00",
            ClosingTime = "23:00",
            CreatedAt = DateTime.UtcNow
        };
        context.Businesses.Add(businessFood);

        // ==========================================
        // VENDOR 3: GYM & FITNESS TRADING PROFILE
        // ==========================================
        var businessGym = new Business
        {
            Name = "Iron Paradise Fitness Zone",
            BusinessType = "Fitness Centers & Gyms", // Matches UI filter text exactly
            OwnerName = "Anuj Dabral",
            Phone = "9876543212",
            Email = "gym@smartbooking.com",
            Address = "Muscle Street, Building 4",
            City = "Noida",
            OpeningTime = "06:00",
            ClosingTime = "22:00",
            CreatedAt = DateTime.UtcNow
        };
        context.Businesses.Add(businessGym);
        
        context.SaveChanges(); // Persist businesses to generate primary IDs

        // ==========================================
        // SEED OFFERS & TIMEFRAME SLOTS
        // ==========================================

        // 1. Spa Offer (Visible under Massage Treatments / Spa Categories)
        var offerSpa = new Offer
        {
            BusinessId = businessSpa.Id,
            Title = "Hackathon Premium Flash: Full Body Massage",
            Description = "Get a premium relaxing 60-minute aromatherapy wellness massage at an unbeatable price.",
            Category = "Massage Treatments", // Matches UI secondary category filter
            OriginalPrice = 2000,
            OfferPrice = 799,
            DiscountPercentage = 60,
            StartDate = DateTime.UtcNow, 
            EndDate = DateTime.UtcNow.AddDays(7),
            TermsAndConditions = "Valid only on weekdays. Cannot be combined with other offers.",
            Status = "Active",
            CreatedAt = DateTime.UtcNow
        };
        context.Offers.Add(offerSpa);

        // 2. Restaurant Offer (Visible under Restaurants / Dining Event Packages)
        var offerFood = new Offer
        {
            BusinessId = businessFood.Id,
            Title = "Luxury 4-Course Fine Dining Package",
            Description = "Experience a chef-curated premium 4-course meal including gourmet appetizers, mains, and desserts.",
            Category = "Dining Event Packages", // Matches UI secondary category filter
            OriginalPrice = 1500,
            OfferPrice = 599,
            DiscountPercentage = 60,
            StartDate = DateTime.UtcNow,
            EndDate = DateTime.UtcNow.AddDays(7),
            TermsAndConditions = "Table reservation required 2 hours prior via portal interface.",
            Status = "Active",
            CreatedAt = DateTime.UtcNow
        };
        context.Offers.Add(offerFood);

        // 3. Gym Offer (Visible under Fitness Centers & Gyms / Cardio Training Hub)
        var offerGym = new Offer
        {
            BusinessId = businessGym.Id,
            Title = "Elite VIP Personal Training Session",
            Description = "High-intensity metabolic cardio profiling and professional muscle assessment with an expert coach.",
            Category = "Cardio Training Hub", // Matches UI secondary category filter
            OriginalPrice = 1200,
            OfferPrice = 399,
            DiscountPercentage = 67,
            StartDate = DateTime.UtcNow,
            EndDate = DateTime.UtcNow.AddDays(7),
            TermsAndConditions = "Bring clean indoor training footwear and a sweat towel.",
            Status = "Active",
            CreatedAt = DateTime.UtcNow
        };
        context.Offers.Add(offerGym);

        context.SaveChanges(); // Persist offers to obtain IDs for slot mappings

        // ==========================================
        // SEED MATRIX ALLOCATION TIME SLOTS
        // ==========================================
        
        // Slots for Spa
        context.OfferSlots.Add(new OfferSlot { OfferId = offerSpa.Id, SlotDate = DateTime.UtcNow.AddDays(1), StartTime = "03:00 PM", EndTime = "05:00 PM", Capacity = 20, BookedCount = 0, Status = "Available", CreatedAt = DateTime.UtcNow });
        context.OfferSlots.Add(new OfferSlot { OfferId = offerSpa.Id, SlotDate = DateTime.UtcNow.AddDays(1), StartTime = "05:00 PM", EndTime = "07:00 PM", Capacity = 15, BookedCount = 0, Status = "Available", CreatedAt = DateTime.UtcNow });

        // Slots for Restaurant Fine Dining
        context.OfferSlots.Add(new OfferSlot { OfferId = offerFood.Id, SlotDate = DateTime.UtcNow.AddDays(1), StartTime = "07:00 PM", EndTime = "09:00 PM", Capacity = 10, BookedCount = 0, Status = "Available", CreatedAt = DateTime.UtcNow });
        context.OfferSlots.Add(new OfferSlot { OfferId = offerFood.Id, SlotDate = DateTime.UtcNow.AddDays(1), StartTime = "09:00 PM", EndTime = "11:00 PM", Capacity = 10, BookedCount = 0, Status = "Available", CreatedAt = DateTime.UtcNow });

        // Slots for Gym Training
        context.OfferSlots.Add(new OfferSlot { OfferId = offerGym.Id, SlotDate = DateTime.UtcNow.AddDays(1), StartTime = "08:00 AM", EndTime = "10:00 AM", Capacity = 8, BookedCount = 0, Status = "Available", CreatedAt = DateTime.UtcNow });
        context.OfferSlots.Add(new OfferSlot { OfferId = offerGym.Id, SlotDate = DateTime.UtcNow.AddDays(1), StartTime = "06:00 PM", EndTime = "08:00 PM", Capacity = 12, BookedCount = 0, Status = "Available", CreatedAt = DateTime.UtcNow });

        context.SaveChanges();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An exception materialized during db initialization seed run.");
    }
}

// --- 4. ENGINE PIPE EXECUTION HOOKS ---
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "SmartBooking Engine v1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApplication");
app.UseAuthorization();
app.MapControllers();
app.Run();