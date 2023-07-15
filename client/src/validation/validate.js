/* eslint-disable no-template-curly-in-string */
import * as Yup from "yup";

Yup.setLocale({
  mixed: {
    required: "Bu alan zorunludur!",
  },
  string: {
    email: "Geçerli bir e-posta adresi giriniz!",
    max: "Maksimum ${max} karakter sınırında metin giriniz!",
  },
  number: {
    min: "En az ${min} değerinde olmalıdır!",
    max: "En fazla ${max} değerinde olmalıdır!",
  },
});

export default Yup;
