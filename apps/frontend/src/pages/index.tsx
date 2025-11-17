import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push('/login');
  }, []);
  return (
    <div
      className="mainBox"
    >
      <h2>Redirecting...</h2>
    </div>
  );
}
