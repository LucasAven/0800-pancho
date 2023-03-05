/* eslint-disable @typescript-eslint/no-misused-promises */
import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import type { BeatData, LicenseType, PricesObject } from "types";
import SectionTitle from "components/SectionTitle";
import NoteSVG from "components/svgs/NoteSVG";
import ClockSVG from "components/svgs/ClockSVG";
import BpmSVG from "components/svgs/BpmSVG";
import Selector from "components/Selector";
import FormInput from "components/FormInput";
import Loader from "components/Loader";
import { BUYABLE_LICENSES_OPTIONS, GET_DOLLAR_VALUE_KEY, IMAGE_PLACEHOLDER, LICENSES_PERKS } from "constants/index";
import {
  cn,
  convertUSDPricesToARS,
  fetchDollarPrice,
  getCheckoutLink,
  getPrices,
} from "utils";
import { useForm } from "react-hook-form";
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import { useQuery } from "react-query";

const BeatPage = ({
  beat,
  usdPrices,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const { data: dollarValue } = useQuery([GET_DOLLAR_VALUE_KEY], fetchDollarPrice, {
    staleTime: Infinity,
  });

  const prices = useMemo(
    () => convertUSDPricesToARS(usdPrices, dollarValue),
    [usdPrices, dollarValue]
  );

  const [license, setLicence] = useState<LicenseType | null>(null);
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();

  const onSubmit = (data: { email: string }) => {
    if(!license) return;

    setLoading(true);
    getCheckoutLink({ beat, license, buyerEmail: data.email, prices })
      .then(({ checkoutLink }) => push(checkoutLink))
      .catch((error) => alert(error))
      .finally(() => setLoading(false));
  };

  return (
    <section className="mx-auto w-4/5 max-w-4xl text-baseText md:max-w-xl">
      <SectionTitle type="h1" className="font-bold md:whitespace-nowrap">
        Completar compra
      </SectionTitle>
      <div className="md: mt-7 flex flex-col items-center justify-center gap-8 md:flex-row">
        <Image
          src={beat.image_url || IMAGE_PLACEHOLDER}
          alt={beat.title}
          width={250}
          height={160}
          className="h-40 w-40 object-none"
        />
        <div>
          <h2 className="text-2xl">{beat.title}</h2>
          <div className="mt-2 flex gap-4 text-lg">
            <div className="flex items-center">
              <ClockSVG width={20} height={20} className="text-primary" />{" "}
              <p className="ml-2">{beat.duration}</p>
            </div>
            <div className="flex items-center">
              <BpmSVG width={20} height={20} className="text-primary" />{" "}
              <p className="ml-2">{beat.bpm}</p>
            </div>
            <div className="flex items-center">
              <NoteSVG width={20} height={20} className="text-primary" />
              <p className="ml-2">{beat.scale}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-9 mb-12  md:mt-20">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FormInput
            type="email"
            name="email"
            placeholder="Email (recibirás los archivos en este email)"
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
            className="text-sm md:text-base"
          />
          <Selector
            options={BUYABLE_LICENSES_OPTIONS}
            placeholder="elije una licencia"
            onSelect={(opt) => setLicence(opt.value as LicenseType)}
          />
          <span
            className={cn(
              "text-lg font-medium text-primary",
              license && "hidden"
            )}
          >
            Selecciona un tipo de licencia
          </span>
          <div className={cn(!license && "mt-10")}>
            <p className={cn(!license && "hidden")}>Incluye:</p>
            {license ? (
              <ul className="mb-5 flex w-5/6 flex-col gap-2 text-start sm:w-[70%]">
                {LICENSES_PERKS[license].perks.map((perk) => {
                  return (
                    <li key={`${license}-${perk}`} className="lit-icon">
                      {perk}
                    </li>
                  );
                })}
              </ul>
            ) : null}
            <div
              className={cn(
                "flex items-center",
                license ? "justify-between" : "justify-end"
              )}
            >
              {license && (
                <h3 className="text-lg font-bold">
                  Precio final:{" "}
                  <span className="text-primary">{`$${prices[license]}`}</span>
                </h3>
              )}
              <button
                type="submit"
                className="primary-button text-black"
                disabled={!license || loading}
              >
                {loading ? <Loader className="static p-1.5" /> : "Comprar"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export const getStaticProps: GetStaticProps<{
  beat: BeatData;
  usdPrices: PricesObject;
}> = async (ctx) => {
  const beat_data = await global.prisma?.beat.findUnique({
    where: {
      beatId: ctx.params?.beatId as string,
    },
  });

  const beat = !beat_data ? null : beat_data;

  const usdPrices = await getPrices();

  if (!beat || beat.sold || !usdPrices) {
    return {
      notFound: true,
    };
  }

  return {
    props: { beat, usdPrices },
    revalidate: 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await global.prisma?.beat.findMany({
    select: {
      beatId: true,
    },
  });

  const paths = !data
    ? []
    : data.map(({ beatId }) => ({
        params: { beatId },
      }));

  return { paths, fallback: "blocking" };
};

export default BeatPage;
