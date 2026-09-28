const insuranceLogoPrefixes: [string, string][] = [
	["kb", "/ci/kb.svg"],
	["한화", "/ci/hanwha.svg"],
	["흥국", "/ci/heungkuk.svg"],
	["현대", "/ci/hyundai.svg"],
	["교보", "/ci/kyobo.svg"],
	["메리츠", "/ci/meritz.svg"],
	["농협", "/ci/nh.svg"],
	["nh", "/ci/nh.svg"],
	["삼성", "/ci/samsung.svg"],
	["신한", "/ci/shinhanez.svg"],
	["동양", "/ci/tongyang.svg"],
	["롯데", "/ci/lotte.png"],
	["db", "/ci/db.svg"],
];

export function filterImages(companyName: string | null | undefined): string | null {
	const normalizedName = companyName?.trim().toLocaleLowerCase();

	if (!normalizedName) return null;

	return (
		insuranceLogoPrefixes.find(([prefix]) => normalizedName.startsWith(prefix.toLocaleLowerCase()))?.[1] ??
		null
	);
}
