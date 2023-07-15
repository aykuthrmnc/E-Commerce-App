using System;
using System.Collections.Generic;

namespace ECommerceApp.Models;

public partial class ProductRating
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public int OrderId { get; set; }

    public int UserId { get; set; }

    public string? Description { get; set; }

    public int? Rating { get; set; }

    public DateTime? RatingDate { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
