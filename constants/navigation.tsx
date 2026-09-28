import {
	Bell,
	Brain,
	Car,
	Handshake,
	House,
	Luggage,
	PawPrint,
	PiggyBank,
	Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavigationItem = {
	url: string;
	name: string;
	icon: LucideIcon;
};

export const navigation: NavigationItem[] = [
	{ url: "/", name: "홈", icon: House },
	{ url: "/cancer", name: "암보험", icon: Brain },
	{ url: "/car", name: "자동차보험", icon: Car },
	{ url: "/annuity", name: "연금보험", icon: PiggyBank },
	{ url: "/medical", name: "실손보험", icon: Handshake },
	{ url: "/travel", name: "여행보험", icon: Luggage },
	{ url: "/pet", name: "반려동물보험", icon: PawPrint },
	{ url: "/notice", name: "공지사항", icon: Bell },
	{ url: "/setting", name: "설정", icon: Settings },

];
