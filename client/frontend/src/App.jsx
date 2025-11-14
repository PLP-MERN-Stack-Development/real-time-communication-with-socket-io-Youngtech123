import { useEffect, useState } from "react";
import socket from "./socket/socket";

const ROOMS = ["General", "Sports", "Music"];

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [room, setRoom] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    socket.on("chatMessage", (data) => setMessages((prev) => [...prev, data]));
    socket.on("userJoined", (name) => setMessages((prev) => [...prev, { system: true, text: `${name} joined the chat` }]));
    socket.on("userLeft", (name) => setMessages((prev) => [...prev, { system: true, text: `${name} left the chat` }]));
    socket.on("typing", (name) => setTypingUsers((prev) => [...new Set([...prev, name])]));
    socket.on("stopTyping", (name) => setTypingUsers((prev) => prev.filter((user) => user !== name)));

    return () => {
      socket.off("chatMessage");
      socket.off("userJoined");
      socket.off("userLeft");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, []);

  const login = () => {
    if (!username || !password) return;
    setIsLoggedIn(true);
  };

  const joinRoom = () => {
    if (!room) return;
    setIsJoined(true);
    socket.emit("joinRoom", { username, room });
  };

  const sendMessage = () => {
    if (!input) return;
    socket.emit("chatMessage", { username, text: input });
    setInput("");
    socket.emit("stopTyping");
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (e.target.value) socket.emit("typing");
    else socket.emit("stopTyping");
  };

  // Styles
  const containerStyle = {
    maxWidth: 600,
    margin: "40px auto",
    padding: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  };

  const inputStyle = {
    padding: 10,
    width: "70%",
    borderRadius: 5,
    border: "1px solid #ccc",
    marginBottom: 10
  };

  const buttonStyle = {
    padding: "10px 15px",
    borderRadius: 5,
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    marginLeft: 10
  };

  const roomButtonStyle = (r) => ({
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 5,
    border: "1px solid #007bff",
    backgroundColor: room === r ? "#007bff" : "white",
    color: room === r ? "white" : "#007bff",
    cursor: "pointer"
  });

  // Login screen
  if (!isLoggedIn) {
    return (
      <div style={containerStyle}>
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Login</h2>
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />
        <br />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
        <br />
        <div style={{ textAlign: "center" }}>
          <button onClick={login} style={buttonStyle}>Login</button>
        </div>
      </div>
    );
  }

  // Room selection
  if (!isJoined) {
    return (
      <div style={containerStyle}>
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Select a Room</h2>
        <div style={{ textAlign: "center" }}>
          {ROOMS.map((r) => (
            <button key={r} onClick={() => setRoom(r)} style={roomButtonStyle(r)}>
              {r}
            </button>
          ))}
          <br />
          <button onClick={joinRoom} style={{ ...buttonStyle, marginTop: 10 }}>Join Room</button>
        </div>
      </div>
    );
  }

  // Chat screen
  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Room: {room}</h2>

      <div style={{ border: "1px solid #ccc", height: 350, padding: 10, overflowY: "auto", borderRadius: 5, backgroundColor: "white", marginBottom: 10 }}>
        {messages.map((msg, index) =>
          msg.system ? (
            <p key={index} style={{ color: "gray", fontStyle: "italic", margin: 5 }}>{msg.text}</p>
          ) : (
            <p key={index} style={{ margin: 5 }}><strong>{msg.username}: </strong>{msg.text}</p>
          )
        )}
      </div>

      {typingUsers.length > 0 && (
        <p style={{ fontStyle: "italic", color: "gray", marginBottom: 10 }}>
          {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
        </p>
      )}

      <div style={{ textAlign: "center" }}>
        <input value={input} onChange={handleInputChange} placeholder="Type your message..." style={inputStyle} />
        <button onClick={sendMessage} style={buttonStyle}>Send</button>
      </div>
    </div>
  );
}
