"use client"

import { Copy } from "lucide-react"
import { forwardRef } from "react"
import { toast } from "react-toastify"

interface CopyButtonProps {
  size?: number
  copyText: string
}

const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(({ size, copyText, ...props }, ref) => {
  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(copyText)
      toast.success("Copied!")
    } catch {
      toast.error("Copy error!")
    }
  }
  
  return (
    <button 
      type="button" 
      title="Copy"
      ref={ref}
      {...props}
      onClick={handleClick}
    >
      <Copy size={size ? size : 20} />
    </button>
  )
})

CopyButton.displayName = "CopyButton"

export default CopyButton