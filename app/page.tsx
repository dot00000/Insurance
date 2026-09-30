'use client'

import annuityInsurance from '@/data/annuity-insurance.json'
import cancerInsurance from '@/data/cancer-insurance.json'
import carInsurance from '@/data/car-insurance.json'
import petInsurance from '@/data/pet-insurance.json'
import travelInsurance from '@/data/travel-insurance.json'
import { CommonPagination } from '@/components/common/CommonPagination'
import { CommonCalendar } from '@/components/common/CommonCalendar'
import CommonTable, { type CommonTableColumn, type CommonTableRow } from '@/components/common/CommonTable'
import { useMedicalInsuranceQuery } from '@/api/medical/medical.query'
import { getMaximumEnrollmentAge, getMinimumDriverAge, formatAmount } from '@/utils/insuranceFormat'
import { UserRound } from 'lucide-react'
import CategoryImage from '@/components/CategoryImage'
import { categories } from '@/utils/insuranceCategories'
import dayjs from 'dayjs'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export { categories } from '@/utils/insuranceCategories'

type CategoryId = (typeof categories)[number]['id']
type Gender = 'male' | 'female'
type FinderFormValues = { name: string; birthDate: string; startDate: string; endDate: string; gender: Gender | '' }
type InsuranceItem = {
  cmpyCd?: string | null
  cmpyNm?: string | null
  prdNm?: string | null
  ptrn?: string | null
  mog?: string | null
  age?: string | number | null
  mlInsRt?: string | number | null
  fmlInsRt?: string | number | null
  totalPremium?: string | number | null
  basePremium?: string | number | null
  maxEnrollmentAge?: string | number | null
  enrollmentAgeRange?: string | null
  driverAgeLimit?: string | null
  paymentPeriodYears?: string | number | null
  guaranteedPeriodYears?: string | number | null
  tripDays?: string | number | null
  annuityStartAge?: string | number | null
}

const insuranceData: Record<CategoryId, InsuranceItem[]> = {
  cancer: cancerInsurance.response.body.items.item,
  car: carInsurance.response.body.items.item,
  annuity: annuityInsurance.response.body.items.item,
  medical: [],
  travel: travelInsurance.response.body.items.item,
  pet: petInsurance.response.body.items.item,
}

const rowsPerPage = 10

function calculateAge(birthDate: string) {
  if (!birthDate) return null

  const birth = dayjs(birthDate)
  if (!birth.isValid() || birth.isAfter(dayjs(), 'day')) return null

  return dayjs().diff(birth, 'year')
}

function isEligible(item: InsuranceItem, category: CategoryId, age: number) {
  if (category === 'car') {
    const minimumAge = getMinimumDriverAge(item.driverAgeLimit ?? undefined)
    return minimumAge === null || age >= minimumAge
  }

  if (category === 'pet') {
    const maximumAge = getMaximumEnrollmentAge(item.enrollmentAgeRange ?? undefined)
    return maximumAge === null || age <= maximumAge
  }

  if (category === 'annuity') {
    const maximumAge = Number(item.maxEnrollmentAge)
    return !Number.isFinite(maximumAge) || age <= maximumAge
  }

  if (category === 'cancer' || category === 'medical') {
    const maximumAge = Number(item.age)
    return !Number.isFinite(maximumAge) || age <= maximumAge
  }

  return true
}

function getPremium(item: InsuranceItem, gender: Gender) {
  return gender === 'male'
    ? item.mlInsRt ?? item.totalPremium ?? item.basePremium
    : item.fmlInsRt ?? item.totalPremium ?? item.basePremium
}

function getPeriod(item: InsuranceItem) {
  if (item.paymentPeriodYears) return `${item.paymentPeriodYears}년 납입`
  if (item.guaranteedPeriodYears) return `${item.guaranteedPeriodYears}년 보증`
  if (item.tripDays) return `${item.tripDays}일`
  if (item.annuityStartAge) return `${item.annuityStartAge}세 개시`
  return '상품별 상이'
}

