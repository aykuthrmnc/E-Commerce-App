using System;
using System.Collections.Generic;

namespace ECommerceApp.Models;

public partial class User
{
    public int Id { get; set; }

    public int RoleId { get; set; }

    public string Username { get; set; } = null!;

    public byte[] PasswordHash { get; set; } = null!;

    public byte[] PasswordSalt { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public DateTime? ModifiedAt { get; set; }

    public virtual ICollection<Cart> Carts { get; } = new List<Cart>();

    public virtual ICollection<Location> Locations { get; } = new List<Location>();

    public virtual ICollection<Order> Orders { get; } = new List<Order>();

    public virtual ICollection<ProductRating> ProductRatings { get; } = new List<ProductRating>();

    public virtual Role Role { get; set; } = null!;

    public virtual ICollection<UserPayment> UserPayments { get; } = new List<UserPayment>();
}
