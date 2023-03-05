import SectionTitle from "components/SectionTitle";
import Head from "next/head";
import Link from "next/link";
import { HOME_PATH } from "routes";

const PermissionDenied = () => {
  return (
    <>
      <Head>
        <title>Acceso Denegado | 0800 Pancho</title>
      </Head>
      <section className="grid h-full place-items-center bg-transparent py-5 px-4 text-base tracking-[1px] text-baseText">
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-4 border-primary px-6 py-14 sm:p-14">
          <SectionTitle className="w-auto text-center font-bold text-baseText">
            Acceso Denegado
          </SectionTitle>
          <p className="text-center">
            No tienes permisos para acceder a esta seccion.
          </p>
          <Link href={HOME_PATH} className="primary-button mt-8">Volver al inicio</Link>
        </div>
      </section>
    </>
  );
};

export default PermissionDenied;
