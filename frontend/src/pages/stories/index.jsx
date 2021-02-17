import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { getArticlesByAuthorId } from "../../api/article";
import ArticleListItem from "../../components/ArticleListItem/ArticleListItem";
import { Link } from "react-router-dom";
import { getLocalStorage } from "../../helpers/localStorage";

const Stories = () => {
	const [articles, setArticles] = useState([]);

	useEffect(() => {
		getArticles();
	}, []);

	const getArticles = async () => {
		const userId = getLocalStorage("user")._id;
		const result = await getArticlesByAuthorId(userId);
		console.log("resss", result);
		setArticles(result?.data.reverse());
	};

	const showArticles = () => {
		return (
			<div>
				{articles?.map((article, index) => {
					return (
						<Link to={`/read/${article._id}`}>
							<ArticleListItem
								key={index}
								articleImg={"left"}
								headingFont={"small"}
								article={article || {}}
							/>
						</Link>
					);
				})}
			</div>
		);
	};
	{
		return <Container>{showArticles()}</Container>;
	}
};

export default Stories;
