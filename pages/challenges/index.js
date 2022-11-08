import Style from "../../styles/challenges.module.scss";

import Navbar from "../../components/navbar/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const Challenges = () => {
	const [showModal, setShowModal] = useState(false);

	const[ challenges, setChallenges ] = useState([]);


	useEffect(() => {


		getChallenges();

	}, [])


	const getChallenges = async () => {
		const snapshot = await getDocs(collection(db, "challenges"));
		const data = snapshot.docs.map(doc => doc.data());
		setChallenges(data);
	}

	return (
		<>
			<Navbar setShowModal={setShowModal} />
			{/* {showModal && ( */}
			<Modal onClose={() => setShowModal(false)} show={showModal} />
			{/* )} */}
			<div className={Style.container}>
				<div className={Style["challenges"]}>
					{challenges.map((c) => (
						<div className={Style.challenge} key={c.id}>
							<h3>{c.title}</h3>
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
					))}
				</div>
			</div>
		</>
	);
};

export default Challenges;
