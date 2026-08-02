"use client";

import { useEffect, useState } from "react";

import { RenameModal } from "@/components/modals/rename-modal";
import { ProModal } from "@/components/modals/pro-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return null;
  }
  
  return (
    <>
      <RenameModal />
      <ProModal />
    </>
  );
};