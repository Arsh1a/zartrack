import { Coins as CoinsIcon } from "lucide-react";
import { IconProps } from "./type";
import { cn } from "@/lib/utils";

export default function Coins(props: IconProps) {
  return (
    <CoinsIcon {...props} className={cn("text-yellow-500", props.className)} />
  );
}
