"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground mb-4 md:mb-6 overflow-x-auto">
      <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors shrink-0">
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Главная</span>
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2 shrink-0">
          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          {item.href ? (
            <Link href={item.href} className="hover:text-primary transition-colors truncate max-w-[150px] md:max-w-none">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium truncate max-w-[150px] md:max-w-none">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
