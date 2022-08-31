import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    /*
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, 'F501DEHKLM');
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
  */
  const token = req.cookies.jwt;

  if(token) {
    jwt.verify(token, 'F501DEHKLM', (err, decodedToken) => {
        if(err) {
            console.log(err.message);
        } else {
            console.log(decodedToken);
            next();
        }
    })
  }
};

//module.exports = verifyToken;
export default verifyToken;