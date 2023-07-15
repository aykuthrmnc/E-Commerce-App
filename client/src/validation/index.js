import Yup from "./validate";

export const LoginSchema = Yup.object().shape({
  username: Yup.string().required(),
  password: Yup.string().required(),
});

export const RegisterSchema = Yup.object().shape({
  email: Yup.string().required().email(),
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  phoneNumber: Yup.string(),
  username: Yup.mixed()
    .required()
    .test({
      message: "Geçerli bir kullanıcı adı girin",
      test: (str) => /^[a-z0-9._]+$/i.test(str),
    }),
  password: Yup.string().required(),
});

export const ProfileSchema = Yup.object().shape({
  email: Yup.string().required().email(),
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  phoneNumber: Yup.string(),
  username: Yup.mixed()
    .required()
    .test({
      message: "Geçerli bir kullanıcı adı girin",
      test: (str) => /^[a-z0-9._]+$/i.test(str),
    }),
});

export const CategorySchema = Yup.object().shape({
  name: Yup.string().required(),
  url: Yup.string().required(),
  description: Yup.string().required(),
  mainCategoryId: Yup.number(),
});

// const FILE_SIZE = 160 * 1024;
// const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
// .test("fileSize", "Dosya boyutu çok büyük", (value) => value && value.size <= FILE_SIZE)
// .test("fileFormat", "Desteklenmeyen format", (value) => value && SUPPORTED_FORMATS.includes(value.type)),

export const ProductImagesSchema = Yup.object().shape({
  productId: Yup.string().required(),
  imageUrl: Yup.string().required(),
  file: Yup.mixed().required(),
});

export const ProductSchema = Yup.object().shape({
  name: Yup.string().required(),
  url: Yup.string().required(),
  description: Yup.string().required(),
  price: Yup.string().required(),
  quantity: Yup.string().required(),
  imageUrl: Yup.string().required(),
  categoryId: Yup.number().required(),
});

export const CheckoutSchema = Yup.object().shape({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  phoneNumber: Yup.string().required(),
  email: Yup.string().required().email(),
  addressLine1: Yup.string().required(),
  country: Yup.string().required(),
  city: Yup.string().required(),
  zipCode: Yup.number().required(),
  description: Yup.string().required(),
  cardName: Yup.string().required(),
  cardNumber: Yup.string().required(),
  cardMonth: Yup.string().required(),
  cardYear: Yup.string().required(),
  cardCvc: Yup.string().required(),
});

export const RatingSchema = Yup.object().shape({
  productId: Yup.number().required(),
  orderId: Yup.number().required(),
  description: Yup.string().required().max(255),
  rating: Yup.number().required().min(1).max(5),
});
