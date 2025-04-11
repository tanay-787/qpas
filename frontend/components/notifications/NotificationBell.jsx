
import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check } from 'lucide-react'; // Or your icon library
import { useNotifications } from '../../context/NotificationContext';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from 'react-router-dom'; // For clickable notifications
import { cn } from "@/lib/utils"; // For conditional classes

export default function NotificationBell() {
  const { notifications, unreadCount, loading, markAsRead, fetchNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Ref for detecting outside clicks

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Optionally refresh notifications when opening
      // fetchNotifications();
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setIsOpen(false); // Close dropdown after click
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className="relative rounded-full"
        aria-label="Toggle Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-4 w-4 min-w-min p-0.5 text-xs flex items-center justify-center rounded-full"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 mt-2 w-80 max-w-sm shadow-lg z-50">
          <CardHeader className="p-4">
            <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
            {/* Optional: Add mark all as read button */} 
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <ScrollArea className="h-[300px]">
              {loading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
              ) : (!notifications || notifications.length) === 0 ? (
                
                <div className="p-4 text-center text-sm text-muted-foreground">No new notifications</div>
              ) : (
                notifications.map((notification) => (
                  <React.Fragment key={notification.id}>
                    <div
                      className={cn(
                        "p-3 hover:bg-accent cursor-pointer",
                        !notification.read && "bg-blue-50 dark:bg-blue-900/20"
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-sm mb-1 flex-grow pr-2">{notification.message}</p>
                        {!notification.read && (
                          <button
                             title="Mark as read"
                             className="flex-shrink-0 text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800"
                             onClick={(e) => { 
                                 e.stopPropagation(); // Prevent triggering handleNotificationClick
                                 markAsRead(notification.id); 
                             }}
                           > 
                             <Check size={16} /> 
                           </button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleString()} {/* Format timestamp as needed */}
                      </p>
                    </div>
                    <Separator className="my-0" />
                  </React.Fragment>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
