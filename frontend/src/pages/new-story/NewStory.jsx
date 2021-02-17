import React, { Component } from "react";
import ReactQuill from "react-quill";
import { Container } from "react-bootstrap";
import "react-quill/dist/quill.bubble.css";
import { Button } from "react-bootstrap";
import "./styles.scss";
import CategoryPicker from "../../components/CategoryPicker";
import { publishArticle } from "../../api/article";
import { showsuccessMessage, showErrorMessage } from "../../helpers/messages";
import { getLocalStorage } from "../../helpers/localStorage";

export default class NewStory extends Component {
	state = {
		errorMsg: null,
		showSuccessMsg: false,
		article: {
			headLine: "",
			content: "",
			category: { name: "", img: "" },
			author: getLocalStorage("user")._id,
			cover: "",
		},
	};

	editor = React.createRef();

	handleSubmit = async () => {
		const result = await publishArticle(this.state.article);
		if (result.success) {
			this.setState({
				showSuccessMsg: true,
				errorMsg: null,
				article: {
					headLine: "",
					content: "",
					category: { name: "", img: "" },
					author: getLocalStorage("user")._id,
					cover: "",
				},
			});

			this.props.history.push("/stories");
		} else {
			this.setState({ errorMsg: result.errors, showSuccessMsg: false });
		}
	};

	onChange = (e) => {
		const currentId = e.target.id;
		if (currentId == "category" || currentId == "content") return;
		const newArticle = { ...this.state.article };
		newArticle[currentId] = e.target.value;

		this.setState({ article: newArticle, errorMsg: "" });
	};
	onKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			this.editor && this.editor.current.focus();
		}
	};
	handleCategoryChange = (topic) => {
		const newArticle = { ...this.state.article };
		newArticle.category = topic;
		this.setState({ article: newArticle, errorMsg: "" });
	};

	handleContentChange = (text) => {
		const newArticle = { ...this.state.article };
		newArticle.content = text;
		this.setState({ article: newArticle, errorMsg: "" });
	};
	render() {
		const { headLine, content, category, cover } = this.state.article;
		return (
			<Container className='new-story-container' expand='md'>
				<div className='category-container'>
					<CategoryPicker
						id='category'
						onChange={(topic) => this.handleCategoryChange(topic)}
					/>
				</div>
				<input
					id='headLine'
					value={headLine}
					onChange={this.onChange}
					onKeyDown={this.onKeyDown}
					placeholder='Title'
					className='article-title-input'
				/>

				<ReactQuill
					modules={NewStory.modules}
					formats={NewStory.formats}
					ref={this.editor}
					theme='bubble'
					value={content}
					id='content'
					onChange={this.handleContentChange}
					placeholder='Tell your story...'
				/>
				<input
					id='cover'
					onChange={this.onChange}
					value={cover}
					onKeyDown={this.onKeyDown}
					placeholder='Cover link e.g : https://picsum.photos/800'
					className='article-cover-input'
				/>
				{this.state.showSuccessMsg &&
					showsuccessMessage("Successfuly created")}

				{this.state.errorMsg && showErrorMessage(this.state.errorMsg)}
				<Button
					onClick={this.handleSubmit}
					variant='success'
					className='post-btn'>
					Post
				</Button>
			</Container>
		);
	}
}

NewStory.modules = {
	toolbar: [
		[{ header: "1" }, { header: "2" }],

		["bold", "italic", "blockquote"],
		[
			{ align: "" },
			{ align: "center" },
			{ align: "right" },
			{ align: "justify" },
		],

		["link", "image"],

		["clean"],
	],
	clipboard: {
		// toggle to add extra line breaks when pasting HTML:
		matchVisual: false,
	},
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
NewStory.formats = [
	"header",
	"bold",
	"italic",
	"blockquote",
	"align",

	"link",
	"image",
];
