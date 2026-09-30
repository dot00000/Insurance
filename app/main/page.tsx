'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Info, X } from 'lucide-react'
import DriverInsuranceWidget from '@/components/InsuranceWidget'
import SeletedInsurance from '@/components/SeletedInsurance'
import SelectedPlan from '@/components/SelectedPlan'
import type { PlanId } from '@/components/common/PlanGrid'
import { Button } from '@/components/ui/button'
import { getInsurancePlans } from '@/utils/insurancePlans'

export default function MainPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const router = useRouter()
  const params = use(searchParams)
  const getParam = (key: string) => typeof params[key] === 'string' ? params[key] : ''
  const insuranceType = getParam('insuranceType')
  const insuranceName = getParam('insuranceName')
  const insuredName = getParam('insuredName')
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('standard')
  const [detailsOpen, setDetailsOpen] = useState(false)
  const mockPlans = getInsurancePlans(getParam('category'), getParam('productIndex'), getParam('gender'), insuranceName, getParam('company'))
  const plans = mockPlans?.plans ?? [{
    id: 'standard' as const,
    name: getParam('productType') || insuranceType,
    price: getParam('price') || '-',
    description: getParam('period') || '',
  }]
  const coverages = mockPlans?.coverages ?? [
    { name: '주요 보장', values: [getParam('coverage') || '-'] },
    { name: '기간 정보', values: [getParam('period') || '-'] },
  ]
  const selected = plans.find((plan) => plan.id === selectedPlan) ?? plans[0]

  if (!insuranceType || !insuranceName) {
    return (
      <main className="p-8 text-center">
        <p className="mb-4">먼저 보험 상품을 선택해 주세요.</p>
        <Link href="/" className="font-semibold text-[#218df0]">보험 상품 찾기</Link>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-[#f5f7fa] px-5 py-7 text-[#17191d] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1480px]">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[#76808c]">
        <div className='justify-end'>
          <Button type="button" className='text-base' onClick={() => router.push('/')}><ChevronLeft/>뒤로가기</Button>
        </div>
          <span>보험 비교</span><span className="text-[#c2c8d0]">/</span>
          <span className="font-semibold text-[#242830]">{insuranceType}</span>
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="min-w-0">
           <SeletedInsurance
             insuranceType={insuranceType}
             insuranceName={insuranceName}
             insuredName={insuredName}
             startDate={getParam('startDate')}
             endDate={getParam('endDate')}
           />
            <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold tracking-normal">내게 맞는 보장을 선택하세요</h2>
                <p className="mt-1 text-sm text-[#77808b]">보장 내용과 보험료를 한눈에 비교할 수 있어요.</p>
              </div>
              <button type="button" onClick={() => setDetailsOpen(true)} className="inline-flex items-center gap-1.5 rounded-md px-2 py-2 text-sm font-semibold text-[#4e5967] hover:bg-white hover:text-[#1685e8]">
                <Info size={16} /> 보장내용 자세히 보기
              </button>
            </div>

           <SelectedPlan
             plans={plans}
             coverages={coverages}
             selectedPlan={selectedPlan}
             onPlanChange={setSelectedPlan}
           />
            <p className="mt-3 flex items-start gap-1.5 text-xs leading-5 text-[#8a939e]"><Info size={14} className="mt-0.5 shrink-0" /> 보험료와 보장 내용은 선택한 조건에 따라 달라질 수 있습니다.</p>
          </section>
          <DriverInsuranceWidget
            insuranceType={insuranceType}
            insuranceName={insuranceName}
            insuredName={insuredName}
            planName={selected.name}
            price={selected.price}
          />
        </div>
      </div>

      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101820]/45 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetailsOpen(false) }}>
          <section role="dialog" aria-modal="true" aria-labelledby="coverage-dialog-title" className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <div><p className="mb-1 text-xs font-bold text-[#218df0]">보장 안내</p><h2 id="coverage-dialog-title" className="text-xl font-extrabold">{insuranceType} 보장내용</h2></div>
              <button type="button" aria-label="닫기" onClick={() => setDetailsOpen(false)} className="flex size-9 items-center justify-center rounded-full text-[#69737f] hover:bg-[#f1f4f7]"><X size={19} /></button>
            </div>
            <div className="space-y-4 text-sm leading-6 text-[#56606c]">
              <p><strong className="text-[#252a31]">보험사</strong><br />{getParam('company') || '-'}</p>
              <p><strong className="text-[#252a31]">상품 유형</strong><br />{getParam('productType') || '-'}</p>
              {coverages.map((coverage) => (
                <p key={coverage.name}><strong className="text-[#252a31]">{coverage.name}</strong><br />{coverage.values[plans.findIndex((plan) => plan.id === selected.id)] ?? '-'}</p>
              ))}
              <p><strong className="text-[#252a31]">기간 정보</strong><br />{getParam('period') || '-'}</p>
            </div>
            <button type="button" onClick={() => setDetailsOpen(false)} className="mt-7 min-h-11 w-full rounded-lg bg-[#218df0] text-sm font-bold text-white hover:bg-[#087bdc]">확인</button>
          </section>
        </div>
      )}
    </main>
  )
}
