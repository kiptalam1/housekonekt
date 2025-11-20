import { Edit, Loader2, Trash2 } from "lucide-react";

import {
	AVATAR_PLACEHOLDER_SVG,
	formatDateTime,
	handleError,
} from "../../utils/common";
import { useOutletContext } from "react-router-dom";
import type { AdminOutletContext, User } from "../../pages/Admin";
import api from "../../api";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import UpdateUserModal from "../modals/UpdateUserModal";

const AdminUsers = () => {
	const { users: outletUsers, loadingUsers } =
		useOutletContext<AdminOutletContext>();
	const [users, setUsers] = useState<User[]>(outletUsers ?? []);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
	const [updatingUser, setUpdatingUser] = useState<User | null>(null);
	const [modalOpen, setModalOpen] = useState(false);

	useEffect(() => {
		if (outletUsers) setUsers(outletUsers);
	}, [outletUsers]);

	async function handleDeleteUser(id: string) {
		setDeletingId(id);
		try {
			const { data } = await api.patch(`/admin/user/${id}/delete`);
			// if (!data.data) throw new Error("Failed to delete user");
			toast.success(data.message);
			setDeletedIds((prev) => new Set([...prev, id]));
		} catch (error) {
			console.error("Error deleting user", error);
			toast.error(handleError(error));
		} finally {
			setDeletingId(null);
		}
	}

	const handleUpdateUser = (updated: User) => {
		setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
		setModalOpen(false);
	};

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
							<th className="p-1 text-left font-bold whitespace-nowrap">
								Avatar
							</th>
							<th className="p-1 text-left font-bold whitespace-nowrap">
								Name
							</th>
							<th className="p-1 text-left font-bold whitespace-nowrap">
								Email
							</th>
							<th className="p-1 text-left font-bold whitespace-nowrap">
								Role
							</th>
							<th className="p-1 text-left font-bold whitespace-nowrap">
								Verified
							</th>
							<th className="p-1 text-left font-bold whitespace-nowrap">
								Phone
							</th>
							<th className="p-1 text-left font-bold whitespace-nowrap">Bio</th>
							<th className="p-1 text-left font-bold whitespace-nowrap">
								Last Login
							</th>
							<th className="p-1 text-left font-bold whitespace-nowrap">
								Sent Messages
							</th>
							<th className="p-1 text-left font-bold whitespace-nowrap">
								Received Messages
							</th>
							<th className="p-1 text-left font-bold whitespace-nowrap">
								Joined
							</th>
							<th className="p-1 text-left font-bold">Actions</th>
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
									className={`border-b border-[var(--border-muted)] text-s ${
										u.deletedAt !== null || deletedIds.has(u.id)
											? "line-through text-[var(--border)] text-sm"
											: ""
									} 
								`}>
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
										} ${u.deletedAt !== null ? "text-[var(--border)]" : ""}`}>
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

									<td className="p-1 text-xs text-center gap-4 space-x-4">
										<button
											type="button"
											aria-label="update"
											onClick={() => {
												setModalOpen(true);
												setUpdatingUser(u);
											}}
											className="cursor-pointer text-blue-500 hover:text-blue-800 disabled:text-blue-950 disabled:cursor-not-allowed">
											<Edit size={24} />
										</button>

										<button
											type="button"
											aria-label="delete"
											onClick={() => handleDeleteUser(u.id)}
											disabled={
												deletingId === u.id ||
												u.deletedAt !== null ||
												deletedIds.has(u.id)
											}
											className="cursor-pointer text-red-500 hover:text-red-800 disabled:text-red-950 disabled:cursor-not-allowed">
											{deletingId === u.id ? (
												<Loader2 size={24} className="animate-spin" />
											) : (
												<Trash2 size={24} />
											)}
										</button>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
			{updatingUser && (
				<UpdateUserModal
					open={modalOpen}
					onClose={() => setModalOpen(false)}
					updateData={{
						id: updatingUser.id,
						username: updatingUser.username,
						email: updatingUser.email,
						role: updatingUser.role,
						phone: updatingUser.phone ?? undefined,
						bio: updatingUser.bio ?? undefined,
						avatarUrl: updatingUser.avatarUrl ?? null,
					}}
					onUpdate={handleUpdateUser}
				/>
			)}
		</section>
	);
};

export default AdminUsers;
