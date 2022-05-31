import { configure, preferences, payment } from "mercadopago";

export function configureMercadoPagoSDK() {
  configure({
    access_token: process.env.NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN,
  });
}

const createPreferenceLink = async (data) => preferences.create(data);

export const createPaymentLink = async (data) => {
  try {
    const preferences = {
      items: [data.item],
      external_reference: JSON.stringify({
        id: data.item.id,
        email: data.customer,
        license: data.license,
      }),
      payment_methods: {
        installments: 3,
        excluded_payment_methods: [
          {
            id: "pagofacil",
          },
          {
            id: "rapipago",
          },
        ],
        excluded_payment_types: [
          {
            id: "ticket",
          },
        ],
        // limite superior de cantidad de cuotas permitidas
      },
      back_urls: {
        // declaramos las urls de redireccionamiento
        success: `${process.env.NEXT_PUBLIC_VERCEL_URL}/postPurchase?succeed=true`,
        // url que va a redireccionar si sale todo bien
        failure: `${process.env.NEXT_PUBLIC_VERCEL_URL}/postPurchase?succeed=false`,
        // url a la que va a redireccionar si falla el pago
      },
      notification_url: `https://pancho-kappa.vercel.app/api/webhook`,
      // declaramos nuestra url donde recibiremos las notificaciones
      auto_return: "approved",
      // si la compra es exitosa automaticamente redirige a "success" de back_urls
    };
    const response = await createPreferenceLink(preferences);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getPayment = (paymentId) => payment.get(paymentId);
