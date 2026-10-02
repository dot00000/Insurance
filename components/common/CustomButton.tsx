
import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";

type CustomButtonProps = ComponentProps<typeof Button>;

export function CustomButton({ className, ...props }: CustomButtonProps) {
  return (
    <Button
      variant="outline"
      className={`h-11 rounded-xl border-slate-400 px-6 text-sm font-medium text-slate-900 shadow-sm hover:bg-[#2196F3] hover:text-white ${className ?? ""}`}
      {...props}
    />
  );
}
