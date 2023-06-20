const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {
     // verify authentication
     const { authorization } = req.headers;

     // check if authorization header is present
     if (!authorization) {
          return res.status(401).json({ error: "Authorization token required" });
     }

     // extract token from authorization header
     // returns array with token and removes "Bearer" from token
     const token = authorization.split(" ")[1];

     // verify token
     try {
          // verify token with secret
          const { _id } = jwt.verify(token, process.env.TOKEN_SECRET);

          // find usesr with id
          req.user = await User.findOne({ _id }).select("_id");

          // call next middleware
          next();
     } catch (error) {
          console.log(error);
          res.status(401).json({ error: "Request is not authorized" });
     }
};

module.exports = requireAuth;