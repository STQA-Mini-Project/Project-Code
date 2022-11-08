import Style from "./Signup.module.scss";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { auth, registerWithEmailAndPassword } from "../../firebase";


import GoogleLogin from "../GoogleLogin/GoogleLogin";
import toast, { Toaster } from "react-hot-toast";

function SignUp() {
	const [passwordShown, setPasswordShown] = useState(false);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");

	const [user, loading, error] = useAuthState(auth);
	const router = useRouter();

	const togglePassword = () => {
		setPasswordShown(!passwordShown);
	};

	const handleSignup = (e) => {
		e.preventDefault();
		if (!name) toast.error("Please enter a name");
		else {
			registerWithEmailAndPassword(name, email, password);
			
		}
	};

	useEffect(() => {
		if (loading) return;
		// if (user) router.push("/");
	}, [user, loading]);

	return (
		<div className={Style.container}>
			{/* <Navbar /> */}
			{/* <div className={Style.bg}>Photoboard</div> */}
			<div className={Style.formContainer}>
				<Toaster
					// position="top-right"
					reverseOrder={false}
				/>
				{/* <Link to="/">
					<div className={Style.home}>Home</div>
				</Link> */}
				<h1>Sign Up</h1>
				<GoogleLogin />
				<div className={Style.divider}>
					<span className={Style.line}></span>
					<span className={Style.text}>or</span>
					<span className={Style.line}></span>
				</div>
				<form onSubmit={handleSignup}>
					<div className={Style.formField}>
						<label htmlFor="username">Username</label>
						<input
							type="text"
							placeholder="Username"
							required
							onChange={(e) => setName(e.target.value)}
							value={name}
						/>
					</div>
					<div className={Style.formField}>
						<label htmlFor="email">Email</label>
						<input
							type="email"
							placeholder="Email"
							required
							onChange={(e) => setEmail(e.target.value)}
							value={email}
						/>
					</div>
					<div className={Style.formField}>
						<label htmlFor="username">Password</label>
						<input
							type={passwordShown ? "text" : "password"}
							placeholder="Password"
							required
							onChange={(e) => setPassword(e.target.value)}
							value={password}
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
					<button
						type="submit"
						onClick={handleSignup}
						className={Style.submitBtn}
					>
						Continue
					</button>
				</form>
				{/* <div className={Style.linkto}>
					Already have an account? <Link href="/login">Log in</Link>
				</div> */}
			</div>
		</div>
	);
}

export default SignUp;
