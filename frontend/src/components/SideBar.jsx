import { Link, useLocation } from "react-router-dom";
import HomeIcon from "../assets/home.png";
import ChartIcon from "../assets/Sales.png";
import UserIcon from "../assets/Account.png";
import DrahamIcon from "../assets/Draham.png";
import LogoutIcon from "../assets/log-out.png";

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname.split("/")[1] || "home";

  return (
    <div className="w-[200px] ml-[10px] mt-[10px] h-screen bg-[rgb(40,136,122)] rounded flex flex-col justify-between">
      {/* Logo */}
      <div>
        <div
          className="flex items-center gap-1 text-white text-2xl font-light p-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <span className="text-3xl text-center font-bold text-black">StockFlow</span>
        </div>

        <div className="h-[20px]"></div>

        {/* Navigation items */}
        <nav className="flex flex-col gap-3 px-2">
          <SidebarItem icon={HomeIcon} label="Home" to="/home" active={currentPath === "home"} />
          <SidebarItem icon={ChartIcon} label="Dashboard" to="/dashboard" active={currentPath === "dashboard"} />
          <SidebarItem icon={DrahamIcon} label="Pricing" to="/pricing" active={currentPath === "pricing"} />
          <SidebarItem icon={UserIcon} label="Profil" to="/profil" active={currentPath === "profil"} />
        </nav>
      </div>

      {/* Footer / Disconnect */}
      <div className="px-2 pb-4 w-full">
        <SidebarItem icon={LogoutIcon} label="Disconnect" to="/disconnect" active={currentPath === "disconnect"} />
      </div>
    </div>
  );
}

// Sidebar item component
function SidebarItem({ icon, label, to, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 py-2 px-4 rounded transition-all duration-200 ${
        active ? "text-white" : "bg-white text-teal-700 hover:text-teal-800"
      }`}
      style={active ? { backgroundColor: "rgba(40, 136, 122, 0.5)" } : {}}
    >
      <img src={icon} alt={`${label} icon`} className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </Link>
  );
}
