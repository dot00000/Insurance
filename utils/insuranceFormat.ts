export function formatRate(value: string | number | null | undefined): string {
	return value === null || value === undefined
		? "-"
		: Number(value).toLocaleString();
}

export function formatAmount(value: string | number | null | undefined): string {
	if (value === undefined || value === null || value === "") return "-";
	return Number(value).toLocaleString("ko-KR");
}

export function getMinimumDriverAge(limit: string | undefined): number | null {
	const match = limit?.match(/만\s*(\d+)\s*세/);
	return match ? Number(match[1]) : null;
}

export function getMaximumEnrollmentAge(range: string | undefined): number | null {
	const match = range?.match(/만\s*(\d+)\s*세/);
	return match ? Number(match[1]) : null;
}