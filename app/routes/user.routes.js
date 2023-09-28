const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/test/all",
    (req, res) => {
      controller.allAccess(req,res)
    }
  );

  app.get(
    "/api/test/user",
    (req, res) => {
      authJwt.verifyToken(req,res);
      controller.userBoard(req,res);
    } 
  );
}
