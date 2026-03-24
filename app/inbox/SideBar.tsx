"use client";
import React, { useState } from "react";
import Link from "next/link";
import { MdMenuOpen, MdKeyboardArrowDown } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useLogin } from "@/lib/loginStore";

type MenuItem = {
  label: string;
  path?: string;
  icon: any;
  screenName: string;
  children?: MenuItem[];
};

const NavItem = ({
  item,
  openSidebar,
  onLinkClick,
  depth = 0,
}: {
  item: MenuItem;
  openSidebar: boolean;
  onLinkClick: () => void;
  depth?: number;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const Icon = item.icon;

  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === item.path;

  return (
    <li className="list-none!">
      <div
        className={`flex! items-center! group relative! px-2! py-2! my-1! rounded-md! transition-all! ${
          isActive
            ? "bg-blue-50! text-green-600!"
            : "hover:bg-gray-100! text-gray-700!"
        }`}
      >
        {/* Link */}
        {item.path ? (
          <Link
            href={item.path}
            onClick={onLinkClick}
            className="flex! items-center! w-full! overflow-hidden!"
          >
            <Icon
              size={22}
              className={`shrink-0! transition-all! duration-300! ${
                !openSidebar ? "mx-auto!" : ""
              }`}
            />
            <span
              className={`whitespace-nowrap! transition-all! duration-300! ${
                openSidebar ? "opacity-100! ml-3!" : "opacity-0! w-0! ml-0!"
              }`}
            >
              {item.label}
            </span>
          </Link>
        ) : (
          <div
            onClick={() => hasChildren && setIsOpen(!isOpen)}
            className={`flex! items-center! w-full! overflow-hidden! cursor-pointer! ${
              !openSidebar ? "justify-center!" : ""
            }`}
          >
            <Icon
              size={22}
              className={`shrink-0! transition-all! duration-300! ${
                !openSidebar ? "mx-auto!" : ""
              }`}
            />
            <span
              className={`whitespace-nowrap! transition-all! duration-300! ${
                openSidebar ? "opacity-100! ml-3!" : "opacity-0! w-0! ml-0!"
              }`}
            >
              {item.label}
            </span>
          </div>
        )}

        {/* Expand Arrow */}
        {hasChildren && openSidebar && (
          <MdKeyboardArrowDown
            size={20}
            className={`shrink-0! transition-transform! duration-300! text-gray-500! ${
              isOpen ? "rotate-180!" : ""
            }`}
          />
        )}

        {/* Tooltip (shown only when sidebar is collapsed) */}
        {!openSidebar && (
          <div className="absolute! left-12! bg-gray-800! text-white! text-xs! px-2! py-1! rounded! opacity-0! group-hover:opacity-100! pointer-events-none! whitespace-nowrap! z-40!">
            {item.label}
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && isOpen && openSidebar && (
        <ul className="ml-4! mt-1! border-l! border-gray-200! pl-2!">
          {item.children!.map((child, idx) => (
            <NavItem
              key={idx}
              item={child}
              openSidebar={openSidebar}
              onLinkClick={onLinkClick}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const fetchMenu = useLogin((s) => s.fetchMenu);
  const menuItems: MenuItem[] = fetchMenu();

  return (
    <div className="fixed! left-0! top-14! bottom-0! z-40!">
      {/* ✅ onMouseEnter opens, onMouseLeave closes */}
      <nav
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`h-full! ml-1! mt-2! rounded! bg-white! shadow-xl! transition-all! duration-300! ${
          open ? "w-64!" : "w-14!"
        } flex! flex-col! overflow-hidden!`}
      >
        {/* Header */}
        <div
          className={`h-16! flex! items-center! px-3! ${
            open ? "justify-between!" : "justify-center!"
          }`}
        >
          <span
            className={`font-bold! text-green-600! transition-all! duration-300! whitespace-nowrap! overflow-hidden! ${
              open ? "opacity-100! w-auto!" : "opacity-0! w-0!"
            }`}
          >
            Gramo
          </span>

          <MdMenuOpen
            size={26}
            onClick={() => setOpen(!open)}
            className={`cursor-pointer! text-gray-500! transition-transform! duration-500! shrink-0! ${
              !open && "rotate-180!"
            }`}
          />
        </div>

        {/* Menu */}
        <ul className="flex-1! overflow-y-auto! overflow-x-hidden! px-2! py-2!">
          {menuItems.map((item, index) => (
            <NavItem
              key={index}
              item={item}
              openSidebar={open}
              onLinkClick={() => setOpen(false)}
            />
          ))}
        </ul>

        {/* Footer */}
        <div
          className={`p-3! border-t! border-gray-100! flex! items-center! gap-3! ${
            !open ? "justify-center!" : ""
          }`}
        >
          <FaUserCircle size={24} className="text-gray-400! shrink-0!" />
          {open && (
            <span className="text-sm! font-medium! whitespace-nowrap! overflow-hidden!">
              User Profile
            </span>
          )}
        </div>
      </nav>
    </div>
  );
}