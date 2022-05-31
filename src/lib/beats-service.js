import { firebaseApp } from "utils/firebase";
import { ref, getDatabase, get, set } from "firebase/database";
import { getPayment } from "./mercadopago-service";
import { sendEmail } from "./send-email-service";

const database = getDatabase(firebaseApp);

export const updateBeats = async (payID) => {
  const paymentData = await getPayment(payID);
  if (
    paymentData.response.status === "approved" &&
    paymentData.response.status_detail === "accredited"
  ) {
    const { id, email, license } = JSON.parse(
      paymentData.response.external_reference
    );
    const beatRef = ref(database, `beats/${id}`);
    const beatRes = await get(beatRef);
    const beat = beatRes.val();
    beat.vendido = true;
    set(beatRef, beat);

    // Envio de email con los datos del beat vendido
    const fileRoute = license === "basic" ? "archivo_base" : "archivo_editable";
    const filesRef = ref(database, `files/${id}/${fileRoute}`);
    const filesRes = await get(filesRef);
    const fileLink = filesRes.val();
    const mailData = {
      email: email,
      beat: beat.titulo,
      id: beat.key,
      license: license,
      link: fileLink,
    };
    const result = await sendEmail(mailData);
  }
};
