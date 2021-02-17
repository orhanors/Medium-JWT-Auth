import React from "react";
import { Modal } from "react-bootstrap";
import "./styles.scss";
/**
 *
 * Props = {show,onHide,info:{body,title}}
 */

function AreYouSureModal(props) {
	return (
		<Modal
			{...props}
			size='md'
			aria-labelledby='contained-modal-title-vcenter'
			centered>
			<Modal.Body>
				<h4 className='text-center'>{props?.info?.title}</h4>
				<p className='text-center'>{props?.info?.body}</p>
			</Modal.Body>
			<Modal.Footer>
				<button className='btn-close' onClick={props.onHide}>
					Close
				</button>
				<button
					id={props.comment._id}
					onClick={props.deleteReview}
					className='btn-delete'>
					Delete
				</button>
			</Modal.Footer>
		</Modal>
	);
}

export default AreYouSureModal;
