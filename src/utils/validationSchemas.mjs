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

export const createUserValidationSchema = {
  name: {
    isLength: {
      options: { min: 3, max: 32 },
      errorMessage: "Name must be between 3 and 32 characters",
    },
    notEmpty: {
      errorMessage: "Name cannot be empty",
    },
    isString: {
      errorMessage: "Name must be a string",
    },
  },
  displayName: {
    isLength: {
      options: { min: 3, max: 32 },
      errorMessage: "Display name must be between 3 and 32 characters",
    },
    notEmpty: {
      errorMessage: "Display name cannot be empty",
    },
    isString: {
      errorMessage: "Display name must be a string",
    },
  },
  password: {
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
    notEmpty: {
      errorMessage: "Password cannot be empty",
    },
  },
};

export const updateUserValidationSchema = {
  name: {
    optional: true,
    isLength: {
      options: { min: 3, max: 32 },
      errorMessage: "Name must be between 3 and 32 characters",
    },
    isString: {
      errorMessage: "Name must be a string",
    },
  },
  displayName: {
    optional: true,
    isLength: {
      options: { min: 3, max: 32 },
      errorMessage: "Display name must be between 3 and 32 characters",
    },
    isString: {
      errorMessage: "Display name must be a string",
    },
  },
  password: {
    optional: true,
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
  },
};


