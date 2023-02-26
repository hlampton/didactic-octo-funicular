const jwt = require("jsonwebtoken");

const secret = "mysecretstar";
const expiration = "2h";

const getToken = (req) => {
  let token = req.body.token || req.query.token || req.headers.authorization;
  if (req.headers.authorization) {
    token = token.split(" ").pop().trim();
  }
  return token;
};

const authMiddleware = ({ req }) => {
  const token = getToken(req);
  if (!token) {
    return req;
  }
  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    const user = data;
    return { user };
  } catch {
    console.log("Invalid token");
  }
  return req;
};

const signToken = ({ username, email, _id }) => {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

module.exports = { authMiddleware, signToken };
