import SectionTitle from "components/SectionTitle";
import Head from "next/head";

const VerifyEmail = () => {
  return (
    <>
    <Head>
        <title>Verificar Email | 0800 Pancho</title>
    </Head>
    <section className="grid h-full place-items-center bg-transparent py-5 px-4 text-base tracking-[1px] text-baseText">
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-4 border-primary px-6 py-14 sm:p-14">
        <SectionTitle className="w-auto text-center font-bold text-baseText">
          Verificar Email
        </SectionTitle>
        <p className="text-center">
          Hemos enviado un email a tu casilla de correo para verificar tu
          cuenta.
        </p>
      </div>
    </section>
    </>
  );
};

export default VerifyEmail;
