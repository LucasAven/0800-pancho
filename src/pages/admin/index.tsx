import SectionTitle from "components/SectionTitle";
import Tracks from "components/Tracks";
import Head from "next/head";
import { withProtected } from "utils/hoc";
import { signOut } from "next-auth/react";

const Admin = () => {

   return (
     <>
       <Head>
         <title>Admin | 0800 Pancho</title>
       </Head>
       <button className="primary-button ml-auto mr-4" onClick={() => void signOut()}>
         Cerrar Sesion
       </button>
       <SectionTitle className="mt-5 mb-auto w-auto text-center font-bold text-baseText">
         Admin Panel
       </SectionTitle>
       <Tracks showAllBeats adminView />
     </>
   );

};

export default withProtected(Admin);
