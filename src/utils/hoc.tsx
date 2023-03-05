import Loader from "components/Loader";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const withProtected = (Component: NextPage) => {
  // eslint-disable-next-line react/display-name
  return (): JSX.Element => {
    const { status: sessionStatus } = useSession();
    const router = useRouter();
    const authorized = sessionStatus === "authenticated";
    const unAuthorized = sessionStatus === "unauthenticated";
    const loading = sessionStatus === "loading";

    useEffect(() => {
      // check if the session is loading or the router is not ready
      if (loading || !router.isReady) return;

      // if the user is not authorized, redirect to the login page
      // with a return url to the current page
      if (unAuthorized) {
        void router.push({ pathname: "/admin/signin" });
      }
    }, [loading, unAuthorized, sessionStatus, router]);

    // if the user refreshed the page or somehow navigated to the protected page
    if (loading) {
      return <Loader />;
    }

    // if the user is authorized, render the page
    // otherwise, render nothing while the router redirects him to the login page
    return authorized ? <Component /> : <></>;
  };
};
