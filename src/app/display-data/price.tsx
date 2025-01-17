import TriangleIcon from "@/components/icons/triangle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

export default function Price({ value }: { value: number }) {
  const [change, setChange] = useState<number>(0);
  const previousValueRef = useRef<number | null>(null);

  // Calculate the change in value and set it to the state when the value changes
  useEffect(() => {
    if (previousValueRef.current !== null) {
      const newChange = value - previousValueRef.current;
      setChange(newChange);
    }

    previousValueRef.current = value;
  }, [value]);

  return (
    <Tooltip>
      <TooltipTrigger className="cursor-default">
        <span className="flex items-center gap-[2px]">
          <Arrow change={change} />
          {Number(value).toLocaleString()}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {change > 0 && "+"}
        {change}
      </TooltipContent>
    </Tooltip>
  );
}

function Arrow({ change }: { change: number }) {
  return (
    <span
      className={cn(
        change > 0 && "rotate-0",
        change < 0 && "rotate-180",
        change === 0 && "rotate-90",
        "transition-all duration-500"
      )}
    >
      <TriangleIcon
        size={12}
        className={cn(
          change > 0 && "fill-green-500",
          change < 0 && "fill-red-500",
          change === 0 && "fill-blue-500",
          "transition-all duration-500 border-0 stroke-none"
        )}
      />
    </span>
  );
}
