using System;
using System.Collections.Generic;

namespace ECommerceApp.Models;

public partial class Product
{
    public int Id { get; set; }

    public int CategoryId { get; set; }

    public string Name { get; set; } = null!;

    public string Url { get; set; } = null!;

    public decimal Price { get; set; }

    public int Quantity { get; set; }

    public decimal? Discount { get; set; }

    public string? Description { get; set; }

    public string? ImageUrl { get; set; }

    public bool? IsActive { get; set; }

    public bool? IsApproved { get; set; }

    public bool? IsHome { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? ModifiedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public virtual ICollection<Cart> Carts { get; } = new List<Cart>();

    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<OrderItem> OrderItems { get; } = new List<OrderItem>();

    public virtual ICollection<ProductImage> ProductImages { get; } = new List<ProductImage>();

    public virtual ICollection<ProductRating> ProductRatings { get; } = new List<ProductRating>();
}
