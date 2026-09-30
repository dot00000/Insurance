type InsuranceWidgetProps = {
  insuranceType: string
  insuranceName: string
  insuredName: string
  planName: string
  price: string
}

export default function InsuranceWidget({ insuranceType, insuranceName, insuredName, planName, price }: InsuranceWidgetProps) {
  return (
    <aside className="xl:sticky xl:top-6">
      <div className="rounded-xl border border-[#e4e8ed] bg-white p-6 shadow-[0_3px_12px_rgba(25,38,55,0.05)] sm:p-7">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-normal">{insuranceType}</h2>
          <span className="rounded-full bg-[#f0f6fc] px-2.5 py-1 text-[11px] font-bold text-[#218df0]">선택 플랜</span>
        </div>
        <div className="space-y-4 border-b border-[#edf0f3] pb-5">
          <div>
            <div className="mb-1 text-xs font-medium text-[#8a939e]">보험 이름</div>
            <div className="text-sm font-bold leading-5">{insuranceName}</div>
          </div>
          <div>
            <div className="mb-1 text-xs font-medium text-[#8a939e]">가입자 정보</div>
            <div className="text-sm font-bold">{insuredName}</div>
          </div>
          <p className="text-xs leading-5 text-[#83909f]">보험의 보장내용, 상품설명서, 보험약관의 주요 내용을 모두 확인했습니다.</p>
        </div>
        <div className="mt-5 flex items-center justify-between rounded-lg border border-[#252a31] px-3.5 py-3.5">
          <span className="text-sm font-bold">총 보험료</span>
          <span className="text-lg font-extrabold tabular-nums"><span className="text-[#218df0]">{price}</span><span className="ml-1 text-sm">원</span></span>
        </div>
        <button type="button" className="mt-4 flex min-h-12 w-full items-center justify-center rounded-full bg-[#218df0] px-4 text-base font-bold text-white transition-colors hover:bg-[#087bdc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#218df0]">
          가입하기
        </button>
        <div className="mt-3 text-center text-xs text-[#87919d]">{planName} 플랜 선택됨</div>
      </div>
    </aside>
  )
}
