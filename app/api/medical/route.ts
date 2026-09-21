import { getMedicalInsuranceInfo } from "@/api/medical/medical.api";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	try {
		const pageNo = Number(new URL(request.url).searchParams.get("pageNo") ?? 1);
		const result = await getMedicalInsuranceInfo(Number.isFinite(pageNo) && pageNo > 0 ? pageNo : 1);

		return Response.json(result);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Medical API request failed";

		return Response.json({ message }, { status: 502 });
	}
}