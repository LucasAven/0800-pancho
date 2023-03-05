import ContactForm from "../components/ContactForm";
import Head from "next/head";

const Contact = () => {
  return (
    <>
      <Head>
        <title>Contacto | 0800 Pancho</title>
      </Head>
      <ContactForm fullPage />
    </>
  );
};

export default Contact;
