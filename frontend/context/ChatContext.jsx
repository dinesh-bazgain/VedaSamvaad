import {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
} from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const [isSending, setIsSending] = useState(false);

  // Get authUser from AuthContext
  const { socket, axios, authUser } = useContext(AuthContext);

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800">
        <h2>Chat Error</h2>
        <p>{error.message}</p>
        <button onClick={() => setError(null)}>Retry</button>
      </div>
    );
  }

  // function to get all users in the chat
  const getUsers = async () => {
    try {
      const { data } = await axios.get("api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error); // Added for debugging
      toast.error(error.message);
    }
  };

  // function to get messages from the selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error fetching messages:", error); // Added for debugging
      toast.error(error.message);
    }
  };

  // function to send a message to the selected user
  const sendMessage = async (messageData) => {
    if (isSending) return; // Prevent multiple sends
    setIsSending(true);

    // Generate temporary ID for optimistic update
    const tempId = `temp-${Date.now()}`;

    // Create optimistic message
    const optimisticMessage = {
      ...messageData,
      _id: tempId,
      senderId: {
        _id: authUser._id,
        profilePic: authUser.profilePic,
      },
      receiverId: selectedUser._id,
      createdAt: new Date().toISOString(), // Use ISO string for consistency
      seen: false,
      status: "pending", // Add a status for optimistic messages
    };

    // Add to UI immediately
    setMessages((prevMessage) => [...prevMessage, optimisticMessage]);

    try {
      // Send to server
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      if (data.success) {
        // Replace optimistic message with real one
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === tempId ? { ...data.newMessage, status: "sent" } : msg
          )
        );
      } else {
        // If backend returns success: false, throw an error to trigger catch block
        throw new Error(data.message || "Failed to send message.");
      }
    } catch (error) {
      toast.error(error.message || "Failed to send message. Please try again.");
      console.error("Error sending message:", error); // Log the full error

      // Update the optimistic message status to 'failed'
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId
            ? { ...msg, status: "failed", error: error.message }
            : msg
        )
      );
    } finally {
      setIsSending(false); // Reset sending state
    }
  };

  // Message handler with proper cleanup
  const handleNewMessage = useCallback(
    (newMessage) => {
      if (!newMessage || !newMessage.senderId || !newMessage._id) return; // Ensure _id exists

      const isCurrentUser = newMessage.senderId._id === authUser._id;
      const isForCurrentChat =
        selectedUser &&
        (newMessage.senderId._id === selectedUser._id ||
          newMessage.receiverId === selectedUser._id);

      // Messages in current chat
      if (isForCurrentChat) {
        setMessages((prev) => {
          const exists = prev.some(
            (msg) =>
              msg._id === newMessage._id || // Check for exact ID match (real message)
              (msg._id.startsWith("temp-") &&
                msg.text === newMessage.text &&
                msg.status === "pending" &&
                newMessage.senderId._id === authUser._id) // Only for current user's pending messages
          );

          if (!exists) {
            return [...prev, newMessage];
          } else if (
            isCurrentUser &&
            newMessage.senderId._id === authUser._id
          ) {
            // If it's our own message and we have a pending optimistic one, replace it
            return prev.map((msg) =>
              msg._id.startsWith("temp-") &&
              msg.text === newMessage.text &&
              msg.status === "pending"
                ? { ...newMessage, status: "sent" } // Mark as sent
                : msg
            );
          }
          return prev; // Otherwise, just return previous state
        });
      }
      // Messages from other chats
      else if (!isCurrentUser) {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId._id]: (prev[newMessage.senderId._id] || 0) + 1,
        }));
      }
    },
    [selectedUser, authUser]
  );

  // Setup socket listener with proper cleanup
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", handleNewMessage);

    // Cleanup function
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, handleNewMessage]);

  const value = {
    messages,
    getMessages,
    sendMessage,
    users,
    getUsers,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    isSending,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
