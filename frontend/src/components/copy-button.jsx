"use client"

import * as React from "react"
import { Copy, CopyCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function copyToClipboardWithMeta(value, event) {
  navigator.clipboard.writeText(value)
}

export function CopyButton({
  value,
  className,
  variant = "ghost",
  event,
  ...props
}) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [hasCopied])

  return (
    <Button
      data-slot="copy-button"
      data-copied={hasCopied}
      size="icon"
      variant={variant}
      className={cn(
        "bg-code z-10 size-7 hover:opacity-100 focus-visible:opacity-100",
        className
      )}
      onClick={() => {
        copyToClipboardWithMeta(
          value,
          event
            ? {
                name: event,
                properties: {
                  code: value,
                },
              }
            : undefined
        )
        setHasCopied(true)
      }}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? <CopyCheck /> : <Copy />}
    </Button>
  )
}

