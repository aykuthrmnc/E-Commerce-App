using System.ComponentModel.DataAnnotations;

namespace ECommerceApp.Dto
{
    public class RatingDto
    {
        [MaxLength(255, ErrorMessage = "{0}, {1} karakterden fazla olmamalıdır.")]
        public string? Description { get; set; }
        public int? Rating { get; set; }
        public DateTime? RatingDate { get; set; }
    }

    public partial class ProductRating : RatingDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int OrderId { get; set; }
        public int UserId { get; set; }
    }

    public class ProductRatings : RatingDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
    }

    public class ProductRatingsPagination : Pagination
    {
        public IEnumerable<ProductRatings>? ProductRatings { get; set; }
    }

    public class ProductTotalRating
    {
        public decimal TotalRating { get; set; }
        public int OneStar { get; set; }
        public int TwoStar { get; set; }
        public int ThreeStar { get; set; }
        public int FourStar { get; set; }
        public int FiveStar { get; set; }
    }
}
