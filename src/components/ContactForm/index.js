import Title from "components/Title";
import { useForm } from "react-hook-form";
import Input from "./Input";
import axios from "axios";
import { useEffect, useState } from "react";

const encode = (data) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

const ContactForm = ({ fullPage = false }) => {
  const {
    register,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      subject: "",
      email: "",
      message: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const onSubmit = async (data, e) => {
    setLoading(true);
    const res = await axios.post("/api/send-email", data);
    console.log(res.data);
    if (res.data.ok === true) {
      setSuccess(true);
    } else {
      setSuccess(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isSubmitSuccessful && success === true) {
      reset({
        name: "",
        subject: "",
        email: "",
        message: "",
      });
    }
  }, [isSubmitSuccessful, success, reset]);

  return (
    <section
      className={`contact-section ${fullPage ? "fullPage" : ""}`}
      style={fullPage ? { minHeight: "calc(100vh - 282px)" } : {}}
    >
      <Title title="Contacto" color="#eee" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="contact__base-inputs-container">
          <Input
            type="text"
            name="name"
            placeholder="Nombre"
            register={register}
            getValues={getValues}
            errors={errors}
            validations={{ required: "Nombre requerido" }}
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            register={register}
            getValues={getValues}
            errors={errors}
            validations={{
              required: "Email requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Email inválido",
              },
            }}
          />
        </div>
        <Input
          type="text"
          name="subject"
          placeholder="Asunto"
          register={register}
          getValues={getValues}
          errors={errors}
          validations={{ required: "Asunto requerido" }}
        />
        <Input
          type="textarea"
          name="message"
          placeholder="Mensaje"
          register={register}
          getValues={getValues}
          errors={errors}
          validations={{
            required: "Mensaje requerido",
            onChange: (e) => {
              e.target.style.height = "inherit";
              e.target.style.height = `${e.target.scrollHeight}px`;
            },
          }}
        />
        <button type="submit" className="beat__action-btn" disabled={loading}>
          {loading ? (
            <div
              className="loader"
              style={{ position: "static", padding: 3 }}
            ></div>
          ) : (
            "Enviar"
          )}
        </button>
        {success === true && (
          <p className="contact__sent-msg">
            Email enviado ✔! Pronto recibirás una respuesta.
          </p>
        )}
        {success === false && (
          <p className="contact__error-msg">
            Ocurrió un error al enviar el mail, porfavor intenta de nuevo.
            <br />O usa mis redes para contactarne!
          </p>
        )}
      </form>
    </section>
  );
};

export default ContactForm;
