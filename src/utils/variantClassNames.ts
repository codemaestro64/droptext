import { BgVariants } from "@/types"


const variantBgClassName: Record<string, string> = {
  primary: "bg-primary text-primary",
  success: "bg-success text-success",
  info: "bg-info text-main",
  error: "bg-danger text-danger",
}

const variantBtnClassName: Record<string, string> = {
  primary: "btn-primary text-primary",
  success: "btn-success text-success",
  info: "btn-info text-main",
  error: "btn-danger text-danger",
}

export const getVariantBgClassName = (variant: BgVariants, extraClassName?: string): string => {
  return `${variantBgClassName[variant]} ${extraClassName ?? ''}`
}

export const getVariantBtnClassName = (variant: BgVariants, extraClassName?: string): string => {
  return `${variantBtnClassName[variant]} ${extraClassName ?? ''}`
}