export default function Home() {
  const router = useRouter()
  const [category, setCategory] = useState<CategoryId>('car')
  const [submittedInfo, setSubmittedInfo] = useState<FinderFormValues | null>(null)
  const [pageNo, setPageNo] = useState(1)
  const { register, control, getValues, handleSubmit, formState: { errors } } = useForm<FinderFormValues>({
    defaultValues: { name: '', birthDate: '', startDate: '', endDate: '', gender: '' },
  })
  const startDate = useWatch({ control, name: 'startDate' })
  const earliestPolicyDate = dayjs().startOf('day')
  const latestPolicyDate = dayjs().add(10, 'year').endOf('day')
  const medicalQuery = useMedicalInsuranceQuery(1, category === 'medical' && submittedInfo !== null)
  const categoryData = category === 'medical'
    ? medicalQuery.data?.items as InsuranceItem[] | undefined ?? []
    : insuranceData[category]
  const activeCategory = categories.find((item) => item.id === category)!
  
  const age = submittedInfo ? calculateAge(submittedInfo.birthDate) : null
  const gender = submittedInfo?.gender || null

  const eligibleItems = age === null ? [] : categoryData.filter((item) => isEligible(item, category, age))
  const resultRows: CommonTableRow[] = eligibleItems.map((item, index) => ({
    id: `${category}-${item.cmpyCd ?? 'company'}-${index}`,
    productIndex: categoryData.indexOf(item),
    company: item.cmpyNm ?? '-',
    product: item.prdNm ?? '-',
    type: item.ptrn ?? '-',
    coverage: item.mog ?? '-',
    period: getPeriod(item),
    premium: formatAmount(gender ? getPremium(item, gender) : item.totalPremium ?? item.basePremium),
  }))
  const totalPages = Math.ceil(resultRows.length / rowsPerPage)
  const visibleRows = resultRows.slice((pageNo - 1) * rowsPerPage, pageNo * rowsPerPage)
  const columns: CommonTableColumn[] = [
    { key: 'company', label: '보험사', className: 'whitespace-nowrap font-medium text-[#333d49]' },
    { key: 'product', label: '상품명', className: 'min-w-56 font-semibold text-[#202833]' },
    { key: 'type', label: '상품 유형', className: 'min-w-36' },
    { key: 'coverage', label: '주요 보장', className: 'min-w-40' },
    { key: 'period', label: '기간 정보', className: 'whitespace-nowrap' },
    {
      key: 'premium',
      label: gender === 'male' ? '남성 보험료 (원)' : '여성 보험료 (원)',
      className: 'whitespace-nowrap text-right font-bold text-[#218df0]',
      headerClassName: 'whitespace-nowrap text-right',
    },
  ]

  function selectInsurance(row: CommonTableRow) {
    if (!submittedInfo) return

    const params = new URLSearchParams({
      category,
      productIndex: String(row.productIndex),
      gender: submittedInfo.gender,
      insuranceType: activeCategory.label,
      insuranceName: String(row.product ?? ''),
      company: String(row.company ?? ''),
      insuredName: submittedInfo.name,
      startDate: submittedInfo.startDate,
      endDate: submittedInfo.endDate,
      price: String(row.premium ?? '-'),
      coverage: String(row.coverage ?? '-'),
      productType: String(row.type ?? '-'),
      period: String(row.period ?? '-'),
    })
    router.push(`/main?${params.toString()}`)
  }

  function submitSearch(values: FinderFormValues) {
    setSubmittedInfo(values)
    setPageNo(1)
  }

  function clearResults() {
    setSubmittedInfo(null)
  }

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-[#f5f7fa] px-5 py-7 text-[#17191d] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1480px]">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[#76808c]">
          <span>보험 비교</span><span className="text-[#c2c8d0]">/</span>
          <span className="font-semibold text-[#242830]">맞춤 보험 찾기</span>
        </div>

        <h1 className="mb-5 text-2xl font-bold text-[#202833] sm:text-3xl">나에게 맞는 보험을 찾아보세요</h1>
        {/* 보험 카테고리 */}
        <nav aria-label="보험 카테고리" className="mb-6 grid grid-cols-3 overflow-hidden rounded-xl border border-[#e1e6ec] bg-white sm:grid-cols-6">
          {categories.map((item) => {
            const Icon = item.icon
            const active = category === item.id
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setCategory(item.id)
                  setPageNo(1)
                }}
                className={`flex min-h-24 flex-col items-center justify-center gap-2 border-b-2 px-2 py-3 text-center transition-colors ${active ? 'border-[#218df0] bg-[#f7fbff] text-[#174a78]' : 'border-transparent text-[#626d79] hover:bg-[#fafbfd]'}`}
              >
                <span className={`flex size-10 items-center justify-center rounded-lg ${item.iconStyle}`}><Icon size={23} strokeWidth={1.8} /></span>
                <span className="text-xs font-semibold sm:text-sm">{item.label}</span>
              </button>
            )
          })}
        </nav>
        {/* 가입자 정보 입력 */}
        <div className="mb-10 grid items-stretch gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
          <form onSubmit={handleSubmit(submitSearch)} noValidate className="rounded-xl border border-[#e1e6ec] bg-white p-5 shadow-[0_2px_8px_rgba(25,38,55,0.03)] sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-lg bg-[#eff6ff] text-[#218df0]"><UserRound size={23} /></span>
              <h2 className="text-lg font-bold text-[#202833]">가입자 정보</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-[#424c58]">
                이름
                <input
                  {...register('name', { required: '이름을 입력해 주세요.', onChange: clearResults })}
                  aria-invalid={Boolean(errors.name)}
                  placeholder="이름을 입력해 주세요"
                  className={`mt-2 h-12 w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-normal text-[#202833] shadow-sm outline-none transition-colors hover:border-slate-300 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-100 ${errors.name ? 'border-[#c4483d]' : 'border-slate-200'}`}
                />
                {errors.name && <span role="alert" className="mt-1 block text-xs font-medium text-[#c4483d]">{errors.name.message}</span>}
              </label>
              <div className="text-sm font-semibold text-[#424c58]">
                <Controller
                  name="birthDate"
                  control={control}
                  rules={{
                    required: '생년월일을 입력해 주세요.',
                    validate: (value) => calculateAge(value) !== null || '유효한 생년월일을 입력해 주세요.',
                  }}
                  render={({ field }) => (
                    <>
                      <CommonCalendar
                        value={field.value ? dayjs(field.value).toDate() : null}
                        onDateChange={(date) => { field.onChange(dayjs(date).format('YYYY-MM-DD')); clearResults() }}
                        label="생년월일"
                        showAge={false}
                        isInvalid={Boolean(errors.birthDate)}
                        ariaDescribedBy={errors.birthDate ? 'birth-date-error' : undefined}
                        wrapperClassName="mt-7 w-full"
                        buttonHeightClassName="h-12"
                        buttonWidthClassName="w-full"
                      />
                      {errors.birthDate && <span id="birth-date-error" role="alert" className="mt-1 block text-xs font-medium text-[#c4483d]">{errors.birthDate.message}</span>}
                    </>
                  )}
                />
              </div>
            </div>

            <Controller
              name="gender"
              control={control}
              rules={{ required: '성별을 선택해 주세요.' }}
              render={({ field }) => (
                <fieldset className="mt-5">
                  <legend className="mb-2 text-sm font-semibold text-[#424c58]">성별</legend>
                  <div className="grid grid-cols-2 gap-3">
                    {(['male', 'female'] as const).map((value) => (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={field.value === value}
                        onClick={() => { field.onChange(value); clearResults() }}
                        className={`min-h-12 rounded-xl border shadow-sm mr-1 text-sm font-semibold transition-colors ${field.value === value ? 'border-[#218df0] bg-[#eff6ff] text-[#176fc0]' : 'border-[#dce2e8] bg-white text-[#65717e] hover:bg-[#f7f9fb]'}`}
                      >
                        {value === 'male' ? '남성' : '여성'}
                      </button>
                    ))}
                  </div>
                  {errors.gender && <p role="alert" className="mt-1 text-xs font-medium text-[#c4483d]">{errors.gender.message}</p>}
                </fieldset>
              )}
            />
            
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="text-sm font-semibold text-[#424c58]">
                <Controller
                  name="startDate"
                  control={control}
                  rules={{
                    required: '보험 시작일을 선택해 주세요.',
                    validate: (value) => (
                      dayjs(value).isValid() && !dayjs(value).isBefore(earliestPolicyDate, 'day')
                    ) || '오늘 이후 날짜를 선택해 주세요.',
                  }}
                  render={({ field }) => (
                    <>
                      <CommonCalendar
                        value={field.value ? dayjs(field.value).toDate() : null}
                        onDateChange={(date) => { field.onChange(dayjs(date).format('YYYY-MM-DD')); clearResults() }}
                        label="보험 시작일"
                        showAge={false}
                        minDate={earliestPolicyDate.toDate()}
                        maxDate={latestPolicyDate.toDate()}
                        disableFuture={false}
                        isInvalid={Boolean(errors.startDate)}
                        ariaDescribedBy={errors.startDate ? 'policy-start-error' : undefined}
                        wrapperClassName="mt-2 w-full"
                        buttonHeightClassName="h-12"
                        buttonWidthClassName="w-full"
                      />
                      {errors.startDate && <span id="policy-start-error" role="alert" className="mt-1 block text-xs font-medium text-[#c4483d]">{errors.startDate.message}</span>}
                    </>
                  )}
                />
              </div>
              <div className="text-sm font-semibold text-[#424c58]">
                <Controller
                  name="endDate"
                  control={control}
                  rules={{
                    required: '보험 종료일을 선택해 주세요.',
                    validate: (value) => {
                      const end = dayjs(value)
                      const start = dayjs(getValues('startDate'))
                      if (!end.isValid()) return '유효한 보험 종료일을 선택해 주세요.'
                      if (!start.isValid()) return '먼저 보험 시작일을 선택해 주세요.'
                      return !end.isBefore(start, 'day') || '보험 종료일은 시작일 이후여야 합니다.'
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <CommonCalendar
                        value={field.value ? dayjs(field.value).toDate() : null}
                        onDateChange={(date) => { field.onChange(dayjs(date).format('YYYY-MM-DD')); clearResults() }}
                        label="보험 종료일"
                        showAge={false}
                        minDate={startDate ? dayjs(startDate).toDate() : earliestPolicyDate.toDate()}
                        maxDate={latestPolicyDate.toDate()}
                        disableFuture={false}
                        isInvalid={Boolean(errors.endDate)}
                        ariaDescribedBy={errors.endDate ? 'policy-end-error' : undefined}
                        wrapperClassName="mt-2 w-full"
                        buttonHeightClassName="h-12"
                        buttonWidthClassName="w-full"
                      />
                      {errors.endDate && <span id="policy-end-error" role="alert" className="mt-1 block text-xs font-medium text-[#c4483d]">{errors.endDate.message}</span>}
                    </>
                  )}
                />
              </div>
            </div>

            <button type="submit" className="mt-5 flex min-h-12 w-full items-center justify-center rounded-xl shadow-sm bg-[#218df0] px-5 text-base font-bold text-white transition-colors hover:bg-[#087bdc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#218df0]">
              보험 상품 찾기
            </button>
          </form>
          {/* category 이미지 */}
          <CategoryImage activeCategory={activeCategory} />
        </div>

        <section className="min-w-0">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-normal">내게 맞는 보장을 선택하세요</h2>
              <p className="mt-1 text-sm text-[#77808b]">{submittedInfo ? `${submittedInfo.name}님 · 만 ${age ?? '-'}세 · ${gender === 'male' ? '남성' : '여성'} · 보험기간 ${dayjs(submittedInfo.startDate).format('YYYY.MM.DD')} ~ ${dayjs(submittedInfo.endDate).format('YYYY.MM.DD')}` : '가입자 정보를 입력하면 보험 상품을 확인할 수 있어요.'}</p>
            </div>
            {submittedInfo && <span className="text-sm font-semibold text-[#647180]">총 {resultRows.length.toLocaleString()}개 상품</span>}
          </div>

          {submittedInfo && category === 'medical' && medicalQuery.isLoading && <p className="rounded-xl border border-[#e1e6ec] bg-white p-8 text-center text-sm text-[#68727e]">실손보험 상품을 불러오는 중입니다.</p>}
          {submittedInfo && category === 'medical' && medicalQuery.isError && <p role="alert" className="rounded-xl border border-[#f0d2ce] bg-white p-8 text-center text-sm text-[#a6453b]">실손보험 상품을 불러오지 못했습니다.</p>}
          {submittedInfo && !(category === 'medical' && (medicalQuery.isLoading || medicalQuery.isError)) && resultRows.length > 0 && (
            <>
              <CommonTable
                name={`${submittedInfo.name}님 맞춤 ${activeCategory.label}`}
                columns={columns}
                rows={visibleRows}
                onRowClick={selectInsurance}
              />
              {totalPages > 1 && <div className="mt-5"><CommonPagination currentPage={pageNo} onPageChange={setPageNo} totalPages={totalPages} /></div>}
            </>
          )}
          {submittedInfo && !(category === 'medical' && (medicalQuery.isLoading || medicalQuery.isError)) && resultRows.length === 0 && (
            <div className="rounded-xl border border-[#e1e6ec] bg-white px-5 py-12 text-center text-sm text-[#68727e]">
              입력하신 조건에 맞는 상품이 없습니다.
            </div>
          )}
          {!submittedInfo && (
            <div className="rounded-xl border border-dashed border-[#ccd5df] bg-white px-5 py-12 text-center text-sm text-[#7b8692]">
              이름, 생년월일, 성별을 입력하고 보험 상품 찾기를 눌러주세요.
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
