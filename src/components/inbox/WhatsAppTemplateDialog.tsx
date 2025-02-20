import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WhatsAppTemplate } from "../types/template";
import { WhatsAppTemplateContent } from "./WhatsApptemplateContent";

interface WhatsAppTemplateDialogProps {
  template: WhatsAppTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onSend?: () => void;
}

export const WhatsAppTemplateDialog = ({
  template,
  isOpen,
  onClose,
  onSend,
}: WhatsAppTemplateDialogProps) => {
  const [variables, setVariables] = useState<{ [key: string]: string }>({});

  const handleInputChange = (key: string, value: string) => {
    setVariables((prev) => ({ ...prev, [key]: value }));
  };

  const sendMessage = async (payload: Record<string, unknown>) => {
    console.log("Message sent successfully!", payload);
  };

  const constructPayload = (template: WhatsAppTemplate, recipientPhoneNumber: string) => {
    const components = [];

    // Header Component
    if (template.components?.some((c) => c.type === "HEADER")) {
      const headerComponent = template.components.find((c) => c.type === "HEADER");

      if (headerComponent?.format === "TEXT") {
        const headerText = variables["header_0"] || headerComponent?.example?.header_text?.[0] || "";

        components.push({
          type: "header",
          parameters: [
            {
              type: "text",
              text: headerText,
            },
          ],
        });
      } else if (headerComponent?.format === "IMAGE" || headerComponent?.format === "VIDEO" || headerComponent?.format === "DOCUMENT") {
        const mediaUrl = headerComponent?.example?.header_handle?.[0];

        components.push({
          type: "header",
          parameters: [
            {
              type: headerComponent.format.toLowerCase(), // "image", "video", or "document"
              [headerComponent.format.toLowerCase()]: {
                link: mediaUrl, // URL of the media
              },
            },
          ],
        });
      } else if (headerComponent?.format === "LOCATION") {
        const locationText = headerComponent?.text || "Current Location";

        components.push({
          type: "header",
          parameters: [
            {
              type: "location",
              location: {
                longitude: -122.425332, // Replace with actual longitude
                latitude: 37.758056, // Replace with actual latitude
                name: locationText,
                address: "Address here", // Replace with actual address
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
        type: "body",
        parameters: updatedBodyTextValues.map((value) => ({
          type: "text",
          text: value,
        })),
      });
    }

    // Footer Component
    if (template.components?.some((c) => c.type === "FOOTER")) {
      const footerComponent = template.components.find((c) => c.type === "FOOTER");
      const footerText = footerComponent?.text || "";

      components.push({
        type: "footer",
        text: footerText,
      });
    }

    // Buttons Component
    if (template.components?.some((c) => c.type === "BUTTONS")) {
      const buttonsComponent = template.components.find((c) => c.type === "BUTTONS");
      const buttons = buttonsComponent?.buttons || [];

      buttons.forEach((button, index) => {
        components.push({
          type: "button",
          sub_type: button.type === "URL" ? "url" : "quick_reply",
          index: index,
          parameters: [
            {
              type: button.type === "URL" ? "text" : "payload",
              text: button.text, // For URL buttons
              payload: button.text, // For quick reply buttons
            },
          ],
        });
      });
    }

    // Final Payload
    return {
      messaging_product: "whatsapp",
      to: recipientPhoneNumber,
      type: "template",
      template: {
        name: template.name, // Template name
        language: {
          code: "en_US", // Language code
        },
        components: components,
      },
    };
  };

  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Template Preview</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <WhatsAppTemplateContent template={template} onInputChange={handleInputChange} />
        </div>
        <div className="flex justify-end mt-2">
          <Button
            onClick={() => {
              if (template) {
                const payload = constructPayload(template, "+1234567890");
                sendMessage(payload); // Logs the payload to the console
              }
            }}
          >
            Share in Chat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

