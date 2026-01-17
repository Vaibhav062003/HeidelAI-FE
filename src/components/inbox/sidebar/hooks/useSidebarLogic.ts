import { useState, useCallback, useEffect } from "react";
import { useApi } from "@/lib/session_api";
import { Conversation } from "@/components/types/conversation";
import { WhatsAppTemplate } from "@/components/types/template";
import { ApiContact } from "@/components/types/contacts";

export const useSidebarLogic = (
  selectedConversationId: string,
  passedConversation?: Conversation | null
) => {
  const api = useApi();

  // Data State
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [assignedTags, setAssignedTags] = useState<string[]>([]);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  
  const [isUpdatingTags, setIsUpdatingTags] = useState(false);

  // Sync Conversation
  useEffect(() => {
    if (passedConversation) {
      setConversation(passedConversation);
      setAssignedTags(passedConversation.categories || []);
    }
  }, [passedConversation]);

  // Fetch Contact Tags 
  useEffect(() => {
    if (!selectedConversationId) return;
    
    const fetchContactTags = async () => {
      try {
        const response = await api.get("/api/contacts");
        if (!response.data?.contacts) return;

        const currentContact = response.data.contacts.find(
          (contact: ApiContact) => contact.conversation_id === selectedConversationId
        );

        if (currentContact) {
          setAssignedTags(currentContact.categories || []);
        } else {
          setAssignedTags([]);
        }
      } catch (error) {
        console.error("Error fetching contact tags:", error);
        setAssignedTags([]);
      }
    };

    fetchContactTags();
  }, [selectedConversationId, api]);

  // Fetch All Available System Tags
  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        const response = await api.get<{ tags: string[] }>("/api/org/metadata/tags");
        setAllTags(response.data.tags || []);
      } catch (error) {
        console.error("Error fetching available tags:", error);
      }
    };
    fetchAllTags();
  }, [api]);

  // Load Templates
  useEffect(() => {
    const loadTemplates = async () => {
      const cached = sessionStorage.getItem("whatsapp_templates");
      if (cached) {
        try {
          setTemplates(JSON.parse(cached));
          return;
        } catch (e) {
          console.error("Cache parse error:", e);
        }
      }

      try {
        const response = await fetch("/api/fetchTemplate");
        if (!response.ok) throw new Error("Failed to fetch templates");
        const result = await response.json();
        
        if (result?.data) {
          setTemplates(result.data);
          sessionStorage.setItem("whatsapp_templates", JSON.stringify(result.data));
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadTemplates();
  }, []);

  // Action: Toggle Tag
  const handleToggleTag = useCallback(async (tag: string) => {
    // Optimistic Update
    const previousTags = [...assignedTags];
    const newTags = assignedTags.includes(tag)
      ? assignedTags.filter((t) => t !== tag)
      : [...assignedTags, tag];

    setAssignedTags(newTags);
    setIsUpdatingTags(true);

    try {
      const response = await api.post("/api/contacts/update-categories", {
        conversation_id: selectedConversationId,
        categories: newTags,
      });

      if (response.status === 200 || response.data?.success) {
        setConversation((prev) => prev ? { ...prev, categories: newTags } : prev);
      } else {
        throw new Error("API failed");
      }
    } catch (error) {
      console.error("Error updating tags:", error);
      setAssignedTags(previousTags); // Revert
    } finally {
      setIsUpdatingTags(false);
    }
  }, [assignedTags, selectedConversationId, api]);

  // Save Customer Info
  const saveCustomerInfo = useCallback(async (updatedData: any) => {
    try {
      await api.post(`/conversations/${selectedConversationId}/update_customer_info`, updatedData);
    } catch (error) {
      console.error("Error updating customer info:", error);
      throw error;
    }
  }, [selectedConversationId, api]);

  return {
    conversation,
    allTags,
    assignedTags,
    templates,
    isUpdatingTags,
    handleToggleTag,
    saveCustomerInfo
  };
};