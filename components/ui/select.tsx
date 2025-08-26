'use client'

import * as React from 'react'
import { ChevronDown, Check } from 'lucide-react'

export interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

export interface SelectTriggerProps {
  className?: string
  children: React.ReactNode
}

export interface SelectContentProps {
  className?: string
  children: React.ReactNode
}

export interface SelectItemProps {
  value: string
  className?: string
  children: React.ReactNode
}

export interface SelectValueProps {
  placeholder?: string
}

const SelectContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}>({
  open: false,
  setOpen: () => {}
})

export const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
  const [open, setOpen] = React.useState(false)
  
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ className = '', children }) => {
  const { setOpen, open } = React.useContext(SelectContext)
  
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    >
      {children}
      <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
  )
}

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder = 'Select...' }) => {
  const { value } = React.useContext(SelectContext)
  
  return (
    <span className={value ? 'text-gray-900' : 'text-gray-500'}>
      {value || placeholder}
    </span>
  )
}

export const SelectContent: React.FC<SelectContentProps> = ({ className = '', children }) => {
  const { open } = React.useContext(SelectContext)
  
  if (!open) return null
  
  return (
    <div className={`absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto ${className}`}>
      {children}
    </div>
  )
}

export const SelectItem: React.FC<SelectItemProps> = ({ value, className = '', children }) => {
  const { value: selectedValue, onValueChange, setOpen } = React.useContext(SelectContext)
  const isSelected = selectedValue === value
  
  return (
    <div
      onClick={() => {
        onValueChange?.(value)
        setOpen(false)
      }}
      className={`flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${isSelected ? 'bg-blue-50 text-blue-900' : 'text-gray-900'} ${className}`}
    >
      {children}
      {isSelected && <Check className="h-4 w-4 ml-auto" />}
    </div>
  )
}