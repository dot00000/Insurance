"use client";

import { useQuery } from "@tanstack/react-query";
import type { MedicalInsuranceResult } from "./medical.type";

export const medicalInsuranceQueryKey = (pageNo: number) => ["medical-insurance", pageNo] as const;

export function useMedicalInsuranceQuery(pageNo: number, enabled = true) {
	return useQuery<MedicalInsuranceResult, Error>({
		queryKey: medicalInsuranceQueryKey(pageNo),
		enabled,
		queryFn: async () => {
			const response = await fetch(`/api/medical?pageNo=${pageNo}`);

			if (!response.ok) {
				throw new Error("의료 보험 정보를 불러오지 못했습니다.");
			}

			return response.json() as Promise<MedicalInsuranceResult>;
		},
	});
}
