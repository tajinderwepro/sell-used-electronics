import { validate } from 'yup';

 export const validateFormData = async (data, schema, context = {}) => {
  try {
    await schema.validate(data, { abortEarly: false, context });
    return null;
  } catch (error) {
    const errors = {};
    if (error.inner) {
      error.inner.forEach((e) => {
        errors[e.path] = e.message;
      });
    }
    return errors;
  }
};
