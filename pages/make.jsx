import Navbar from "../components/navbar/Navbar";
import Style from "../styles/make.module.scss";
import Modal from "../components/Modal/Modal";
import { useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

const Make = () => {
	const [showModal, setShowModal] = useState(false);
	const [login, setLogin] = useState(false);

	const [user, loading, error] = useAuthState(auth);

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [rules, setRules] = useState("");
	const [days, setDays] = useState(30);

	useEffect(() => {
		if (user) return;
		if (loading) return;
		if (!user) {
			setShowModal(true);
		}
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (user) {
			console.log(title, description, rules, days);

			//add to database collection name is challenges

      let daysArray = [];
      for (let i = 1; i < days + 1; i++) {
        daysArray.push({
          day: i,
          exercises: [],
          isDone: false,

        });
      }

      console.log(daysArray);


      let id = uuidv4();
			setDoc(doc(db, `challenges`, id), {
				title,
				description,
				rules,
				duration: days,
				createdBy: user.uid,
				featured: false,
        createdAt: new Date(),
        id: id,
        days: daysArray,
			})
				.then(() => {
					setTitle("");
					setDescription("");
					setRules("");
					setDays(30);
					toast.success("Challenge created!");
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			setShowModal(true);
		}
	};

	return (
		<div className={Style.App}>
			<Toaster
				// position="top-right"
				reverseOrder={false}
			/>
			<Navbar setShowModal={setShowModal} setLogin={setLogin} />
			<Modal
				onClose={() => setShowModal(false)}
				show={showModal}
				login={login}
			/>
			<div className={Style.container}>
				{user ? (
					<div className={Style.make}>
						<form onSubmit={handleSubmit}>
							<div className={Style.formField}>
								<label>Title</label>
								<input
									placeholder="Title"
									required
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
								/>
							</div>
							<div className={Style.formField}>
								<label>description</label>
								<textarea
									placeholder="description"
									required
									value={description}
									onChange={(e) => setDescription(e.target.value)}
								/>
							</div>
							<div className={Style.formField}>
								<label>Rules</label>
								<textarea
									placeholder="Rules"
									// required
									value={rules}
									type="text"
									onChange={(e) => setRules(e.target.value)}
								/>
							</div>
							<div className={Style.formField}>
								<label>duration (days)</label>
								<input
									type={"number"}
									placeholder="description"
									required
									// defaultValue={30}
									value={days}
									onChange={(e) => setDays(e.target.value)}
								/>
							</div>

							<button type="submit" className={Style.submitBtn}>
								Publish
							</button>
						</form>
					</div>
				) : (
					"Please login/signup to continue"
				)}
			</div>
		</div>
	);
};

export default Make;
