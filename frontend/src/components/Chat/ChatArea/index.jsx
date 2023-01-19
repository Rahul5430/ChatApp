import PopupRoomInfo from '../../PopupRoomInfo';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart';

const ChatArea = ({
	user,
	rooms,
	chat,
	chatBottomRef,
	userTyping,
	showEmoji,
	emojiSelector,
	handleEmojiKeyUp,
	addEmoji,
	setShowEmoji,
	message,
	handleMessageChange,
	handleKeyUp,
	stoppedTyping,
	handleMessageSubmit,
}) => {
	return (
		<div className='chat_area'>
			<div className='chat_bg'>
				<PopupRoomInfo roomId={user.roomId} rooms={rooms} />

				<div className='chat'>
					{chat &&
						chat[user.roomId]?.messages?.map((msg, idx) => {
							if (msg.type === 'info') {
								return (
									<div className='announcement' key={idx}>
										<span>{msg.content}</span>
									</div>
								);
							} else {
								return (
									<div
										className={
											msg.userId === user.userId
												? 'message_holder me'
												: 'message_holder'
										}
										key={idx}
									>
										<img
											src={msg.avatar}
											className='small_img'
											alt=''
										/>
										<div className='message_box'>
											<div className='message'>
												<span className='message_name'>
													{msg.username}
												</span>
												<span className='message_text'>
													{msg.content}
												</span>
											</div>
										</div>
									</div>
								);
							}
						})}

					{/* Bottom div ref for auto scroll */}
					<div ref={chatBottomRef} />
				</div>

				<div style={{ marginLeft: 15, color: '#f48235' }}>
					<i>
						{userTyping &&
							userTyping !== user.username &&
							`Typing ${userTyping}`}
					</i>
				</div>

				<div className='chat_input' style={{ position: 'relative' }}>
					{showEmoji && (
						<span
							ref={(el) => (emojiSelector.current = el)}
							onKeyUp={(e) => handleEmojiKeyUp(e)}
							style={{
								position: 'absolute',
								bottom: 60,
								left: 0,
							}}
						>
							<Picker onSelect={addEmoji} emojiSize={20} />
						</span>
					)}

					<i
						className='far fa-smile-wink'
						style={{ marginRight: 8, color: 'grey' }}
						onClick={() => setShowEmoji((prevState) => !prevState)}
					></i>

					<input
						type='text'
						value={message}
						placeholder='Enter message'
						onChange={handleMessageChange}
						onKeyUp={(e) => {
							handleKeyUp(e, message);
							stoppedTyping();
						}}
					/>

					<button
						className='send_message_btn'
						onClick={(e) => {
							handleMessageSubmit();
						}}
					>
						SEND
					</button>
				</div>
			</div>
		</div>
	);
};

export default ChatArea;
