using System;
using System.Collections.Generic;

namespace ECommerceApp.Models;

public partial class Order
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int? PaymentId { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Email { get; set; }

    public string? AddressLine1 { get; set; }

    public string? Country { get; set; }

    public string? City { get; set; }

    public int? ZipCode { get; set; }

    public string? Description { get; set; }

    public bool? OrderState { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? ModifiedAt { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; } = new List<OrderItem>();

    public virtual UserPayment? Payment { get; set; }

    public virtual ICollection<ProductRating> ProductRatings { get; } = new List<ProductRating>();

    public virtual User User { get; set; } = null!;
}
