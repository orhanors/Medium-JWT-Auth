import React from "react";
import CommentItem from "../CommentItem/CommentItem";

function CommentList(props) {
	return (
		<div>
			<CommentItem
				deleteReview={props.deleteReview}
				comment={props.comment}
			/>
		</div>
	);
}

export default CommentList;
