import { Brain, CarFront, HeartPulse, Luggage, PawPrint, PiggyBank } from 'lucide-react'

export const categories = [
  { id: 'cancer', label: '암보험', icon: Brain, iconStyle: 'bg-[#fff0ed] text-[#d65e51]' },
  { id: 'car', label: '자동차보험', icon: CarFront, iconStyle: 'bg-[#eaf3ff] text-[#218df0]' },
  { id: 'annuity', label: '연금보험', icon: PiggyBank, iconStyle: 'bg-[#fff5df] text-[#bd8423]' },
  { id: 'medical', label: '실손보험', icon: HeartPulse, iconStyle: 'bg-[#e8f6ef] text-[#25835a]' },
  { id: 'travel', label: '여행보험', icon: Luggage, iconStyle: 'bg-[#e8f5f5] text-[#288b8e]' },
  { id: 'pet', label: '반려동물보험', icon: PawPrint, iconStyle: 'bg-[#fff1e6] text-[#ca7430]' },
] as const
