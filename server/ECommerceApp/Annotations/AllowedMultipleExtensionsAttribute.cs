using System.ComponentModel.DataAnnotations;

namespace ECommerceApp.Annotations
{
    public class AllowedMultipleExtensionsAttribute : ValidationAttribute
    {
        private readonly string[] _extensions;
        public AllowedMultipleExtensionsAttribute(string[] extensions)
        {
            _extensions = extensions;
        }

        protected override ValidationResult IsValid(
        object value, ValidationContext validationContext)
        {
            var files = value as IList<IFormFile>;
            foreach (var file in files)
            {
                if (file != null)
                {
                    var extension = Path.GetExtension(file.FileName);
                    if (!_extensions.Contains(extension.ToLower()))
                    {
                        return new ValidationResult(GetErrorMessage());
                    }
                }
            }

            return ValidationResult.Success;
        }

        public string GetErrorMessage()
        {
            return $"This photos extension is not allowed!";
        }
    }
}
