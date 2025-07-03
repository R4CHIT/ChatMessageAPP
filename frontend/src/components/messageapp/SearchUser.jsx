import React, { useContext, useEffect, useState } from "react";
import { Send, Search, MoreHorizontal } from "lucide-react";
import axios from "../../axios";
import moment from "moment";
import { Link, useParams, useNavigate } from "react-router-dom";

const SearchUser = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState([]);
  const [newmessage, setNewmessage] = useState("");
  const [search, setSearch] = useState("");
  const [searchuser, setSearchUser] = useState([]);

  useEffect(() => {
    const fetchuser = async () => {
      try {
        const response = await axios.get(`api/searchuser/${username}/`);
        setSearchUser(response.data);
        console.log(searchuser);
      } catch (err) {
        console.log(err);
      }
    };
    fetchuser();
  }, []);

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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {
                searchuser.map((user,index) => (
            <Link to={`/${user.id}`} key={index}>
              <div className="flex items-center p-3 bg-gray-100 hover:bg-gray-200 cursor-pointer">
                <div className="relative">
                  <img
                    src={user?.profile_picture}
                    alt={user?.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 truncate">
                      {user?.username}
                    </p>
                   
                  </div>
                  
                </div>
              </div>
            </Link>
                ))
            }
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col justify-center items-center text-4xl">
          Click on user to start chat
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
