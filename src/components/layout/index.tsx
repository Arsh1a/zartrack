import React from "react";
import Navbar from "./navbar";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="max-w-screen-lg mx-auto px-5 flex flex-col gap-5">
      <Navbar />
      {children}
    </div>
  );
}
