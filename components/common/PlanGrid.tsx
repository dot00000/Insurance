import type { ReactNode } from 'react'

export type PlanId = 'light' | 'standard' | 'premium'

const planGridColumns: Record<PlanId, string> = {
  light: 'grid-cols-[minmax(88px,0.8fr)_minmax(72px,1.2fr)_minmax(72px,1fr)_minmax(72px,1fr)] sm:grid-cols-[minmax(128px,1fr)_minmax(132px,1.2fr)_minmax(132px,1fr)_minmax(132px,1fr)]',
  standard: 'grid-cols-[minmax(88px,0.8fr)_minmax(72px,1fr)_minmax(72px,1.2fr)_minmax(72px,1fr)] sm:grid-cols-[minmax(128px,1fr)_minmax(132px,1fr)_minmax(132px,1.2fr)_minmax(132px,1fr)]',
  premium: 'grid-cols-[minmax(88px,0.8fr)_minmax(72px,1fr)_minmax(72px,1fr)_minmax(72px,1.2fr)] sm:grid-cols-[minmax(128px,1fr)_minmax(132px,1fr)_minmax(132px,1fr)_minmax(132px,1.2fr)]',
}

type PlanGridProps = {
  selectedPlan: PlanId
  children: ReactNode
  className?: string
}

export default function PlanGrid({ selectedPlan, children, className = '' }: PlanGridProps) {
  return (
    <div className={`grid ${planGridColumns[selectedPlan]} transition-[grid-template-columns] duration-300 ease-in-out ${className}`}>
      {children}
    </div>
  )
}