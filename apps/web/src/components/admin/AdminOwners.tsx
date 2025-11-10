import { Loader2 } from "lucide-react";
import {  useMemo } from "react";
import { AVATAR_PLACEHOLDER_SVG, formatDateTime } from "../../utils/common";
import { useOutletContext } from "react-router-dom";
import type { AdminOutletContext } from "../../pages/Admin";

const AdminOwners = () => {
	const { users, loadingUsers } = useOutletContext<AdminOutletContext>();

	const owners = useMemo(
		() => users?.filter((u) => u.role === "OWNER") ?? [],
		[users]
	);

	return (
		<section className="w-full mx-auto">
			{loadingUsers && (
				<div className="flex justify-center text-[var(--primary)] animate-spin mt-5">
					<Loader2 size={20} />
				</div>
			)}
			<div className="w-full overflow-x-auto">
				<table className="w-full table-auto border-collapse">
					<thead className="bg-[var(--bg-light)] border-b border-[var(--primary)] overflow-x-auto">
						<tr>
							<th className="p-1 text-left font-semibold whitespace-nowrap">
								Avatar
							</th>
							<th className="p-1 text-left font-semibold whitespace-nowrap">
								Name
							</th>
							<th className="p-1 text-left font-semibold whitespace-nowrap">
								Email
							</th>
							<th className="p-1 text-left font-semibold whitespace-nowrap">
								Role
							</th>
							<th className="p-1 text-left font-semibold whitespace-nowrap">
								Verified
							</th>
							<th className="p-1 text-left font-semibold whitespace-nowrap">
								Phone
							</th>
							<th className="p-1 text-left font-semibold whitespace-nowrap">
								Bio
							</th>
							<th className="p-1 text-left font-semibold whitespace-nowrap">
								Last Login
							</th>
							<th className="p-1 text-left font-semibold whitespace-nowrap">
								Properties
							</th>
							<th className="p-1 text-left font-semibold whitespace-nowrap">
								Sent Messages
							</th>
							<th className="p-1 text-left font-semibold whitespace-nowrap">
								Received Messages
							</th>
							<th className="p-1 text-left font-semibold whitespace-nowrap">
								Joined
							</th>
						</tr>
					</thead>
					<tbody className="overflow-x-auto">
						{!loadingUsers && users?.length === 0 && (
							<tr>
								<td
									colSpan={11}
									className="text-[var(--text-muted)] text-lg italic">
									No owners yet...
								</td>
							</tr>
						)}
						{!loadingUsers &&
							users &&
							users.length > 0 &&
							owners.map((o) => (
								<tr
									key={o.id}
									className={`border-b border-[var(--border-muted)] text-s 
								}`}>
									<td className="p-1">
										<img
											src={o.avatarUrl ?? AVATAR_PLACEHOLDER_SVG}
											alt="avatar"
											loading="lazy"
											className="w-10 h-10 rounded-full object-cover"
										/>
									</td>
									<td className="p-1 whitespace-nowrap">{o.username}</td>
									<td className="p-1 text-sm whitespace-nowrap">{o.email}</td>
									<td className="p-1 whitespace-nowrap text-xs text-[var(--text-muted)]">
										{o.role.toLocaleLowerCase()}
									</td>
									<td
										className={`p-1 text-center ${
											o.isVerified ? "text-green-600" : "text-red-600"
										}`}>
										{o.isVerified ? "Yes" : "No"}
									</td>
									<td className="p-1 whitespace-nowrap">{o.phone ?? "-"}</td>
									<td className="p-1 text-sm max-w-[200px] truncate">
										{o.bio ?? "-"}
									</td>
									<td className="p-1 text-xs whitespace-nowrap">
										{formatDateTime(o.lastLogin)}
									</td>
									<td className="p-1 text-center">{o._count.properties}</td>
									<td className="p-1 text-center">{o._count.sentMessages}</td>
									<td className="p-1 text-center">
										{o._count.receivedMessages}
									</td>
									<td className="p-1 whitespace-nowrap text-xs">
										{o.createdAt.split("T")[0]}
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</section>
	);
};

export default AdminOwners;
