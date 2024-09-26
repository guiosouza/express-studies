export const createUserValidationSchema = {
  title: {
    isLength: {
      options: {
        min: 3,
        max: 32,
      },
      errorMessage: "Title must be at least 3 with the max of 32 characters",
    },
    notEmpty: {
      errorMessage: "Title can not be empty",
    },
    isString: {
      errorMessage: "Title must be a string",
    },
  },
  description: {
    notEmpty: true,
  },
};
