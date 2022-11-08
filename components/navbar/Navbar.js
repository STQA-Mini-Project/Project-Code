import Style from "./Navbar.module.scss";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { logout } from "../../firebase";

const Navbar = ({ setShowModal, setLogin }) => {
	const [user, loading, error] = useAuthState(auth);

	const [dropdownActive, setDropdownActive] = useState(false);
	const dropDownRef = useRef();

	useEffect(() => {
		const checkIfClickedOutside = (e) => {
			if (
				dropdownActive &&
				dropDownRef.current &&
				!dropDownRef.current.contains(e.target)
			) {
				setDropdownActive(false);
			}
		};

		document.addEventListener("mousedown", checkIfClickedOutside);

		return () => {
			document.removeEventListener("mousedown", checkIfClickedOutside);
		};
	}, [dropdownActive]);

	return (
		<nav className={Style.container}>
			{/* {console.log(user)} */}
			<div className={Style.navContent}>
				<div className={Style.logo}>
					<Link href="/">
						<h1>Jolly</h1>
					</Link>
				</div>
				{user ? (
					<div className={Style["nav-right"]}>
						{/* <button>Sign up</button>
						<button>Log in</button> */}
						{/* <button>Create a challenge</button> */}
						<Link href="/make">Create</Link>
						<Link href="/challenges">Challenges</Link>
						<div className={Style["profile-right"]}>
							<div ref={dropDownRef}>
								<img
									className={Style.profile}
									src={`https://source.boringavatars.com/beam/120/${user?.displayName}?colors=31f2cc,1a2b3b,F23157`}
									alt="User avatar"
									onClick={() => setDropdownActive(!dropdownActive)}
								></img>
								<div
									className={
										dropdownActive
											? `${Style["dropdownWrapper"]} 
						${Style.active}
						`
											: `${Style["dropdownWrapper"]} `
									}
									id="dropdownWrapper"
									style={{ width: "max-content" }}
								>
									<div className={Style["dropdown-profile-details"]}>
										<span className={Style["dropdown-profile-details--name"]}>
											{user?.displayName}
										</span>
										<span className={Style["dropdown-profile-details--email"]}>
											{user?.email}
										</span>
									</div>
									<div className={Style["dropdown-links"]}>
										<button onClick={logout}>Sign out</button>
									</div>
								</div>
							</div>
						</div>
						{/* <button onClick={logout}>Log out</button> */}
					</div>
				) : (
					<div className={Style["nav-right"]}>
						{/* <Link href="/login"> */}
						<button
							onClick={() => {
								setShowModal(true);
								setLogin(true);
							}}
						>
							Log in
						</button>
						{/* </Link> */}
						{/* <Link href="/signup"> */}
						<button
							onClick={() => {
								setShowModal(true);
								setLogin(false);
							}}
							style={{
								backgroundColor: "#a6ff00",
							}}
						>
							Sign up
						</button>
						{/* </Link> */}
					</div>
				)}
				{/* <div className={Style.profile}>Manish</div> */}
			</div>
		</nav>
	);
};

export default Navbar;
