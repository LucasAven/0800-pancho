import Link from "next/link";
const texts = {
  succeded: {
    title: "Compra completada exitosamente 🔥",
    description:
      "Recibirás tus archivos en un instante al mail que hayas proporcionado. Revisa la casilla de spam ya que puede aparacer allí.",
  },
  failed: {
    title: "La compra no se pudo completar 🚫",
    description: "Por favor, intentalo nuevamente.",
  },
};

const postPurchase = ({ succeed }) => {
  return (
    <section
      className="purchase__container"
      style={{ minHeight: "calc(100vh - 282px)" }}
    >
      <h1>{succeed === "true" ? texts.succeded.title : texts.failed.title}</h1>
      <div>
        <p>
          {succeed === "true"
            ? texts.succeded.description
            : texts.failed.description}
        </p>
        <Link href="/">
          <a className="beat__action-btn">Volver al Home</a>
        </Link>
      </div>
    </section>
  );
};
postPurchase.getInitialProps = async ({ query }) => {
  const { succeed } = query;
  return { succeed };
};
export default postPurchase;
