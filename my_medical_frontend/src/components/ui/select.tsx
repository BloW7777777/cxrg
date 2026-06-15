import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children?: React.ReactNode
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "[&>option]:bg-background",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 pointer-events-none" />
    </div>
  )
)
Select.displayName = "Select"

const SelectTrigger = Select
const SelectValue = ({ children }: { children?: React.ReactNode }) => (
  <>{children}</>
)
const SelectContent = ({ children }: { children?: React.ReactNode }) => (
  <>{children}</>
)
const SelectItem = ({ children }: { children?: React.ReactNode }) => (
  <>{children}</>
)
const SelectLabel = ({ children }: { children?: React.ReactNode }) => (
  <>{children}</>
)
const SelectSeparator = () => null

export {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
}
