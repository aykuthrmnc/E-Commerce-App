using System;
using System.Collections.Generic;

namespace ECommerceApp.Models;

public partial class Category
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Url { get; set; }

    public string? Description { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? ModifiedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public int? MainCategoryId { get; set; }

    public virtual ICollection<Product> Products { get; } = new List<Product>();
}
