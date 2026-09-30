import annuity from '@/data/annuity-insurance.json'
import cancer from '@/data/cancer-insurance.json'
import car from '@/data/car-insurance.json'
import pet from '@/data/pet-insurance.json'
import travel from '@/data/travel-insurance.json'
import type { PlanId } from '@/components/common/PlanGrid'
import { formatAmount } from '@/utils/insuranceFormat'

type MockPlan = {
  id: string
  name: string
  description: string
  mlInsRt?: string
  fmlInsRt?: string
  totalPremium?: string
  coverages: { name: string; value: string }[]
}

type MockProduct = { prdNm: string; cmpyNm: string; plans: MockPlan[] }
const products: Record<string, MockProduct[]> = {
  annuity: annuity.response.body.items.item,
  cancer: cancer.response.body.items.item,
  car: car.response.body.items.item,
  pet: pet.response.body.items.item,
  travel: travel.response.body.items.item,
}

export function getInsurancePlans(category: string, productIndex: string, gender: string, productName: string, company: string) {
  if (!/^\d+$/.test(productIndex) || (gender !== 'male' && gender !== 'female')) return null
  const product = products[category]?.[Number(productIndex)]
  if (!product || product.prdNm !== productName || product.cmpyNm !== company) return null

  const planIds: PlanId[] = ['light', 'standard', 'premium']
  const plans = planIds.flatMap((id) => {
    const plan = product.plans.find((item) => item.id === id)
    if (!plan) return []
    return [{
      id,
      name: plan.name,
      description: plan.description,
      price: formatAmount((gender === 'male' ? plan.mlInsRt : plan.fmlInsRt) ?? plan.totalPremium),
    }]
  })
  const coverageNames = [...new Set(product.plans.flatMap((plan) => plan.coverages.map((coverage) => coverage.name)))]
  const coverages = coverageNames.map((name) => ({
    name,
    values: plans.map((plan) => product.plans.find((item) => item.id === plan.id)?.coverages.find((coverage) => coverage.name === name)?.value ?? '-'),
  }))
  return { plans, coverages }
}
