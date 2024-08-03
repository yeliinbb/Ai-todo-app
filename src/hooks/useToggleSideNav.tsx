"use client";
import { useState } from "react";

const useToggleSideNav = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  const handleClose = () => setIsSideNavOpen(false);

  return { isSideNavOpen, toggleSideNav, handleClose };
};

export default useToggleSideNav;
