import React, { useEffect } from "react";
import Head from 'next/head';
import Cookies from "universal-cookie";
import { useRouter } from "next/router";

export default function Logout() {
  const cookies = new Cookies();
  const router = useRouter();

  useEffect(() => {
    cookies.remove("token", { path: "/" });
    router.push("/login");
  }, []);

  return (
    <div>
      <Head>
        <title>Logout</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  )
}
