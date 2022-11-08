import  Style from "../styles/globals.css";

import Head from "next/head";

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<title>Jolly</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta
					name="description"
					content="Jolly is a fitness and wellness platform for everyone. Join us and get fit."
				/>
			</Head>
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;