import { Edit3, LoaderCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { AVATAR_PLACEHOLDER_SVG, formatIsoDate } from "../utils/common";
import { useEffect, useState } from "react";
import UpdateUserProfile from "../components/modals/UpdateUserProfile";
import type { UserType } from "../contexts/AuthContext";
// import type { UserType } from "../contexts/AuthContext";

const MyProfile = () => {
	const { user: contextUser, loading, refreshUser } = useAuth();
	const [modalOpen, setModalOpen] = useState(false);
	const [user, setUser] = useState(contextUser ?? null);

	useEffect(() => {
		setUser(contextUser ?? null);
	}, [contextUser]);

	useEffect(() => {
		refreshUser();
	}, [refreshUser]);

	const handleUpdateUser = (newUser: UserType) => {
		setModalOpen(false);
		setUser((prev) => (prev?.id === newUser.id ? newUser : prev));
		refreshUser();
	};

	return (
		<section className="py-6 w-full">
			{loading && !user && (
				<div className="flex items-center justify-center">
					<LoaderCircle size={24} color="#1481b8" className="animate-spin" />
				</div>
			)}
			{!loading && user && (
				<div className="flex flex-col gap-8 w-full">
					<h2 className="text-2xl md:text-3xl font-bold text-center text-[var(--primary)]">
						Profile
					</h2>
					<div className="self-center sm:self-start">
						<img
							src={user?.avatarUrl ?? AVATAR_PLACEHOLDER_SVG}
							alt={user.username}
							className="rounded-full border-2 border-[var(--primary)] w-[250px] h-[250px] object-cover"
						/>
					</div>
					<div className="px-4 space-y-2">
						<div className="flex items-center justify-between sm:justify-normal gap-40">
							<p className="text-sm text-[var(--info)] rounded-full border border-[var(--info)] w-fit px-2">
								{user?.role}
							</p>
							<span
								onClick={() => {
									setUser(user);
									setModalOpen(true);
								}}
								className="cursor-pointer hover:text-[var(--primary)] duration-150">
								<Edit3 size={20} />
							</span>
						</div>

						<p className="font-bold text-lg sm:text-xl">{user?.username}</p>
						<p className="font-semibold italic">{user.email}</p>

						{user?.phone ? (
							<p className="text-sm font-semibold">{user.phone}</p>
						) : (
							<p className="text-sm text-[var(--text-muted)] italic">
								No phone number yet
							</p>
						)}
						{user?.isVerified ? (
							<p className="text-xs text-green-400 rounded-full border border-green-400 w-fit px-2">
								verified
							</p>
						) : (
							<p className="text-xs text-red-400 rounded-full border border-red-400 w-fit px-2">
								not verified
							</p>
						)}
						{user?.bio ? (
							<p className="text-sm text-wrap wrap-break-word">{user?.bio}</p>
						) : (
							<p className="text-sm text-[var(--text-muted)] italic">No bio</p>
						)}
						<p className="text-sm text-[var(--text-muted)]">
							Joined in: {formatIsoDate(user?.createdAt)}
						</p>
						<p className="text-xs text-[var(--text-muted)] italic">
							Last logged in on: {formatIsoDate(user?.lastLogin)}
						</p>
					</div>
				</div>
			)}
			{user && (
				<UpdateUserProfile
					open={modalOpen}
					onClose={() => {
						setModalOpen(false);
					}}
					onUpdate={handleUpdateUser}
					updateData={{
						id: user!.id,
						email: user!.email,
						username: user!.username,
						role: user!.role,
						bio: user!.bio,
						phone: user!.phone,
						avatarUrl: user!.avatarUrl,
					}}
				/>
			)}
		</section>
	);
};

export default MyProfile;
