const {badRequest} = require("../error/ApiError");

class userController {
  async login(req, res) {}
  async registration(req, res) {}

  async auth(req, res, next) {
    const {id} = req.query
    if (!id) {
      return  next(badRequest('no ID'))
    }
    res.json({id: id})
  }
}

module.exports = new userController()