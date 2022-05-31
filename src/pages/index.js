import Header from "components/Header";
import Licenses from "components/Licenses";
import Tracks from "components/Tracks";
import YoutubeSection from "components/YoutubeSection";
import { get, getDatabase, ref } from "firebase/database";
import Head from "next/head";
import { firebaseApp } from "utils/firebase";
import ContactForm from "../components/ContactForm";

const Home = ({ prices }) => {
  return (
    <>
      <Head>
        <title>Home |0800 Pancho</title>
      </Head>
      <Header />
      <Tracks />
      <Licenses prices={prices} />
      <div className="contact-yotube-container">
        <ContactForm />
        <YoutubeSection />
      </div>
    </>
  );
};

Home.getInitialProps = async () => {
  const database = getDatabase(firebaseApp);
  const dbPreciosRef = ref(database, "prices/");
  const dbPreciosRes = await get(dbPreciosRef);
  let { basic, premium, custom } = dbPreciosRes.val();
  let valorDolar = 200;
  fetch("https://api.bluelytics.com.ar/v2/latest")
    .then((response) => response.json())
    .then((data) => (valorDolar = Number(data.blue.value_sell)))
    .catch((error) => {
      console.log("Error al obtener valor del dolar: ", error);
    });
  basic = Number(basic) * valorDolar;
  premium = Number(premium) * valorDolar;
  custom = Number(custom) * valorDolar;
  return { prices: { basic, premium, custom } };
};
export default Home;
