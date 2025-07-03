import React, { useContext, useEffect, useState } from "react";
import { Send, Search, MoreHorizontal } from "lucide-react";
import axios from "../../axios";
import AuthContext from "../../context/AuthContext";
import moment from "moment";
import { Link, useParams, useNavigate } from "react-router-dom";

const Messagedetail = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [chatList, setChatList] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const userid = user?.id;
  const [newmessage, setNewmessage] = useState("");
  const [search, setSearch] = useState("");
  const [searchuser, setSearchUser] = useState("");
  const [refresh,setrefresh] = useState(false)
  // Fetch User
  useEffect(() => {
    const fetchMessageList = async () => {
      if (!userid) return;
      try {
        const response = await axios.get(`/api/mychat/${userid}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          },
        });
        setChatList(response.data);
      } catch (err) {
        console.error("Error fetching chat list:", err);
      }
    };
    fetchMessageList();
  }, [navigate, userid,refresh]);

  // Fetch message
  useEffect(() => {
    const fetchUserMessage = async () => {
      if (!userid || !id) return;
      try {
        const response = await axios.get(`/api/get-message/${userid}/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          },
        });
        setChatMessages(response.data);
      } catch (err) {
        console.error(
          "Error fetching messages:",
          err.response?.data || err.message
        );
      }
    };

    // fetxh
    fetchUserMessage();

    // delay
    const interval = setInterval(fetchUserMessage, 120);
  
    return () => clearInterval(interval);
  }, [userid, navigate]);

  const handleClick = async () => {
    if (!newmessage.trim()) {
      console.warn("Message is empty");
      return;
    }

    const formData = new FormData();
    formData.append("user", userid);
    formData.append("sender", userid);
    formData.append("receiver", id);
    formData.append("message", newmessage);
    formData.append("is_seen", false);

    try {
      await axios.post("/api/send-message/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      });
      setNewmessage('')
      setrefresh(!refresh)
    } catch (err) {
      //err for development
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`api/searchuser/${search}/`);
      if (response.status == 404) {
        console.log("User Not Found");
      } else {
        setSearchUser(response.data);
        navigate("/searchuser/" + search);
      }
    } catch (err) {
      console.log("User Not Found");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="flex h-[calc(100vh-7rem)] bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl mx-auto">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">Messages</h1>
              <MoreHorizontal className="w-5 h-5 text-gray-600 cursor-pointer" />
            </div>
            <div className="relative">
              <button onClick={handleSearch}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </button>
              <input
                type="text"
                placeholder="Search messages"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto">
            {chatList.map((msg, index) => {
              const contactId =
                msg.sender === userid ? msg.receiver : msg.sender;
              const profile =
                msg.sender === userid
                  ? msg.receiver_profile
                  : msg.sender_profile;

              return (
                <Link to={`/${contactId}`} key={index}>
                  <div className="flex items-center p-3 hover:bg-gray-50 cursor-pointer">
                    <div className="relative">
                      <img
                        src={
                          profile?.profile_picture
                            ? profile.profile_picture
                            : "default.jpeg"
                        }
                        alt={profile?.username || "User"}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 truncate">
                          {profile?.username}
                        </p>
                        <span className="text-xs text-gray-500">
                          {moment.utc(msg.date).local().fromNow()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center">
            <div className="w-10 h-10 rounded-[50%] flex items-center justify-center text-white font-medium text-sm">
              <img
                src={
                  chatMessages.length > 0
                    ? chatMessages[0].sender === userid
                      ? chatMessages[0].receiver_profile?.profile_picture ||
                        "default.jpeg"
                      : chatMessages[0].sender_profile?.profile_picture ||
                        "default.jepg"
                    : "default.jpeg"
                }
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div className="ml-3">
              <h2 className="font-medium">
                {chatMessages.length > 0 &&
                  (chatMessages[0].sender === userid
                    ? chatMessages[0].receiver_profile?.username
                    : chatMessages[0].sender_profile?.username)}
              </h2>
              <p className="text-sm text-gray-500">Active now</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((m, index) => (
              <div key={index}>
                {m.sender === userid ? (
                  <div className="flex justify-end">
                    <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-blue-500 text-white">
                      <p className="text-sm">{m.message}</p>
                      <p className="text-xs mt-1 text-blue-100">
                        {moment.utc(m.date).local().fromNow()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start">
                    <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-gray-100 text-gray-900">
                      <p className="text-sm">{m.message}</p>
                      <p className="text-xs mt-1 text-gray-500">
                        {moment.utc(m.date).local().fromNow()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  setNewmessage(e.target.value);
                }}
                value={newmessage}
              />
              <button
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                onClick={() => {
                  handleClick();
                }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messagedetail;
