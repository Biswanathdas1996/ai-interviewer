import React, { useEffect, useRef } from "react";

function ChatBox({ chatData }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData, chatData.length]);

  return (
    <>
      <div className="chat-container">
        {chatData &&
          chatData.map((chat, index) => (
            <div key={index} className={`chat-message ${chat.user}`}>
              <div>
                <b className="text-user">{chat.user}</b>
                {/* <p>{chat.text}</p> */}
                <div dangerouslySetInnerHTML={{ __html: chat.text }} />
              </div>
            </div>
          ))}
        {chatData && chatData?.length === 0 && (
          <div className={`chat-message You`}>
            <p style={{ width: "auto", textAlign: "center", marginRight: 20 }}>
              Please start the Interview by clicking on the "Start" button
            </p>
          </div>
        )}

        <div ref={chatEndRef}></div>
      </div>
    </>
  );
}

export default ChatBox;
