
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

import {
	GoogleAuthProvider,
	getAuth,
	signInWithPopup,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signOut,
} from "firebase/auth";

import {
	getFirestore,
	query,
	getDocs,
	collection,
	where,
	addDoc,
	setDoc,
	doc,
} from "firebase/firestore";
import toast from "react-hot-toast";

const firebaseConfig = {
	apiKey: "AIzaSyBou0N65NdQSdavB2XeEcXUyKx7F41vm6w",

	authDomain: "fitmate-1cb92.firebaseapp.com",

	projectId: "fitmate-1cb92",

	storageBucket: "fitmate-1cb92.appspot.com",

	messagingSenderId: "979666598971",

	appId: "1:979666598971:web:47bdc2c1c45f323c3b701e",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
	try {
		const res = await signInWithPopup(auth, googleProvider);
		const user = res.user;
		const q = query(collection(db, "users"), where("uid", "==", user.uid));
		const docs = await getDocs(q);
		if (docs.docs.length === 0) {
			await setDoc(doc(db, "users", user.uid), {
				uid: user.uid,
				name: user.displayName,
				authProvider: "google",
				email: user.email,
			});
		}
		toast.success(`${user.email} Logged in successfully`);
	} catch (error) {
		console.log(error);
		toast.error(error.message);
	}
};

const logInWithEmailAndPassword = async (email, password) => {
	try {
		await signInWithEmailAndPassword(auth, email, password);
		toast.success(`${email} Logged in successfully`);
	} catch (error) {
		console.log(error);
		toast.error(error.message);
	}
};

const registerWithEmailAndPassword = async (name, email, password) => {
	try {
		const res = await createUserWithEmailAndPassword(auth, email, password);
		const user = res.user;
		await setDoc(doc(db, "users", user.uid), {
			uid: user.uid,
			name,
			authProvider: "local",
			email,
		});
	} catch (error) {
		console.log(error.message);
		toast.error(error.message);
	}
};

const sendPasswordReset = async (email) => {
	try {
		await sendPasswordResetEmail(auth, email);
	} catch (error) {
		console.log(error);
		alert(error.message);
	}
};

const logout = () => {
	signOut(auth);
	toast.success(` Logged out successfully`);
};

export {
	auth,
	db,
	signInWithGoogle,
	logInWithEmailAndPassword,
	registerWithEmailAndPassword,
	sendPasswordReset,
	logout,
	storage,
};
