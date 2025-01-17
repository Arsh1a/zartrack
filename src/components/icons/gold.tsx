import { Container } from "lucide-react";
import { IconProps } from "./type";
import { cn } from "@/lib/utils";

export default function Gold(props: IconProps) {
  return (
    <Container {...props} className={cn("text-yellow-500", props.className)} />
  );
}
