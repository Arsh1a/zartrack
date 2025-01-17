"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "./actions";

export default function Logout() {
  return (
    <Button variant="outline" onClick={logout}>
      Logout <LogOut />
    </Button>
  );
}
