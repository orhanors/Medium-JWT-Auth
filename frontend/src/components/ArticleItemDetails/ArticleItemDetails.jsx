import React from "react";
import { getLocalStorage } from "../../helpers/localStorage";
import "./styles.scss";
class ArticleItemDetails extends React.Component {
	authorFullName = () => {
		return (
			this.props.article.author.name +
			" " +
			this.props.article.author.surname
		);
	};
	render() {
		return (
			<div className={"pr-3"}>
				<div className={"d-flex align-center mb-2"}>
					<img
						alt='cover'
						style={{ width: "20px", height: "20px" }}
						src={this.props.article.cover}
					/>

					<span className={"author"}>
						<a href='/'>
							<b>{this.authorFullName()} </b> in{" "}
							<b>Better Advice</b>
						</a>
					</span>
				</div>
				<a href='/'>
					<span
						className={"heading"}
						style={{
							fontSize:
								this.props.headingFont === "small"
									? "16px"
									: "22px",
							lineHeight:
								this.props.headingFont === "small"
									? "20px"
									: "28px",
						}}>
						{this.props.article.headLine}
					</span>
				</a>

				{this.props.subheading && (
					<div className={"subheading"}>
						<p>
							<a href='/'>{this.props.article.subHead}</a>
						</p>
					</div>
				)}
				<div className={"d-flex align-baseline justify-between mt-2"}>
					<h4 className={"date"}>
						<div className={"d-flex"}>
							<span>Oct 16, 2020</span>
							<div>
								<span>
									<span>·</span>
								</span>
							</div>

							<span>
								<span>4 min read</span>
							</span>
						</div>
					</h4>
				</div>
			</div>
		);
	}
}

export default ArticleItemDetails;
