import axios from "axios";

import type {
	MedicalApiResponse,
	MedicalInsuranceResult,
} from "./medical.type";

const BASE_URL =
	"https://apis.data.go.kr/1160100/service/GetMedicalReimbursementInsuranceInfoService";
const OPERATION_NAME = "getInsuranceInfo";

export async function getMedicalInsuranceInfo(pageNo = 1): Promise<MedicalInsuranceResult> {
	const serviceKey = process.env.NEXT_PUBLIC_INSURANCE_NEXT_KEY;

	if (!serviceKey) {
		throw new Error("INSURANCE_NEXT_KEY값이 없습니다.");
	}

	try {
		const { data } = await axios.get<MedicalApiResponse>(
			`${BASE_URL}/${OPERATION_NAME}`,
			{
			params: {
				serviceKey,
				pageNo,
				numOfRows: 10,
				resultType: "json",
			},
			headers: {
				Accept: "application/json",
			},
			},
		);

		const items = data.response?.body?.items?.item;
		const responsePageNo = data.response?.body?.pageNo ?? pageNo;

		if (!items) {
			return { pageNo: responsePageNo, items: [] };
		}

		return { pageNo: responsePageNo, items: Array.isArray(items) ? items : [items] };
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.warn(
				`Medical API fetch failed: ${error.response?.status ?? "unknown"} ${error.message}`,
			);
			throw new Error(
				`Medical API fetch failed: ${error.response?.status ?? "unknown"}`,
			);
		} else {
			console.warn("Medical API request failed:", error);
			throw error;
		}
	}
}
