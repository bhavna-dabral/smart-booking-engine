using System;

namespace SmartBooking.API.Models
{
    public class Business
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string BusinessType { get; set; } = string.Empty; // Restaurant, Gym, Salon, etc.
        public string OwnerName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string? LogoURL { get; set; }
        public string OpeningTime { get; set; } = "09:00";
        public string ClosingTime { get; set; } = "21:00";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Offer
    {
        public int Id { get; set; }
        public int BusinessId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal OriginalPrice { get; set; }
        public decimal OfferPrice { get; set; }
        public decimal DiscountPercentage { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string TermsAndConditions { get; set; } = string.Empty;
        public string Status { get; set; } = "Active"; // Draft, Active, Expired
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class OfferSlot
    {
        public int Id { get; set; }
        public int OfferId { get; set; }
        public DateTime SlotDate { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public int BookedCount { get; set; } = 0;
        public string Status { get; set; } = "Available"; // Available, Full
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Booking
    {
        public int Id { get; set; }
        public string BookingReference { get; set; } = string.Empty;
        public int OfferId { get; set; }
        public int SlotId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public int PeopleCount { get; set; }
        public string? SpecialNote { get; set; }
        public string Status { get; set; } = "Confirmed";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}