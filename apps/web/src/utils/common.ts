export const PLACEHOLDER_SVG =
	"data:image/svg+xml;utf8," +
	encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <rect width="100%" height="100%" fill="#f3f4f6"/>
    <rect x="48" y="48" width="704" height="400" rx="10" fill="#e5e7eb"/>
    <g fill="#d1d5db" opacity="0.9">
      <rect x="64" y="480" width="160" height="18" rx="4"/>
      <rect x="240" y="480" width="160" height="18" rx="4"/>
      <rect x="416" y="480" width="160" height="18" rx="4"/>
    </g>
    <text x="50%" y="310" font-family="Inter,Arial" font-size="28" font-weight="700" fill="#6b7280" text-anchor="middle">
      Image Coming Soon
    </text>
  </svg>`);

export type Property = {
	id: string;
	title: string;
	price: number;
	location: string;
	units: number;
	description: string;
	amenities: string[];
	createdAt: string;
	updatedAt: string | null;
	images: string[];
	status: "AVAILABLE" | "FULL";
	type:
		| "BEDSITTER"
		| "STUDIO"
		| "ONE_BEDROOM"
		| "TWO_BEDROOM"
		| "THREE_BEDROOM"
		| "MAISONETTE"
		| "TOWNHOUSE"
		| "BUNGALOW"
		| "SERVICED_APARTMENT"
		| "VILLA";
	deletedAt: string | null;
	views: number;
	ownerId: string;
	owner: {
		id: string;
		username: string;
		email: string;
		role: "ADMIN" | "USER" | "OWNER";
		createdAt: string;
		avatarUrl?: string;
		bio?: string;
		isVerified: boolean;
		phone?: string;
	};
	propertyView?: {
		id: string;
		propertyId: string;
		visitorId: string;
		viewedAt: string;
	};
};
