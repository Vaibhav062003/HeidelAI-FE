import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WhatsAppTemplate } from "../types/template";
import { WhatsAppTemplateContent } from "./WhatsApptemplateContent";
import { Share2, Upload, X } from "lucide-react";

interface WhatsAppTemplateDialogProps {
  template: WhatsAppTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onSend?: () => void;
  selectedConversationId?: string;
  languageCode?: string;
}

export const WhatsAppTemplateDialog = ({
  template,
  isOpen,
  onClose,
  onSend,
  selectedConversationId,
  languageCode
}: WhatsAppTemplateDialogProps) => {
  const [variables, setVariables] = useState<{ [key: string]: string }>({});
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [mediaId, setMediaId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (template) {
      const initialVariables: { [key: string]: string } = {};
      template.components?.forEach((component, index) => {
        if (component.type === "HEADER" && component.example?.header_text) {
          initialVariables[`header_0`] = component.example.header_text[0] || "";
        }
        if (component.type === "BODY" && component.example?.body_text) {
          const bodyText = component.example.body_text[0];
          if (Array.isArray(bodyText)) {
            bodyText.forEach((text, idx) => {
              initialVariables[`body_${idx}`] = text || "";
            });
          }
        }
      });
      setVariables(initialVariables);
    }
  }, [template]);

  const handleInputChange = (key: string, value: string) => {
    setVariables((prev) => ({ ...prev, [key]: value }));
  };

  const handleRemoveFile = () => {
    setPreviewFile(null);
    setMediaId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const sendMessage = async (payload: Record<string, unknown>) => {
    try {
      const response = await fetch("https://egenie-whatsapp.koyeb.app/api/send_whatsapp_template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("Message sent successfully!");
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
    console.log("Payload:", JSON.stringify(payload));
    onClose();
  };

  const constructPayload = (template: WhatsAppTemplate, selectedConversationId: string) => {
    const [messagingProduct, recipientPhoneNumber] = selectedConversationId.split('_');
    const components = [];
  
    // Header Component
    if (template.components?.some((c) => c.type === "HEADER")) {
      const headerComponent = template.components.find((c) => c.type === "HEADER");
  
      if (headerComponent?.format === "TEXT") {
        const headerText = variables["header_0"] || headerComponent?.example?.header_text?.[0] || "";
        
        components.push({
          "type": "header",
          "parameters": [
            {
              "type": "text",
              "text": headerText,
            },
          ],
        });
      } else if (headerComponent?.format === "IMAGE" || headerComponent?.format === "VIDEO" || headerComponent?.format === "DOCUMENT") {
        components.push({
          "type": "header",
          "parameters": [
            {
              "type": headerComponent.format.toLowerCase(), // "image", "video", or "document"
              [headerComponent.format.toLowerCase()]: {
                id: mediaId, // Use the media_id from the uploaded file
              },
            },
          ],
        });
      } else if (headerComponent?.format === "LOCATION") {
        const locationText = headerComponent?.text || "Current Location";
  
        components.push({
          "type": "header",
          "parameters": [
            {
              "type": "location",
              "location": {
                "longitude": -122.425332, // Replace with actual longitude
                "latitude": 37.758056, // Replace with actual latitude
                "name": locationText,
                "address": "Address here", // Replace with actual address
              },
            },
          ],
        });
      }
    }
  
    // Body Component
    if (template.components?.some((c) => c.type === "BODY")) {
      const bodyComponent = template.components.find((c) => c.type === "BODY");
      const bodyTextValues = Array.isArray(bodyComponent?.example?.body_text?.[0])
        ? bodyComponent.example.body_text[0]
        : [];
  
      const updatedBodyTextValues = bodyTextValues.map((value, index) => variables[`body_${index}`] || value);
  
      components.push({
        "type": "body",
        "parameters": updatedBodyTextValues.map((value) => ({
          "type": "text",
          "text": value,
        })),
      });
    }
  
    // Buttons Component
    if (template.components?.some((c) => c.type === "BUTTONS")) {
      const buttonsComponent = template.components.find((c) => c.type === "BUTTONS");
      const buttons = buttonsComponent?.buttons || [];
  
      buttons.forEach((button, index) => {
        const parameters = [];
        if (button.type === "url") {
          parameters.push({
            type: "text",
            text: button.text,
          });
        } else if (button.type === "reply" || button.type === "copy") {
          parameters.push({
            type: "payload",
            payload: button.text,
          });
        } else if (button.type === "phone") {
          parameters.push({
            type: "phone_number",
            phone_number: button.text,
          });
        }
  
        components.push({
          type: "button",
          sub_type: button.type === "reply" ? "quick_reply" : button.type,
          index: index.toString(),
          parameters: parameters,
        });
      });
    }
  
    // Carousel Component
    if (template.components?.some((c) => c.type === "CAROUSEL")) {
      const carouselComponent = template.components.find((c) => c.type === "CAROUSEL");
  
      if (carouselComponent) {
        const carouselCards = carouselComponent.cards?.map((card, cardIndex) => {
          const cardComponents = card.components.map((cardComponent) => {
            if (cardComponent.type === "HEADER" && cardComponent.format === "IMAGE") {
              return {
                type: "header",
                parameters: [
                  {
                    type: "image",
                    image: {
                      id: mediaId, // Use the media_id from the uploaded file
                    },
                  },
                ],
              };
            } else if (cardComponent.type === "BODY") {
              const bodyTextValues = Array.isArray(cardComponent.example?.body_text?.[0])
                ? cardComponent.example?.body_text[0]
                : [];
  
              const updatedBodyTextValues = bodyTextValues.map((value, index) => variables[`body_${index}`] || value);
  
              return {
                type: "body",
                parameters: updatedBodyTextValues.map((value) => ({
                  type: "text",
                  text: value,
                })),
              };
            } else if (cardComponent.type === "BUTTONS") {
              const buttons = cardComponent.buttons || [];
  
              return {
                type: "button",
                sub_type: "quick_reply",
                index: "0",
                parameters: buttons.map((button) => ({
                  type: "text",
                  text: button.text,
                })),
              };
            }
            return null;
          }).filter(Boolean);
  
          return {
            card_index: cardIndex,
            components: cardComponents,
          };
        });
  
        components.push({
          type: "carousel",
          cards: carouselCards,
        });
      }
    }
  
    // Final Payload
    return {
      "messaging_product": messagingProduct,
      "recipient_type": "individual",
      "to": recipientPhoneNumber,
      "type": "template",
      "template": {
        "name": template.name, // Template name
        "language": {
          code: languageCode || "en_US", // Dynamic language code
        },
        "components": components,
      },
    };
  };

  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Template Preview</DialogTitle>
          <p>{template.name}</p>
        </DialogHeader>
        <div className="py-2">
          <WhatsAppTemplateContent 
            template={template} 
            onInputChange={handleInputChange} 
            setMediaId={setMediaId} 
            setPreviewFile={setPreviewFile} 
          />
        </div>
        <div className="flex justify-end mt-2">
          <Button
            variant="outline"
            onClick={async () => {
              if (template && selectedConversationId) {
                // Wait for mediaId to be set before sending the payload
                if (!mediaId && previewFile) {
                  console.log("Waiting for media upload...");
                  return;
                }
                const payload = constructPayload(template, selectedConversationId);
                await sendMessage(payload); // Send the payload to the endpoint
              }
            }}
          >
            <Share2 className="h-5 w-5" />
            <span className="font-medium">Share in Chat</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};