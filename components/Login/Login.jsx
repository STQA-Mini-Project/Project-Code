import { useState, useEffect } from "react";
import Style from "./Login.module.scss";
// import { Link, useNavigate } from "react-router-dom";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

import { auth, logInWithEmailAndPassword } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

// import auth from "./firebase"
import GoogleLogin from "../GoogleLogin/GoogleLogin";

function Login({setCloseModal}) {
	const [passwordShown, setPasswordShown] = useState(false);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [user, loading, error] = useAuthState(auth);
	const router = useRouter();

	const togglePassword = () => {
		setPasswordShown(!passwordShown);
	};

	useEffect(() => {
		if (loading) {
			console.log("loading....");
			return;
		}
		if (user) setCloseModal(true);
	}, [user, loading]);

	const handleLogin = (e) => {
		e.preventDefault();
		console.log(email);
		console.log(password);
		logInWithEmailAndPassword(email, password);
		setCloseModal(true);
	};

	return (
		<div className={Style.container}>

			<div className={Style.formContainer}>
				
				<h1>Log In</h1>
				<GoogleLogin />
				<div className={Style.divider}>
					<span className={Style.line}></span>
					<span className={Style.text}>or</span>
					<span className={Style.line}></span>
				</div>
				<form onSubmit={handleLogin}>
					<div className={Style.formField}>
						<label htmlFor="email">Email</label>
						<input
							type="email"
							placeholder="Email"
							required
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className={Style.formField}>
						<label htmlFor="username">Password</label>
						<input
							type={passwordShown ? "text" : "password"}
							placeholder="Password"
							required
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<div className={Style.checkbox}>
						<input
							type="checkbox"
							name="Show password"
							id="check"
							onClick={togglePassword}
						/>
						<label htmlFor="check" style={{ margin: ".7rem" }}>
							Show password
						</label>
					</div>
					<button type="submit" className={Style.submitBtn}>
						Log in
					</button>
				</form>
				{/* <div className={Style.linkto}>
					Need an account? <Link href="/signup">Sign up</Link>
				</div> */}
			</div>
		</div>
	);
}

export default Login;
