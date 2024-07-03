// import jwt from "jsonwebtoken";
// import jwksClient from "jwks-rsa";

// const verifyToken = (token) => {
//   const client = jwksClient({
//     jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
//   });

//   function getKey(header, callback) {
//     client.getSigningKey(header.kid, function (err, key) {
//       const signingKey = key.publicKey || key.rsaPublicKey;
//       callback(null, signingKey);
//     });
//   }

//   jwt.verify(
//     token,
//     getKey,
//     {
//       audience: process.env.AUDIENCE,
//       issuer: `https://${process.env.AUTH0_DOMAIN}/`,
//       algorithms: ["RS256"],
//     },
//     function (err, decoded) {
//       console.log(decoded); // bar
//     }
//   );
// };

// export default verifyToken;

// import jwt from "jsonwebtoken";
// import jwksClient from "jwks-rsa";

// const verifyToken = (token) => {
//   return new Promise((resolve, reject) => {
//     const client = jwksClient({
//       jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
//     });

//     function getKey(header, callback) {
//       client.getSigningKey(header.kid, (err, key) => {
//         if (err) {
//           return callback(err);
//         }
//         const signingKey = key.publicKey || key.rsaPublicKey;
//         callback(null, signingKey);
//       });
//     }

//     jwt.verify(
//       token,
//       getKey,
//       {
//         audience: process.env.AUDIENCE,
//         issuer: `https://${process.env.AUTH0_DOMAIN}/`,
//         algorithms: ["RS256"],
//       },
//       (err, decoded) => {
//         if (err) {
//           return reject(err);
//         }
//         resolve(decoded);
//       }
//     );
//   });
// };

// export default verifyToken;

import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    const client = jwksClient({
      jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    });

    function getKey(header, callback) {
      console.log("🚀 ~ getKey ~ header:", header);
      client.getSigningKey(header.kid, (err, key) => {
        // console.log("🚀 ~ client.getSigningKey ~ key:", key)
        if (err) {
          return callback(err);
        }
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
      });
    }

    jwt.verify(
      token,
      getKey,
      {
        audience: process.env.AUDIENCE,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        algorithms: ["RS256"],
      },
      (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded);
      }
    );
  });
};

export default verifyToken;

// context: async ({ req}) => {
  // console.log("🚀 ~ context: ~ req:", req?.headers);
  // let isAuthenticated = false;
  // let user = null;
  // let token;
  // try {
  //   token = req?.headers?.authorization || "";
  //   console.log("🚀 ~ token:", token);
  //   if (!token) return new Error("Not authenticated");
  //   const payload = await verifyToken(token);
  //   isAuthenticated = payload ? true : false;
  //   console.log("🚀 ~ context:async ~ payload:", payload);
  // } catch (error) {
  //   console.log("🚀 ~ context: ~ error:", error);
  // }
  // return { ...rest, req, user: { isAuthenticated, token } };
