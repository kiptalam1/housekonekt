import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendEmail = async (
	from: string,
	to: string | string[],
	subject: string,
	html: string
): Promise<boolean> => {
	try {
		const { error } = await resend.emails.send({ from, to, subject, html });
		if (error) {
			console.error("Email send error:", error);
			return false;
		}
		return true;
	} catch (err) {
		console.error("Resend API request failed:", err);
		return false;
	}
};
