using System;
using System.Collections.Generic;

namespace ECommerceApp.Models;

public partial class UserPayment
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string PaymentType { get; set; } = null!;

    public string AccountName { get; set; } = null!;

    public int AccountNumber { get; set; }

    public DateTime ExpiryDate { get; set; }

    public virtual ICollection<Order> Orders { get; } = new List<Order>();

    public virtual User User { get; set; } = null!;
}
