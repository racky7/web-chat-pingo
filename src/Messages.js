import { useEffect, useRef } from "react";

export default function Messages({ msg, user1id, user2 }) {
  const scrollRef = useRef();

  useEffect(() => {
    console.log(msg);
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

  return (
    <div ref={scrollRef}>
      <p>
        {msg.from === user1id ? (
          <span style={{ color: "blue", fontWeight: "bold" }}>You: </span>
        ) : (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {user2.name}:{" "}
          </span>
        )}
        {msg.text ? msg.text : ""}

        <br />
      </p>
      {msg.media ? (
        <img src={msg.media} style={{ width: "200px", height: "200px" }} />
      ) : null}
      <br />
    </div>
  );
}
