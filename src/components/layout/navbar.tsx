import React from "react";

import ThemeToggle from "../theme-toggle";
import Link from "next/link";
import { Button } from "../ui/button";
import { User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between py-2">
      <ul className="flex gap-5 items-center">
        <li>
          <Link href="/">
            <h1 className="font-semibold text-2xl">Zartrack</h1>
          </Link>
        </li>
        <li className="hover:opacity-60">
          <Link href="/portfolio">Portfolio</Link>
        </li>
      </ul>
      <div className="flex gap-2">
        <Link href="/account">
          <Button variant="outline" size="icon">
            <User />
          </Button>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
