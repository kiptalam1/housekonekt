import { Loader2 } from "lucide-react";

import { AVATAR_PLACEHOLDER_SVG, formatDateTime } from "../../utils/common";
import { useOutletContext } from "react-router-dom";
import type { AdminOutletContext } from "../../pages/Admin";

const AdminUsers = () => {
	const { users, loadingUsers,  } =
		useOutletContext<AdminOutletContext>();

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
									No users yet...
								</td>
							</tr>
						)}
						{!loadingUsers &&
							users &&
							users.length > 0 &&
							users.map((u) => (
								<tr
									key={u.id}
									className={`border-b border-[var(--border-muted)] text-s 
								}`}>
									<td className="p-1">
										<img
											src={u.avatarUrl ?? AVATAR_PLACEHOLDER_SVG}
											alt="avatar"
											loading="lazy"
											className="w-10 h-10 rounded-full object-cover"
										/>
									</td>
									<td className="p-1 whitespace-nowrap">{u.username}</td>
									<td className="p-1 text-sm whitespace-nowrap">{u.email}</td>
									<td className="p-1 whitespace-nowrap">
										{u.role.toLocaleLowerCase()}
									</td>
									<td
										className={`p-1 text-center ${
											u.isVerified ? "text-green-600" : "text-red-600"
										}`}>
										{u.isVerified ? "Yes" : "No"}
									</td>
									<td className="p-1 whitespace-nowrap">{u.phone ?? "-"}</td>
									<td className="p-1 text-sm max-w-[200px] truncate">
										{u.bio ?? "-"}
									</td>
									<td className="p-1 text-xs whitespace-nowrap">
										{formatDateTime(u.lastLogin)}
									</td>
									<td className="p-1 text-center">{u._count.sentMessages}</td>
									<td className="p-1 text-center">
										{u._count.receivedMessages}
									</td>
									<td className="p-1 whitespace-nowrap text-xs">
										{u.createdAt.split("T")[0]}
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</section>
	);
};

export default AdminUsers;
