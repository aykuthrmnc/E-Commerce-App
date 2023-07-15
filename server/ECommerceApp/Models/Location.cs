using System;
using System.Collections.Generic;

namespace ECommerceApp.Models;

public partial class Location
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string? PhoneNumber { get; set; }

    public string? AddressLine1 { get; set; }

    public string? AddressLine2 { get; set; }

    public string? Country { get; set; }

    public string? City { get; set; }

    public int? ZipCode { get; set; }

    public string? Description { get; set; }

    public virtual User User { get; set; } = null!;
}
