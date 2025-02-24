const { JWT_SECRET = "dev-secret" } = process.env;

module.exports = {
  JWT_SECRET,
  // JWT_SECRET: "your_super_secret_key",
};
