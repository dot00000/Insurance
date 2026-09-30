import { Check } from 'lucide-react'
import type { PlanId } from '@/components/common/PlanGrid'

type SelectedPlanProps = {
  plans: readonly {
    id: PlanId
    name: string
    price: string
    description: string
  }[]
  coverages: readonly {
    name: string
    values: readonly string[]
  }[]
  selectedPlan: PlanId
  onPlanChange: (planId: PlanId) => void
}

export default function SelectedPlan({ plans, coverages, selectedPlan, onPlanChange }: SelectedPlanProps) {
    const selectedPlanIndex = plans.findIndex((plan) => plan.id === selectedPlan)
    const gridStyle = {
      gridTemplateColumns: `minmax(88px, 0.8fr) ${plans.map((plan) =>
        `minmax(72px, ${plan.id === selectedPlan ? '1.2' : '1'}fr)`,
      ).join(' ')}`,
    }
  return (
     <div className="overflow-hidden rounded-xl border border-[#e1e6ec] bg-white shadow-[0_2px_8px_rgba(25,38,55,0.03)]">
              <div style={gridStyle} className={`grid border-b border-[#e5e9ee] transition-[grid-template-columns] duration-300 ease-in-out`}>
                <div className="flex items-end px-4 pb-5 pt-5 text-sm font-semibold text-[#707a86] sm:px-6">보장 항목</div>
                {plans.map((plan) => {
                  const active = selectedPlan === plan.id
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onPlanChange(plan.id)}
                      className={`relative flex min-h-[132px] flex-col items-center justify-center border-2 rounded-xl px-2 py-4 text-center transition-[background-color,border-color,color,box-shadow] duration-300 ease-out sm:px-4 ${active ? 'border-[#218df0] bg-[#eff6ff] text-[#174a78] shadow-[0_4px_12px_rgba(33,141,240,0.3)]' : 'border-transparent bg-white hover:bg-[#f7fbff]'}`}
                    >
                      <span className={`mb-2 flex size-5 items-center justify-center rounded-full border transition-colors duration-300 ${active ? 'border-[#218df0] bg-[#218df0] text-white' : 'border-[#c8d0da] bg-white text-transparent'}`}><Check size={13} strokeWidth={3} /></span>
                      <span className={`${active ? 'text-base sm:text-lg' : 'text-sm sm:text-base'} font-bold`}>{plan.name}</span>
                      <span className={`mt-1 font-extrabold tabular-nums ${active ? 'text-lg sm:text-2xl' : 'text-base sm:text-xl'}`}>{plan.price}<span className={`ml-0.5 text-[10px] font-medium sm:text-xs ${active ? 'text-[#4f7395]' : ''}`}>원</span></span>
                      <span className={`mt-1 hidden text-xs sm:block ${active ? 'text-[#4f7395]' : 'text-[#7b8591]'}`}>{plan.description}</span>
                    </button>
                  )
                })}
              </div>

              {coverages.map((coverage, rowIndex) => (
                <div key={coverage.name} style={gridStyle} className={`grid transition-[grid-template-columns] duration-300 ease-in-out ${rowIndex < coverages.length - 1 ? 'border-b border-[#edf0f3]' : ''}`}>
                  <div className="flex min-h-[64px] items-center px-4 text-sm font-semibold text-[#4a525d] sm:px-6">{coverage.name}</div>
                  {coverage.values.map((value, index) => {
                    const active = selectedPlanIndex === index
                    return <div key={`${coverage.name}-${index}`} className={`flex min-h-[64px] items-center justify-center px-2 text-center transition-colors duration-300 ${active ? 'bg-[#eff6ff] text-base font-bold text-[#174a78] sm:text-lg' : 'text-sm text-[#68727e]'}`}>{value}</div>
                  })}
                </div>
              ))}
              <div style={gridStyle} className={`grid border-t border-[#e5e9ee] bg-[#fafbfd] transition-[grid-template-columns] duration-300 ease-in-out`}>
                <div className="flex items-center px-4 py-4 text-sm font-bold sm:px-6">보험료</div>
                {plans.map((plan) => {
                  const active = selectedPlan === plan.id
                  return <div key={plan.id} className={`flex items-center justify-center gap-1 px-2 py-4 font-extrabold tabular-nums transition-colors duration-300 ${active ? 'bg-[#eff6ff] text-lg text-[#174a78] sm:text-xl' : 'text-base text-[#343a43]'}`}>{plan.price}<span className="text-xs font-medium">원</span></div>
                })}
              </div>
            </div>
  )
}
