import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import SectionTitle from "components/SectionTitle";
import { cn, sendEmail } from "utils";
import Loader from "components/Loader";
import FormInput from "components/FormInput";

export interface IContactFormProps {
  fullPage?: boolean;
}

const contactFormSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener no mas de 50 caracteres"),
  subject: z
    .string()
    .min(3, "El asunto debe tener al menos 3 caracteres")
    .max(50, "El asunto debe tener no mas de 50 caracteres"),
  email: z.string().email("Email invalido"),
  message: z.string().min(3, "El mensaje debe tener al menos 3 caracteres"),
});

export type ContactSchemaType = z.infer<typeof contactFormSchema>;

enum ContactFormState {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR,
}

const ContactForm: React.FC<IContactFormProps> = ({ fullPage = false }) => {
  const {
    register,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
    getValues,
    reset,
  } = useForm<ContactSchemaType>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      subject: "",
      email: "",
      message: "",
    },
  });
  const [formState, setFormState] = useState<ContactFormState>(
    ContactFormState.IDLE
  );

  const onSubmit = (data: ContactSchemaType) => {
    setFormState(ContactFormState.LOADING);
    sendEmail(true, data)
      .then(() => setFormState(ContactFormState.SUCCESS))
      .catch(() => setFormState(ContactFormState.ERROR));
  };

  useEffect(() => {
    if (isSubmitSuccessful && formState === ContactFormState.SUCCESS) {
      reset({
        name: "",
        subject: "",
        email: "",
        message: "",
      });
    }
  }, [isSubmitSuccessful, formState, reset]);

  useEffect(() => {
    if (formState === ContactFormState.SUCCESS) {
      setTimeout(() => setFormState(ContactFormState.IDLE), 3000);
    }
  }, [formState]);

  return (
    <section
      className={cn(
        "flex flex-col items-center justify-center gap-4 bg-bg py-5 text-base tracking-[1px] text-baseText",
        fullPage && "mx-auto min-h-full w-full bg-transparent",
        !fullPage && "big-md:w-1/2 big-md:max-w-2xl"
      )}
    >
      <SectionTitle className="m-0 my-5 font-bold text-baseText">
        Contacto
      </SectionTitle>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 w-full max-w-[593px] px-7 md:max-w-[1100px] md:px-12"
      >
        <div className="flex flex-col gap-7 md:flex-row md:justify-center md:gap-8">
          <FormInput
            type="text"
            name="name"
            placeholder="Nombre"
            register={register}
            getValues={getValues}
            error={errors.name}
            validations={{ required: "Nombre requerido" }}
            className="m-0 w-full"
          />
          <FormInput
            type="email"
            name="email"
            placeholder="Email"
            register={register}
            getValues={getValues}
            error={errors.email}
            validations={{
              required: "Email requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Email inválido",
              },
            }}
            className="m-0 w-full"
          />
        </div>
        <FormInput
          type="text"
          name="subject"
          placeholder="Asunto"
          register={register}
          getValues={getValues}
          error={errors.subject}
          validations={{ required: "Asunto requerido" }}
        />
        <FormInput
          type="textarea"
          name="message"
          placeholder="Mensaje"
          register={register}
          getValues={getValues}
          error={errors.message}
          validations={{ required: "Mensaje requerido" }}
        />
        <button
          type="submit"
          className="primary-button mx-auto mt-5 mb-2 mr-0 h-10 w-24 px-2 py-3 text-base text-black"
          disabled={formState === ContactFormState.LOADING}
        >
          {formState === ContactFormState.LOADING ? (
            <Loader className="p-1" />
          ) : (
            "Enviar"
          )}
        </button>
        {formState === ContactFormState.SUCCESS && (
          <p className="pt-1 text-center text-xs text-baseText">
            Email enviado ✔! Pronto recibirás una respuesta.
          </p>
        )}
        {formState === ContactFormState.ERROR && (
          <p className="pt-1 text-xs text-error">
            Ocurrió un error al enviar el mail, porfavor intenta de nuevo.
            <br />O usa mis redes para contactarne!
          </p>
        )}
      </form>
    </section>
  );
};

export default ContactForm;
