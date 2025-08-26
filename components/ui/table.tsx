'use client'

import * as React from 'react'

export interface TableProps {
  className?: string
  children: React.ReactNode
}

export interface TableHeaderProps {
  className?: string
  children: React.ReactNode
}

export interface TableBodyProps {
  className?: string
  children: React.ReactNode
}

export interface TableHeadProps {
  className?: string
  children: React.ReactNode
}

export interface TableRowProps {
  className?: string
  children: React.ReactNode
}

export interface TableCellProps {
  className?: string
  children: React.ReactNode
}

export const Table: React.FC<TableProps> = ({ className = '', children }) => {
  return (
    <div className="w-full overflow-auto">
      <table className={`w-full caption-bottom text-sm ${className}`}>
        {children}
      </table>
    </div>
  )
}

export const TableHeader: React.FC<TableHeaderProps> = ({ className = '', children }) => {
  return (
    <thead className={`[&_tr]:border-b ${className}`}>
      {children}
    </thead>
  )
}

export const TableBody: React.FC<TableBodyProps> = ({ className = '', children }) => {
  return (
    <tbody className={`[&_tr:last-child]:border-0 ${className}`}>
      {children}
    </tbody>
  )
}

export const TableHead: React.FC<TableHeadProps> = ({ className = '', children }) => {
  return (
    <th className={`h-10 px-2 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] ${className}`}>
      {children}
    </th>
  )
}

export const TableRow: React.FC<TableRowProps> = ({ className = '', children }) => {
  return (
    <tr className={`border-b transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-50 ${className}`}>
      {children}
    </tr>
  )
}

export const TableCell: React.FC<TableCellProps> = ({ className = '', children }) => {
  return (
    <td className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] ${className}`}>
      {children}
    </td>
  )
}