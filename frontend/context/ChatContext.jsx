import { createContext, useEffect, useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

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
      toast.error(error.message);
    }
  };

  // function to send a message to the selected user
  const sendMessage = async (messageData) => {
    try {
      // Generate temporary ID for optimistic update
      const tempId = Date.now().toString();

      // Create optimistic message
      const optimisticMessage = {
        ...messageData,
        _id: tempId,
        senderId: {
          _id: authUser._id,
          profilePic: authUser.profilePic,
        },
        createdAt: new Date(),
        seen: false,
      };

      // Add to UI immediately
      setMessages((prevMessage) => [...prevMessage, optimisticMessage]);

      // Send to server
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      if (data.success) {
        // Replace optimistic message with real one
        setMessages((prevMessage) =>
          prevMessage.map((msg) => (msg._id === tempId ? data.newMessage : msg))
        );
      }
    } catch (error) {
      toast.error(error.message);
      // Remove optimistic message on error
      setMessages((prevMessage) =>
        prevMessage.filter((msg) => msg._id !== tempId)
      );
    }
  };

  // function to subscribe to messages
  const subscribeToMessages = async () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (!newMessage || !newMessage.senderId) return;

      const isCurrentUser = newMessage.senderId._id === authUser._id;
      const isFromSelectedUser =
        selectedUser && newMessage.senderId._id === selectedUser._id;
      const isToSelectedUser =
        selectedUser && newMessage.receiverId === selectedUser._id;

      // Messages in current chat
      if (
        selectedUser &&
        (isFromSelectedUser || (isCurrentUser && isToSelectedUser))
      ) {
        setMessages((prevMessage) => {
          // Avoid duplicates
          if (prevMessage.some((msg) => msg._id === newMessage._id))
            return prevMessage;
          return [...prevMessage, newMessage];
        });

        // Mark as seen if from other user
        if (isFromSelectedUser) {
          axios.put(`/api/messages/mark/${newMessage._id}`);
        }
      }
      // Messages from other chats
      else if (!isCurrentUser) {
        setUnseenMessages((prevMessage) => ({
          ...prevMessage,
          [newMessage.senderId._id]:
            (prevMessage[newMessage.senderId._id] || 0) + 1,
        }));
      }
    });
  };

  // function to unsubscribe from messages
  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

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
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
