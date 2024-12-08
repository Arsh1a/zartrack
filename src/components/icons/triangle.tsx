import { cn } from "@/lib/utils";

export default function TriangleIcon({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={(size * 64) / 88}
      viewBox="0 0 88 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32.9435 4.95685C36.9397 -0.477945 45.0603 -0.47794 49.0565 4.95685L79.2913 46.0761C84.147 52.6799 79.4316 62 71.2347 62H10.7653C2.56841 62 -2.14698 52.6799 2.70875 46.0761L32.9435 4.95685Z"
        fill="white"
        className={cn(className)}
      />
    </svg>
  );
}
