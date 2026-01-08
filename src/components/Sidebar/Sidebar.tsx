import React, { useEffect, useState, useRef } from "react";
// import Link from 'next/link';
import {
  X,
  ChevronDown,
  Info,
  Lock,
  Home,
  User,
  Send,
  BarChart3,
  Settings,
  HelpCircle,
  ExternalLink,
  Plus,
  Check,
  Menu,
  MessageCircle,
  Wallet,
  LayoutGrid,
  CheckCircle2,
  ShieldCheck,
  Navigation,
  BookOpen,
  Bell,
  TrendingUp,
  CheckSquare,
  Timer,
  History,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface Company {
  id: string;
  name: string;
  role: string;
  isActive?: boolean;
  badge?: string;
}
interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  category?: "category";
  external?: boolean;
  href?: string; // <--- new
}
interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeSection?: string;
  onSectionChange?: (sectionId: string) => void;
  onboardingComplete?: boolean;
  companyName?: string;
  companies?: Company[];
  onCompanyChange?: (companyId: string) => void;
  onAddNewEnterprise?: () => void;
  isLoggedIn?: boolean;
  "data-id"?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onClose,
  onSectionChange,
  onboardingComplete = true,
  companies = [
    {
      id: "1",
      name: "FutureTech LLC",
      role: "Owner",
      isActive: true,
      badge: "Primary",
    },
    {
      id: "2",
      name: "StartupCo Inc",
      role: "Admin",
      badge: "Secondary",
    },
    {
      id: "3",
      name: "Enterprise Solutions",
      role: "Member",
    },
  ],
  onCompanyChange,
  onAddNewEnterprise,
  isLoggedIn = true,
  "data-id": dataId,
}) => {
  const [tooltipItem, setTooltipItem] = useState<string | null>(null);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [formsDropdownOpen, setFormsDropdownOpen] = useState(false);
  const [focusedMenuIndex, setFocusedMenuIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const formsDropdownRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    const section = location.pathname.split("/")[2] || "dashboard";
    setActiveSection(section);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setCompanyDropdownOpen(false);
      }
      if (
        formsDropdownRef.current &&
        !formsDropdownRef.current.contains(event.target as Node)
      ) {
        setFormsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard nav
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      const menuItems = getMenuItems().filter(
        (item) => item.category !== "category"
      );
      switch (event.key) {
        case "Escape":
          if (companyDropdownOpen) {
            setCompanyDropdownOpen(false);
            return;
          }
          if (formsDropdownOpen) {
            setFormsDropdownOpen(false);
            return;
          }
          onClose?.();
          break;
        case "ArrowDown":
          event.preventDefault();
          setFocusedMenuIndex((prev) => {
            const next = prev < menuItems.length - 1 ? prev + 1 : 0;
            menuItemsRef.current[next]?.focus();
            return next;
          });
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedMenuIndex((prev) => {
            const next = prev > 0 ? prev - 1 : menuItems.length - 1;
            menuItemsRef.current[next]?.focus();
            return next;
          });
          break;
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, companyDropdownOpen, formsDropdownOpen, onClose]);

  if (!isLoggedIn) return null;

  const getMenuItems = (): MenuItem[] => {
    const items: MenuItem[] = [];

    // Overview
    items.push(
      {
        id: "overview-cat",
        label: "Overview",
        category: "category",
      } as MenuItem,
      {
        id: "overview",
        label: "Overview / Home",
        icon: <Home size={20} />,
        href: onboardingComplete ? "/dashboard/overview" : "/dashboard/onboarding",
      }
    );

    // Essentials
    items.push(
      {
        id: "essentials-cat",
        label: "Essentials",
        category: "category",
      } as MenuItem,
      {
        id: "profile",
        label: "Profile",
        icon: <User size={20} />,
        href: "/dashboard/profile",
      },
      {
        id: "wallet",
        label: "Wallet",
        icon: <Wallet size={20} />,
        href: "/dashboard/documents",
      }
    );

    // Work & Transactions
    items.push(
      {
        id: "work-transactions-cat",
        label: "Work & Transactions",
        category: "category",
      } as MenuItem,
      {
        id: "workspace",
        label: "My Workspace",
        icon: <LayoutGrid size={20} />,
        href: "/dashboard/workspace",
      },
      {
        id: "requests",
        label: "Requests",
        icon: <Send size={20} />,
        href: "/dashboard/requests",
      },
      {
        id: "approvals",
        label: "Approvals",
        icon: <CheckCircle2 size={20} />,
        href: "/dashboard/approvals",
      }
    );

    // Compliance & Obligations
    items.push(
      {
        id: "compliance-obligations-cat",
        label: "Compliance & Obligations",
        category: "category",
      } as MenuItem,
      {
        id: "reporting-obligations",
        label: "Reporting Obligations",
        icon: <BarChart3 size={20} />,
        href: "/dashboard/reporting-obligations",
      },
      {
        id: "compliance-tasks",
        label: "Compliance Tasks",
        icon: <ShieldCheck size={20} />,
        href: "/dashboard/compliance-tasks",
      }
    );

    // Learning & Enablement
    items.push(
      {
        id: "learning-enablement-cat",
        label: "Learning & Enablement",
        category: "category",
      } as MenuItem,
      {
        id: "onboarding-journey",
        label: "Onboarding Journey",
        icon: <Navigation size={20} />,
        href: "/dashboard/onboarding",
      },
      {
        id: "my-courses",
        label: "My Courses",
        icon: <BookOpen size={20} />,
        href: "/dashboard/learning",
      },
      {
        id: "learning-center",
        label: "Learning Center",
        icon: <TrendingUp size={20} />,
        href: "/lms",
      }
    );

    // Communication
    items.push(
      {
        id: "communication-cat",
        label: "Communication",
        category: "category",
      } as MenuItem,
      {
        id: "notifications",
        label: "Notifications",
        icon: <Bell size={20} />,
        href: "/dashboard/notifications",
      },
      {
        id: "messages",
        label: "Messages",
        icon: <MessageCircle size={20} />,
        href: "/dashboard/messages",
      }
    );

    // My Performance
    items.push(
      {
        id: "my-performance-cat",
        label: "My Performance",
        category: "category",
      } as MenuItem,
      {
        id: "performance-overview",
        label: "Performance Overview",
        icon: <TrendingUp size={20} />,
        href: "/dashboard/performance/overview",
      },
      {
        id: "task-completion",
        label: "Task Completion",
        icon: <CheckSquare size={20} />,
        href: "/dashboard/performance/tasks",
      },
      {
        id: "request-turnaround",
        label: "Request Turnaround",
        icon: <Timer size={20} />,
        href: "/dashboard/performance/turnaround",
      },
      {
        id: "activity-timeline",
        label: "Activity Timeline",
        icon: <History size={20} />,
        href: "/dashboard/performance/timeline",
      }
    );

    // Settings & Support
    items.push(
      {
        id: "settings-support-cat",
        label: "Settings & Support",
        category: "category",
      } as MenuItem,
      {
        id: "settings",
        label: "Settings",
        icon: <Settings size={20} />,
        href: "/dashboard/settings",
      },
      {
        id: "support",
        label: "Support",
        icon: <HelpCircle size={20} />,
        href: "/dashboard/support",
      },
      {
        id: "help-center",
        label: "Help Center",
        icon: <ExternalLink size={16} />,
        external: true,
        href: "https://docs.example.com/help",
      }
    );

    return items;
  };

  const activeCompany = companies.find((c) => c.isActive) || companies[0];

  return (
    <div
      className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gray-50 border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } lg:w-60 overflow-y-auto`}
      data-id={dataId}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <button className="lg:hidden text-gray-500" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Onboarding Banner */}
      {!onboardingComplete && (
        <div className="bg-amber-50 p-3 m-3 rounded-md border border-amber-200">
          <div className="flex items-start">
            <Info
              size={16}
              className="text-amber-500 mt-0.5 mr-2 flex-shrink-0"
            />
            <p className="text-xs text-amber-700">
              Complete the onboarding process to unlock all sections of the
              platform.
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="py-2">
        {getMenuItems().map((item) => {
          if (item.category === "category") {
            return (
              <div key={item.id} className="px-4 pt-6 pb-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-2">
                  {item.label}
                </div>
              </div>
            );
          }

          const isDisabled = !onboardingComplete && item.id !== "onboarding";
          const isActive = activeSection === item.id;

          const baseClasses = `flex items-center px-4 py-3 relative transition-colors ${isActive
            ? "bg-blue-700 text-white"
            : isDisabled
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-200 cursor-pointer"
            }`;

          const content = (
            <>
              <span className="w-8 flex items-center justify-center flex-shrink-0">
                {isDisabled && !isActive ? (
                  <div className="relative">
                    {item.icon}
                    <Lock
                      size={10}
                      className="absolute -top-1 -right-1 text-gray-400"
                    />
                  </div>
                ) : (
                  item.icon
                )}
              </span>
              <span className="flex-1 ml-3">{item.label}</span>
              {item.external && !isDisabled && (
                <ExternalLink
                  size={14}
                  className="text-gray-400 ml-2 flex-shrink-0"
                />
              )}
            </>
          );



          if (item.href && !isDisabled) {
            return item.external ? (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={baseClasses}
              >
                {content}
              </a>
            ) : (
              <Link key={item.id} to={item.href} className={baseClasses}>
                {content}
              </Link>
            );
          }

          return (
            <div key={item.id} className={baseClasses}>
              {content}
              {tooltipItem === item.id && (
                <div className="absolute left-full ml-2 bg-gray-800 text-white text-xs py-2 px-3 rounded-md w-48 z-50">
                  Complete onboarding to unlock this section
                  <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800"></div>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

// Burger menu stays the same
export const BurgerMenuButton: React.FC<{
  onClick: () => void;
  className?: string;
  isLoggedIn?: boolean;
  "data-id"?: string;
}> = ({ onClick, className = "", isLoggedIn = true, "data-id": dataId }) => {
  if (!isLoggedIn) return null;
  return (
    <button
      onClick={onClick}
      className={`p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors ${className}`}
      data-id={dataId}
      aria-label="Open navigation menu"
    >
      <Menu size={20} />
    </button>
  );
};
