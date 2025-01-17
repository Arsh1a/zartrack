import React from "react";
import Navbar from "./navbar";
import Footer from "./footer";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="max-w-screen-xl mx-auto px-5 flex flex-col gap-5 h-screen">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
