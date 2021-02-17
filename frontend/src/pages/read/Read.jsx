import React, { Component } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import "./index.scss";

import { IoLogoTwitter, IoLogoLinkedin, IoLogoFacebook } from "react-icons/io";
import { IoBookmarkOutline } from "react-icons/io5";
import Reactions from "../../components/Reactions/Reactions";
import { getArticleById } from "../../api/article";
import {
	publishReview,
	getReviewsForArticle,
	removeReview,
} from "../../api/review";
import CommentList from "../../components/CommentList/CommentList";
import { postClaps } from "../../api/claps";
import { getLocalStorage } from "../../helpers/localStorage";
class Read extends Component {
	//CLASS SET UP
	constructor(props) {
		super(props);
		this.articleId = this.props.match.params.slug;
		this.state = {
			reviewSize: 0,
			review: { text: "", user: "orhanors" },
			reviewList: [],
			article: {},
			clapSize: 0,
		};
	}

	componentDidMount() {
		this.getArticle();
		this.getReviews();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.reviewSize !== prevState.reviewSize) {
			console.log("its running");
			this.getReviews();
		}
	}

	// HANDLE ARTICLE PROCESSES
	getArticle = async () => {
		const article = await getArticleById(this.articleId);

		this.setState({ article: article.data });
	};

	// HANDLE REVIEW PROCESSES
	getReviews = async () => {
		const result = await getReviewsForArticle(this.articleId);
		this.setState({
			reviewList: result.data.reviews.reverse(),
			clapSize: result?.data?.claps?.length || 0,
		});
	};
	deleteReview = async (e) => {
		const reviewId = e.target.id;
		const result = await removeReview(this.articleId, reviewId);
		if (result?.success) {
			const reviewList = [...this.state.reviewList];
			const newReviewList = reviewList.filter(
				(review) => review._id !== reviewId
			);
			this.setState({ reviewList: newReviewList });
		}
	};

	handleReviewChange = (e) => {
		const newReview = { ...this.state.review };
		newReview.text = e.target.value;
		this.setState({ review: newReview });
	};

	handleReviewSubmit = async () => {
		const result = await publishReview(this.articleId, this.state.review);
		if (result?.success) {
			const newReview = { ...this.state.review };
			newReview.text = "";
			this.setState({
				review: newReview,
				reviewSize: this.state.reviewSize + 1,
			});
		}
	};

	// HADLE REACTIONS
	handleClap = async (e) => {
		const userId = getLocalStorage("user")._id;
		const result = await postClaps(this.articleId, userId);
		console.log("clap result", result);
		this.setState({ clapSize: this.state.clapSize + 1 });
	};

	// VIEWS
	showReviewList = () => {
		const { reviewList } = this.state;
		return (
			<div>
				{reviewList.length > 0 &&
					reviewList.map((review) => {
						return (
							<CommentList
								deleteReview={this.deleteReview}
								key={review._id}
								comment={review}
							/>
						);
					})}
			</div>
		);
	};
	render() {
		const { article, reviewList } = this.state;
		return (
			<Container className='article-container'>
				<h1>{article?.headLine}</h1>
				<Row style={{ marginTop: 20, marginBottom: 20 }}>
					<Col xs={1}>
						<Image
							style={{ width: 50, height: 50 }}
							src={this.state.article?.author?.img}
							roundedCircle
						/>
					</Col>
					<Col>
						{article?.author?.name}
						<p>Sep 23, 2018 · 3 min read</p>
					</Col>
					<Col>
						<div
							style={{
								fontSize: 24,
								display: "flex",
								alignItems: "center",
								justifyContent: "flex-end",
							}}>
							<IoLogoTwitter />
							<IoLogoLinkedin />
							<IoLogoFacebook />
							<IoBookmarkOutline />
						</div>
					</Col>
				</Row>
				<p>{article?.content}</p>

				<Reactions
					handleClap={this.handleClap}
					info={{
						textValue: this.state.review.text,

						reviewSize: this.state.reviewList.length,
						articleId: this.articleId,
						claps: this.state.article?.claps,
					}}
					handleReviewSubmit={this.handleReviewSubmit}
					handleReviewChange={this.handleReviewChange}
				/>

				{reviewList && reviewList.length > 0 && (
					<div>{this.showReviewList()}</div>
				)}
			</Container>
		);
	}
}

export default withRouter(Read);
