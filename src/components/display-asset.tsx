import { ICONS_MAP } from "@/constants";
import { findAssetNameByCode } from "@/lib/transform-data";
import { cn } from "@/lib/utils";

interface Props {
  code: string;
  showCode?: boolean;
}

export default function DisplayAsset({ code, showCode = true }: Props) {
  const IconComponent = ICONS_MAP[code.toLowerCase()];
  const name = findAssetNameByCode(code.toLowerCase());

  return (
    <div className="flex gap-1 items-center">
      {IconComponent && (
        <IconComponent height={24} width={24} className="shrink-0" />
      )}
      {showCode && <span className="uppercase">{code}</span>}
      <span>-</span>
      <span
        className={cn(showCode && "text-[0.65rem]", "truncate")}
        title={code}
      >
        {name}
      </span>
    </div>
  );
}
