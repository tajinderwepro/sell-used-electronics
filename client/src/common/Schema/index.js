import * as Yup from 'yup';

export const CreateuserSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .required("Phone number is required"),
    // .matches(/^\d{10}$/, "Phone number must be 10 digits"),
  password_hash: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .when('isCreate', {
      is: true,
      then: (schema) => schema.required("Password is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password_hash'), null], "Passwords must match")
    .when('isCreate', {
      is: true,
      then: (schema) => schema.required("Confirm password is required"),
    }),
  role: Yup.string().oneOf(["admin", "user"]).required("Role is required"),
});
export const EditUserSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .required("Phone number is required"),
    // .matches(/^\d{10}$/, "Phone number must be 10 digits"),
  role: Yup.string().oneOf(["admin", "user"]).required("Role is required"),
});

export const deviceSchema = Yup.object().shape({
  category: Yup.string().required("Category is required"),
  brand: Yup.string().required("Brand is required"),
  model: Yup.string().required("Model is required"),
  condition: Yup.string().oneOf(["good", "bad", "excellent","fair"]).required("Condition is required"),
  base_price: Yup.string()
    .required("Base price is required")
    .test(
      "is-greater-than-zero",
      "Base price must be greater than zero",
      (value) => parseFloat((value || "").replace(/[^\d]/g, "")) > 0
    ),
  ebay_avg_price: Yup.string().required("eBay average price is required"),
});

export const quoteSchema = Yup.object().shape({
  category: Yup.string().required("Category is required"),
  brand: Yup.string().required("Brand is required"),
  model: Yup.string().required("Model is required"),
  condition: Yup.string().oneOf(["good", "bad", "excellent","fair"]).required("Condition is required"),
  offered_price: Yup.string()
    .required("Base price is required")
    .test(
      "is-greater-than-zero",
      "Base price must be greater than zero",
      (value) => parseFloat((value || "").replace(/[^\d]/g, "")) > 0
    ),
});

export const QuoteFormSchema = Yup.object().shape({
  base_price: Yup.string()
    .required("Base price is required")
    .test(
      "is-greater-than-zero",
      "Base price must be greater than zero",
      (value) => parseFloat((value || "").replace(/[^\d]/g, "")) > 0
    ),
   
});


export const CustomStorageSchema = Yup.object().shape({
  ram: Yup.string()
    .required("RAM is required"),
   
  rom: Yup.string()
    .required("ROM is required")
    
});


export const categorySchema = Yup.object().shape({
  name: Yup.string().trim().required("Category name is required"),
  image: Yup.mixed().required("Image is required"),
});

export const brandsSchema = Yup.object().shape({
  name: Yup.string().trim().required("Category name is required"),
  image: Yup.mixed().required("Image is required"),
});