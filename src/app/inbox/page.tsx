"use client";

import React, { useState, useMemo, useCallback } from "react";
import ChatView from "@/components/inbox/ChatView";
import { Product } from "@/components/types/product";
import { useUser } from "@clerk/nextjs";

const InboxPage = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string>("");
  const [sharedProduct, setSharedProduct] = useState<Product | null>(null);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(true);

  const { user } = useUser();
  const currentAgentUsername = useMemo(
    () =>
      user?.username ||
      user?.primaryEmailAddress?.emailAddress ||
      "unknown_agent",
    [user]
  );

  const handleClearSharedProduct = useCallback(() => {
    setSharedProduct(null);
  }, []);

  const handleOpenRightSidebar = useCallback(() => {
    setIsRightSidebarVisible(true);
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden">
      <ChatView
        selectedConversationId={selectedConversationId}
        sharedProduct={sharedProduct}
        onClearSharedProduct={handleClearSharedProduct}
        isRightSidebarVisible={isRightSidebarVisible}
        onOpenRightSidebar={handleOpenRightSidebar}
      />
    </div>
  );
};

export default InboxPage;
