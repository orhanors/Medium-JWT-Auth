const {
	articlePostController,
	articleGetController,
	articleGetByIdController,
	articleDeleteController,
	articlePutController,
	articleGetByAuthorIdController,
} = require("../controller/articleController");

const {
	articleReviewGetController,
	articleReviewGetByIdController,
	articleReviewPostController,
	articleReviewPutController,
	articleReviewDeleteController,
	articleClapsController,
} = require("../controller/articleReactionsController");
const {
	articleBodyValidator,
	validatorResult,
	reviewBodyValidator,
} = require("../middlewares/validator");

const articleRouter = require("express").Router();

// *** ARTICLE ***
articleRouter.get("/", articleGetController);
articleRouter.get("/:articleId", articleGetByIdController);
articleRouter.post(
	"/",
	articleBodyValidator,
	validatorResult,
	articlePostController
);
articleRouter.put("/", articlePutController);
articleRouter.delete("/", articleDeleteController);

// *** EMBEDDED REVİEWS ***

//returns all the reviews for the specified article
articleRouter.get("/:articleId/reviews", articleReviewGetController);

//returns a single review for the specified article
articleRouter.get(
	"/:articleId/reviews/:reviewId",
	articleReviewGetByIdController
);
//returns the spesific author's articles
articleRouter.get("/user/:authorId", articleGetByAuthorIdController);
//adds a new review for the specified article
articleRouter.post(
	"/:articleId",
	reviewBodyValidator,
	validatorResult,
	articleReviewPostController
);

//edit the review belonging to the specified article
articleRouter.put(
	"/:articleId/reviews/:reviewId",
	reviewBodyValidator,
	validatorResult,
	articleReviewPutController
);

//delete the review belonging to the specified article
articleRouter.delete(
	"/:articleId/reviews/:reviewId",
	articleReviewDeleteController
);

// CLAPS
articleRouter.post("/:articleId/claps/:authorId", articleClapsController);
module.exports = articleRouter;
