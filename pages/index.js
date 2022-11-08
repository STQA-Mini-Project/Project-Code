import Style from "../styles/Home.module.scss";
import Link from "next/link";
import { useState, useEffect } from "react";


import Navbar from "../components/navbar/Navbar";
import { useRouter } from "next/router";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import Modal from "../components/Modal/Modal";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Home() {
	// const [challenges, setChallenges] = useState(challengesData);
	const router = useRouter();

	const [user, loading, error] = useAuthState(auth);

	const [showModal, setShowModal] = useState(false);
	const [login, setLogin] = useState(false);

	const [challenges, setChallenges] = useState([]);

	const handleMake = () => {
		if (!user) {
			router.push(`/make`);
		} else {
			router.push(`/make`);
		}
	};

	const handleViewAll = () => {
		if (!user) {
			setShowModal(true);
		} else {
			router.push(`/challenges`);
		}
	};

	useEffect(() => {
		getFeaturedChallenges();
	}),
		[];

	const getFeaturedChallenges = async () => {
		const q = query(
			collection(db, "challenges"),
			where("featured", "==", true)
		);

		const querySnapShot = await getDocs(q);

		const featuredChallenges = querySnapShot.docs.map((doc) => {
			return doc.data();
		});
		setChallenges(featuredChallenges);
	};

	return (
		<div className={Style.App}>
			<Navbar setShowModal={setShowModal} setLogin={setLogin} />
			<Modal
				onClose={() => setShowModal(false)}
				show={showModal}
				login={login}
			/>
			{
				// console.log("modal", showModal)
			}
			<div className={Style.container}>
				<div className={Style.intro}>
					<h1>Challenge based health and wellness program</h1>
				</div>
				<div className={Style["challenge-container"]}>
					<div className={Style["challenge-heading"]}>
						<h3>Featured Challenges</h3>
						<div>
							{/* <Link href="/challenges"> */}
							<button onClick={handleViewAll}>
								<span>View All</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									// class="ai ai-ArrowRight"
								>
									<path d="M4 12h16" />
									<path d="M13 5l7 7-7 7" />
								</svg>
							</button>
							{/* </Link> */}
						</div>
					</div>

					<div className={Style["challenges"]}>
						{challenges.map((c) => (
							<>
								{c.featured && (
									<div className={Style.challenge} key={c.id}>
										<h2>{c.title}</h2>
										<p>{c.description}</p>
										<Link href={`/challenges/${c.id}`}>
											<button>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="20"
													height="20"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
													// class="ai ai-Info"
												>
													<circle cx="12" cy="12" r="10" />
													<path d="M12 7h.01" />
													<path d="M10 11h2v5" />
													<path d="M10 16h4" />
												</svg>
												<span>Learn more</span>
											</button>
										</Link>
									</div>
								)}
							</>
						))}
					</div>
				</div>
				<div className={Style["make-challenges"]}>
					{/* <div></div> */}
					<div className={Style.make}>
						<h3>Create you own challenge</h3>
						<button onClick={handleMake}>create</button>
					</div>
				</div>
			</div>
			<footer>
				<div className={Style.about}>
					<h3 className={Style.logo}>JOLLY</h3>
					<div className={Style.desc}>
						Challenge based health and wellness program. Made by{" "}
						<a
							href="http://www.mnsh.me"
							target="_blank"
							rel="noopener noreferrer"
						>
							Manish
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
}
