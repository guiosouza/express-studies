export const createExerciseValidationSchema = {
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

export const updateExerciseValidationSchema = {
  title: {
    optional: true,  // Permite que o campo seja opcional no PATCH
    isLength: {
      options: {
        min: 3,
        max: 32,
      },
      errorMessage: "Title must be at least 3 with the max of 32 characters",
    },
    isString: {
      errorMessage: "Title must be a string",
    },
  },
  description: {
    optional: true,  // Permite que o campo seja opcional no PATCH
    notEmpty: true,
  },
};

