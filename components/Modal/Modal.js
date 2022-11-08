import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import Style from "./Modal.module.scss";

import Login from "../Login/Login";
import SignUp from "../Signup/Signup";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

function Modal({ show, onClose, children, title, login }) {
	const [user, loading, error] = useAuthState(auth);

	const [isBrowser, setIsBrowser] = useState(false);

	const [closeModal, setCloseModal] = useState(true);

	const modalWrapperRef = useRef();

	useEffect(() => {
		setIsBrowser(true);

		const backDropHandler = (e) => {
			// if (modalWrapperRef?.current?.contains(e.target)) {
			// 	console.log(show)
			// 	// console.log(closeModal)
			// 	console.log("clicked outside");
			// }
			// // console.log(show)

			// close modal if clicked outside of modal
			if (e.target.id === "modal-overlay") {
				onClose();
			}

			// onClose();
		};
		window.addEventListener("click", backDropHandler);
		return () => window.removeEventListener("click", backDropHandler);
	}, []);

	useEffect(() => {
		// if(user) {
		// 	setCloseModal(false);
		// }else{
		// 	setCloseModal(true);
		// }

		onClose();

		// setCloseModal(false);
		// console.log("closeModal", closeModal);
	}, [user]);

	const handleCloseClick = (e) => {
		e.preventDefault();
		onClose();
		setCloseModal(true);
	};

	if (isBrowser) {
		return ReactDOM.createPortal(
			show || !closeModal ? (
				<div className={Style.ModalOverlay} id="modal-overlay">
					<div ref={modalWrapperRef} className={Style.modalWrapper}>
						<div className={Style.Modal}>
							<a href="#" onClick={handleCloseClick}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									// class="ai ai-Cross"
								>
									<path d="M20 20L4 4m16 0L4 20" />
								</svg>
							</a>
							{login ? <Login setCloseModal={setCloseModal} /> : <SignUp />}
						</div>
					</div>
				</div>
			) : null,
			document.getElementById("modal-root")
		);
	} else {
		return null;
	}
}

export default Modal;
