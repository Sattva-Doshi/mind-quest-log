import { NavLink } from "react-router-dom";
import { Home, Target, Smartphone, Calendar, BarChart3 } from "lucide-react";

const BottomNav = () => {
  const navItems = [
    { to: "/dashboard", icon: Home, label: "Home" },
    { to: "/habits", icon: Target, label: "Habits" },
    { to: "/screen-time", icon: Smartphone, label: "Screen" },
    { to: "/calendar", icon: Calendar, label: "Calendar" },
    { to: "/insights", icon: BarChart3, label: "Insights" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
