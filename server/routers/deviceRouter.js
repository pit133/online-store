const Router = require('express');
const router = new Router();
const deviceController = require("../controllers/deviceController");

router.get("/", deviceController.getAll)
router.get("/:id", deviceController.getAll)
router.post("/login", deviceController.getOne)




module.exports = router;