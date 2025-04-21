import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, Route, Routes } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  LogIn,
  CircleUser,
  LayoutDashboard // Added LayoutDashboard
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "@/components/themeProvider";
import { useToast } from "@/hooks/use-toast";
import { toast as sonner } from "sonner";
import { useInstitution } from "../../context/InstitutionContext";
// Import the NotificationBell component
import NotificationBell from "../notifications/NotificationBell";

const MenuContent = () => (
  <div className="space-y-4">
    <Link to="/" className="block text-lg hover:underline">
      Home
    </Link>
    <Link to="/browse-institutions" className="block text-lg hover:underline">
      Browse
    </Link>
  </div>
);

export default function NavBar() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [uiTheme, setUITheme] = useState(theme);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { institution } = useInstitution();
  const { toast } = useToast();

  useEffect(() => {
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setUITheme(systemTheme);
    } else {
      setUITheme(theme);
    }
  }, [theme]);

  const handleDashboardNavigation = () => {
    if (window.location.pathname.includes("dashboard")) {
      return;
    }
    if (!user || !user?.member_of) {
       sonner.warning("No Institution Found", {
         description: "Please join or create an institution first",
       })
      return;
    }

    if (!user?.role) {
       sonner.warning("No Role Found", {
         description: "Please contact the admin of your institution for role assignment",
       })
      return;
    }

    const institutionId = user?.member_of;
    // Use optional chaining for safer access
    if (institutionId === institution?.inst_id) {
       navigate(`/${institutionId}/${user?.role}/dashboard`);
     } else {
       // Handle case where user might be member of an inst, but context hasn't loaded that inst yet
       // Or if there's a mismatch (less likely if member_of is source of truth)
       console.warn("Institution context might not be loaded or mismatch detected.");
       navigate(`/${institutionId}/${user?.role}/dashboard`); // Attempt navigation anyway, dashboard can handle fetch
     }
  };

  const handleUserLogout = async () => {
    await logout();
    toast({
      title: "LogOut Successful",
      description: "You have successfully logged out of the system",
      variant: "default",
    });
  };

  return (
    <div className="mx-0 px-5 py-3 flex items-center justify-between border-b bg-background/85 backdrop-blur-[3px] sticky top-0 z-50">
      {/* Left side: Navigation links */}
      <div className="flex items-center space-x-4">
        <nav className="hidden md:flex space-x-4">
          <a href="/" className="text-md hover:underline">
            Home
          </a>
          <a href="/browse-institutions" className="text-md hover:underline">
            Browse
          </a>
          {/* <a href="#" className="text-md hover:underline">
            Blog
          </a> */}
          {/* <a href="#" className="text-md hover:underline">Contact Us</a> */}
        </nav>
      </div>

      {/* Right side: Icons and User Menu */}
      <div className="flex items-center space-x-2">
         {/* Dashboard Icon - Visible only when logged in and not already on a dashboard page */}
         {user && user?.member_of && institution && !window.location.pathname.includes("dashboard") && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDashboardNavigation}
            className="rounded-full" // Make it round like others
            title="Go to Dashboard"
          >
            <LayoutDashboard size={20} />
          </Button>
        )}

        {/* Notification Bell - Visible only when logged in */}
        {user && <NotificationBell />}

        {/* Theme Toggle */}
        <ModeToggle />

        {/* User Auth Section */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <CircleUser size={20} />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/user-profile')}>Profile</DropdownMenuItem> {/* Example: Add profile link */}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleUserLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/login")}
             className="rounded-full" // Make it round like others
            title="Login"
          >
            <LogIn size={20} />
          </Button>
        )}

        {/* Mobile Menu */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu size={20} />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <MenuContent />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
