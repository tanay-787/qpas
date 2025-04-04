import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Heart,
  ShoppingBag,
  ChevronDown,
  Menu,
  LogIn,
  CircleUser,
  User,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "@/components/themeProvider";
import { useToast } from "@/hooks/use-toast";
import { toast as sonner } from "sonner";
import { useInstitution } from "../../context/InstitutionContext";
import { LayoutDashboard } from "lucide-react";

const MenuContent = () => (
  <div className="space-y-4">
    <a href="#" className="block text-lg hover:underline">
      Home
    </a>
    <a href="/browse-institutions" className="block text-lg hover:underline">
      Browse
    </a>
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
    //current window name
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
    if (institutionId === institution?.inst_id) {
      navigate(`/${institutionId}/${user?.role}/dashboard`);
    } else {
      sonner.warning("Institution Mismatch", {
        description: "You are not a member of this institution",
      })
      return;
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
      <div className="flex items-center space-x-4">
        <nav className="hidden md:flex space-x-4">
          <a href="/" className="text-md hover:underline">
            Home
          </a>
          <a href="/browse-institutions" className="text-md hover:underline">
            Browse
          </a>
          <a href="#" className="text-md hover:underline">
            Blog
          </a>
          {/* <a href="#" className="text-md hover:underline">Contact Us</a> */}
        </nav>
      </div>
      <div className="flex items-center space-x-2">
        {user && user?.member_of && !(window.location.pathname.includes("dashboard")) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDashboardNavigation}
            className=""
            title="Go to Dashboard"
          >
            <LayoutDashboard size={20} />
          </Button>
        )}
        <ModeToggle />
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
              <DropdownMenuItem>Profile</DropdownMenuItem>
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
          >
            <LogIn size={20} />
          </Button>
        )}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            {/* <div className="flex justify-between items-center mb-6">
              <img
                src={`/assets/cleatcentral-logo-${theme}.svg`}
                width={130}
                height={24}
                alt="CleatCentral logo"
                className="w-25 h-auto"
              />
            </div> */}
            <MenuContent />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
