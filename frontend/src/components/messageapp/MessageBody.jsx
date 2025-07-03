import React, { useContext, useEffect, useState } from "react";
import { Send, Search, MoreHorizontal } from "lucide-react";
import axios from "../../axios";
import AuthContext from "../../context/AuthContext";
import moment from "moment";
import { Link, useParams, useNavigate } from "react-router-dom";

const Messagedetail = () => {
  const { user } = useContext(AuthContext);
  const [chatList, setChatList] = useState([]);
  const userid = user?.id;
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchuser, setSearchUser] = useState("");

  // Fetch contact list
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
  }, [userid]);
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
        {/* Search user */}
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
                onChange={(e)=>setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Chat User */}
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

        {/* Chat */}
        <div className="flex-1 flex flex-col justify-center items-center text-4xl">
          Click on Profile to start chat
        </div>
      </div>
    </div>
  );
};

export default Messagedetail;
