import { SendHorizontal } from "lucide-react";

function Chat() {
	return (
		<div className="flex flex-col flex-1 px-2">
			<div className="w-full text-xl font-semibold py-2 px-5 h-12 border border-[var(--border)] text-center">
				evans
			</div>

			{/* chats */}
			<div className="flex-1 flex flex-col overflow-y-auto p-2">
				<div className="flex-1"></div>
				<form>
					<div className="flex items-center gap-2">
						<textarea
							name="input-message"
							id="input-message"
							placeholder="Type a message..."
							rows={1}
							onInput={(e) => {
								e.currentTarget.style.height = "auto";
								e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
							}}
							className="flex-1 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--bg-light)] px-4 py-2 text-lg placeholder:text-[var(--text-muted)] placeholder:text-sm placeholder:italic focus:ring-2 focus:ring-[var(--info)] focus:outline-none scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"></textarea>
						<button
							type="submit"
							aria-label="send message"
							className="text-[var(--primary)]">
							<SendHorizontal size={28} absoluteStrokeWidth />
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Chat;
