import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

// import { challengeData } from "../../challengeData";
import Navbar from "../../components/navbar/Navbar";
import Style from "../../styles/challenge.module.scss";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import Modal from "../../components/Modal/Modal";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	onSnapshot,
	query,
	setDoc,
	where,
} from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";

const ChallengeName = () => {
	const router = useRouter();
	const { challenge } = router.query;

	const [currentChallenge, setCurrentChallenge] = useState(null);
	const [user, loading, error] = useAuthState(auth);

	const [joined, setJoined] = useState(false);

	const [showModal, setShowModal] = useState(false);
	const [login, setLogin] = useState(false);

	useEffect(() => {
		// const current = challengeData.find((c) => c.id === challenge);
		// setCurrentChallenge(current);
		if (challenge) {
			getChallenge();
		}

		// getChallenge();
		// console.log(challenge);
	}, [challenge]);

	useEffect(() => {
		if (user) {
			getUserChallenges();
		}
	}, [user]);

	const handleClick = () => {
		if (user) {
			//add current challenge to user's challenges
			setDoc(
				doc(db, `users/${user.uid}/challenges`, currentChallenge.id),
				currentChallenge
			);

			toast.success("Challenge added to your account!");
			setJoined(true);
			// getUserChallenges()
		} else {
			setShowModal(true);
		}
	};

	const getUserChallenges = async () => {
		// const userChallenges = await getDocs(
		// 	collection(db, `users/${user.uid}/challenges`)
		// );

		onSnapshot(collection(db, `users/${user.uid}/challenges`), (snapshot) => {
			const data = snapshot.docs.map((doc) => doc.data());

			const joined = data.find((c) => c.id === challenge);
			setJoined(joined);

			if (joined) {
				setCurrentChallenge(joined);
			}

			// console.log(joined)
			
		});

		// const uC = userChallenges.docs.map((d) => d.data());
		// console.log(uC[0]);

		// check if user has joined this challenge
		// const joined = userChallenges.docs.some((d) => d.data().id === challenge);

		setJoined(joined);
		// if (joined) {
		// 	setCurrentChallenge(uC[0]);
		// }
	};

	const getChallenge = async () => {
		if (!joined) {
			getDoc(doc(db, `challenges/${challenge}`))
				.then((doc) => {
					setCurrentChallenge(doc.data());
					// console.log(doc.data());
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	const handleDayClick = (day) => {
		if (!joined) {
			toast.error("Please join the challenge first!");
		} else {
			console.log(currentChallenge);
			const index = day === 0 ? 0 : day - 1;
			// update the user's challenge progress
			setDoc(doc(db, `users/${user.uid}/challenges/${challenge}`), {
				...currentChallenge,
				days: [
					...currentChallenge.days.slice(0, index),
					{
						...currentChallenge.days[index],
						isDone: true,
					},
					...currentChallenge.days.slice(index + 1),
				],
			});
			toast.success("Day marked as done!");
		}
	};

	return (
		<>
			<Toaster />
			{currentChallenge && (
				<div className={Style.container}>
					<Navbar setShowModal={setShowModal} setLogin={setLogin} />
					<Modal
						onClose={() => setShowModal(false)}
						show={showModal}
						login={login}
					/>

					<div className={Style.challenge}>
						{/* {console.log(currentChallenge)} */}
						{user && (
							<div className={Style.crumb}>
								<Link href="/challenges">
									<a>Challenges</a>
								</Link>
								<span> / </span>
								<span>{currentChallenge.title}</span>
							</div>
						)}

						<h1>{currentChallenge.title}</h1>
						<p>{currentChallenge.description}</p>
						<button
							onClick={handleClick}
							style={{
								backgroundColor: joined ? "#a6ff00" : "#ffffff",
							}}
						>
							{joined ? "Joined Challenge" : "Join Challenge"}
						</button>
						<div className={Style.days}>
							{currentChallenge.days.map((day) => {
								return (
									<button
										className={day.isDone ? Style.dayDone : Style.day}
										key={day.day}
										onClick={() => handleDayClick(day.day)}
										style={{
											backgroundColor: day.isDone ? "#a6ff00" : "#ffffff",
										}}
									>
										<p>Day {day.day}</p>
									</button>
								);
							})}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ChallengeName;
