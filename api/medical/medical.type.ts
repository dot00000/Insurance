export type MedicalInsuranceItem = {
	pageNo?: number | string | null;
	cmpyNm?: string | null;
	mlInsRt?: number | string | null;
	fmlInsRt?: number | string | null;
	age?: number | string | null;
	prdNm?: string | null;
	ptrn?: string | null;
	[key: string]: string | number | null | undefined;
};

export type MedicalInsuranceResult = {
	pageNo: number;
	items: MedicalInsuranceItem[];
};

export type MedicalApiResponse = {
	response?: {
		body?: {
			items?: {
				item?: MedicalInsuranceItem | MedicalInsuranceItem[];
			};
			totalCount?: number;
			numOfRows?: number;
			pageNo?: number;
		};
		header?: {
			resultCode?: string;
			resultMsg?: string;
		};
	};
};
