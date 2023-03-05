import Link from "next/link";
import { useRouter } from "next/router";
import { PURCHASE_TEXTS } from "constants/index";
import { HOME_PATH } from "routes";
import { getMailtoTextPostPurchase } from "utils";
import type { GetServerSideProps } from "next";
import { env } from "env/client.mjs";

const PostPurchase = () => {
  const { query } = useRouter();
  const { succeed, beatId } = query;

  return (
    <section className="text-center text-baseText">
      <h1 className="mt-24 mb-16 text-4xl font-bold md:my-24">
        {succeed === "true"
          ? PURCHASE_TEXTS.succeded.title
          : PURCHASE_TEXTS.failed.title}
      </h1>
      <div className="my-0 mx-auto flex max-w-prose flex-col items-center gap-20 px-6">
        <p className="text-xl font-medium tracking-[0.5px]">
          {succeed === "true"
            ? PURCHASE_TEXTS.succeded.description
            : PURCHASE_TEXTS.failed.description}
        </p>
        {succeed === "true" && (
          <p className="max-w-[50ch] text-base font-medium tracking-[0.5px]">
            Si no recibes el beat, comunícate con{" "}
            <a
              href={getMailtoTextPostPurchase(beatId as string)}
              className="font-bold text-primary underline underline-offset-4"
            >
              {env.NEXT_PUBLIC_CONTACT_EMAIL}
            </a>{" "}
            aclarando que el id de compra es:{" "}
            <span className="font-bold text-primary">{beatId}</span>
          </p>
        )}
        <Link href={HOME_PATH} className="primary-button p-3">
          Volver al Home
        </Link>
      </div>
    </section>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const beat_data = await global.prisma?.beat.findUnique({
    where: {
      beatId: query?.beatId as string,
    },
  });

  const beat = !beat_data ? null : beat_data;

  if (!beat || beat.sold) {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
};

export default PostPurchase;
