import { useContext, useState } from "react";
import { MessageCircle, Search, Menu, X, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const Logout = () => {
    // Clear localStorage or token logic here
    localStorage.removeItem("accesstoken"); // or any token you're using
    localStorage.removeItem("refreshtoken");

    // then navigate
    navigate("/login");
  };
  const { user } = useContext(AuthContext);
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 ">
          <MessageCircle className="w-8 h-8 text-blue-600" />
          <span
            className="text-xl font-semibold text-gray-900"
          >
            Messages
          </span>
        </div>

        <div className="flex items-center space-x-3">
          hello.{user?.username}
          <button
            onClick={Logout}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:block font-medium">Logout</span>
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 py-4 border-t border-gray-200">
          <button className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
