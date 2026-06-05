const jwt = require("jsonwebtoken");
const prisma = require("../config/db").prisma;

// read the token from the request
// check if token is valid
const authMiddleware = async (req, res, next) => {
  console.log("authMiddleware called");
  // check if the token is present in the header or in the cookies
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {        
        return res.status(401).json({ message: "Unauthorized: User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("Error in authMiddleware:", err);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }     
};

exports.authMiddleware = authMiddleware;
