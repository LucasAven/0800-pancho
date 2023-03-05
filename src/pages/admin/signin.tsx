import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "components/FormInput";
import SectionTitle from "components/SectionTitle";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ADMIN_PATH } from "routes";
import { z } from "zod";

const signInFormSchema = z.object({
  email: z.string().email("Email invalido"),
});

export type SignInSchemaType = z.infer<typeof signInFormSchema>;

const SignIn = () => {
  const { status } = useSession();
  const { push } = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (status === "authenticated") {
      void push(ADMIN_PATH);
    }
  }, [status, push]);

  const onSubmit = (data: SignInSchemaType) => {
    void signIn("email", {
      email: data.email,
      callbackUrl: ADMIN_PATH,
    });
  };

  return (
    <>
      <Head>
        <title>Iniciar Sesion | 0800 Pancho</title>
      </Head>
      <section className="mx-auto flex min-h-full w-full flex-col items-center justify-center bg-transparent py-5 text-base tracking-[1px] text-baseText">
        <SectionTitle className="mt-5 mb-auto w-auto text-center font-bold text-baseText">
          Iniciar Sesion Panel Admin
        </SectionTitle>
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit(onSubmit)}
          className="mb-auto w-full max-w-xl px-7 md:px-12"
        >
          <FormInput
            type="email"
            placeholder="example@email.com"
            name="email"
            validations={{ required: true }}
            register={register}
            error={errors.email}
            getValues={getValues}
          />

          <button
            type="submit"
            className="primary-button mx-auto mt-8 h-10 px-2 py-3 text-base text-black"
          >
            Iniciar Sesion
          </button>
        </form>
      </section>
    </>
  );
};

export default SignIn;
