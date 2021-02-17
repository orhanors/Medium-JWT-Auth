const authorRouter = require("express").Router();
const {
	authorGetController,
	authorGetByIdController,
	authorPostController,
	authorPutController,
	authorDeleteController,
} = require("../controller/authorController");

authorRouter.get("/", authorGetController);
authorRouter.get("/:authorId", authorGetByIdController);
authorRouter.post("/", authorPostController);
authorRouter.put("/:authorId", authorPutController);
authorRouter.delete("/:authorId", authorDeleteController);

module.exports = authorRouter;
