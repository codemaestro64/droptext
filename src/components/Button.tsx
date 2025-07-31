import { BgVariants } from "@/types"
import { getVariantBtnClassName } from "@/utils/variantClassNames"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>  {
  variant?: BgVariants
}

const Button  = ({ 
  variant = "primary",
  className = "", 
  children, 
  ...props 
}: ButtonProps) => {
  const combinedClassNames = `
    py-2 rounded-sm flex items-center font-medium  
    disabled:opacity-50 disabled:cursor-not-allowed
    cursor-pointer
    ${className}
  `
  
  return (
    <button
      {...props}
      className={getVariantBtnClassName(variant, combinedClassNames)}
    >
      {children}
    </button>
  )
}

export default Button
