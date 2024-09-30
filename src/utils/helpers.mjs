import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  console.log("SALT: ", salt);
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = (plain, hashed) => {
  return bcrypt.compareSync(plain, hashed);
};
