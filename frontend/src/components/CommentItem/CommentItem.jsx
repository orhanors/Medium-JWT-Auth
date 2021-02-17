import React from "react";
import "./styles.scss";

import { BsThreeDots } from "react-icons/bs";

import { Dropdown, DropdownButton, ButtonGroup } from "react-bootstrap";
import AreYouSureModal from "../AreYouSureModal/AreYouSureModal";
function CommentItem(props) {
	const [showModal, setShowModal] = React.useState(false);
	return (
		<div className='comment-container mb-3'>
			<AreYouSureModal
				comment={props.comment}
				deleteReview={props.deleteReview}
				info={{
					title: "Delete",
					body: "Deleted responses are gone forever.Are you sure?",
				}}
				show={showModal}
				onHide={() => setShowModal(false)}
			/>
			<div className='comment-header d-flex justify-content-between'>
				<div className='user-info-container d-flex flex-row'>
					<img
						src='https://cactusthemes.com/blog/wp-content/uploads/2018/01/tt_avatar_small.jpg'
						alt='user-avatar'
						style={{
							width: 40,
							height: 40,
							borderRadius: "50%",
						}}
					/>
					<div className='d-flex flex-column ml-2'>
						<h5 className='mb-0'>{props.comment.user}</h5>
						<p>2 days ago</p>
					</div>
				</div>

				<div className=''>
					<DropdownButton
						as={ButtonGroup}
						id={`dropdown-variants-secondary`}
						title={<BsThreeDots />}>
						<Dropdown.Item>Edit</Dropdown.Item>
						<Dropdown.Item onClick={() => setShowModal(true)}>
							Delete
						</Dropdown.Item>
					</DropdownButton>
				</div>
			</div>

			<div className='content'>{props.comment.text}</div>
		</div>
	);
}

export default CommentItem;
