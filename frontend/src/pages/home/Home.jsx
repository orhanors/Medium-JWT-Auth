import React, { Component } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { IoBookmarksOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { getArticles } from "../../api/article";
import ArticleListItem from "../../components/ArticleListItem/ArticleListItem";
import Footer from "../../components/Footer/Footer";
import PeopleList from "../../components/PeopleList/PeopleList";
import TopicsToFollow from "../../components/TopicsToFollow/TopicsToFollow";

import "./styles.scss";

export default class Home extends Component {
	state = {
		articles: [],
	};

	getAllArticles = async () => {
		const result = await getArticles();
		console.log("artt", result.data);
		if (result?.success) {
			this.setState({ articles: result.data });
		}
	};

	componentDidMount() {
		this.getAllArticles();
	}
	render() {
		return (
			<div>
				{this.state.articles.length > 0 && (
					<Container>
						<Row
							className={"row-cols-lg-3 pb-4"}
							style={{
								borderBottom:
									"1px solid rgba(230, 230, 230, 1)",
							}}>
							<Col>
								<Link
									to={`/read/${this.state.articles[0]._id}`}>
									<ArticleListItem
										article={this.state.articles[0]}
										articleImg={"top"}
										headingFont={"large"}
										subheading
									/>
								</Link>
							</Col>

							<Col className={"flex-column w-100"}>
								{this.state.articles
									.slice(1, 5)
									.map((article, index) => (
										<Link to={`/read/${article._id}`}>
											<ArticleListItem
												key={index}
												articleImg={"left"}
												headingFont={"small"}
												article={article}
											/>
										</Link>
									))}
							</Col>

							<Col>
								<PeopleList />
								<TopicsToFollow />
							</Col>
							<Col className={""}>{/*<TagsList />*/}</Col>
						</Row>
						<Row className={"py-4 mt-4"}>
							<Col className={"col-lg-8 pr-5 pl-2"}>
								{this.state.articles.slice(6).map((article) => (
									<Link to={`/read/${article._id}`}>
										<ArticleListItem
											articleImg={"left"}
											headingFont={"large"}
											subheading
											article={article}
										/>
									</Link>
								))}
							</Col>
							<Col className={"col-lg-4 "}>
								<div
									className={"flex-column py-4 px-4 w-100"}
									style={{
										backgroundColor: "rgb(250, 250, 250)",
									}}>
									<div className={"mb-4 title"}>
										{" "}
										<IoBookmarksOutline
											style={{ fontSize: 20 }}
										/>{" "}
										<span className={"ml-2"}>
											READING LIST{" "}
										</span>
									</div>
									{this.state.articles
										.slice(0, 3)
										.map((article) => (
											<ArticleListItem
												headingFont={"small"}
												article={article}
											/>
										))}
								</div>
								<Footer />
							</Col>
						</Row>
					</Container>
				)}
			</div>
		);
	}
}
