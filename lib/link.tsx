// Link.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  replace?: boolean; // optional
}

const Link: React.FC<LinkProps> = ({
  href,
  children,
  className,
  style,
  replace = false,
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Allow Ctrl/Cmd click or middle-click to open in new tab
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) {
      return;
    }

    e.preventDefault();
    navigate(href, { replace });
  };

  return (
    <a
      href={href}
      onClick={handleClick} // ✅ must be assigned to a function
      className={className}
      style={{
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </a>
  );
};

export default Link;
