"use client"

import { usePathname } from "next/navigation"
import { Footer } from "@/components/footer"
import { BottomNavigation } from "@/components/bottom-navigation"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  return (
    <>
      <div className={`min-h-screen flex flex-col ${!isAdmin ? "pb-20 md:pb-0" : ""}`}>
        {children}
        {!isAdmin && <Footer />}
      </div>
      {!isAdmin && <BottomNavigation />}
    </>
  )
}
