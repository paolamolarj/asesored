import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_5fdv8xp";
const TEMPLATE_ID = "template_laqkto9";
const PUBLIC_KEY = "xN5eTUw1MJ12XjLMr";

interface EmailParams {
  to_email: string;
  to_name: string;
  mensaje: string;
  materia: string;
  fecha: string;
  hora: string;
}

export async function enviarEmailConfirmacion(params: EmailParams) {
  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: params.to_email,
        to_name: params.to_name,
        mensaje: params.mensaje,
        materia: params.materia,
        fecha: params.fecha,
        hora: params.hora,
      },
      PUBLIC_KEY
    );
    return true;
  } catch (error) {
    console.error("Error enviando email:", error);
    return false;
  }
}