import React, { useState, useRef, useEffect } from "react";
import { WhatsAppTemplate } from "../types/template";
import { ScrollArea } from "../ui/scroll-area";

import { FileText, MapPin } from "lucide-react";

interface WhatsAppTemplateContentProps {
  template: WhatsAppTemplate;
  editable?: boolean;
  onTemplateChange?: (template: WhatsAppTemplate) => void;
}

const AutoResizeTextArea = ({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);
  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${className} min-h-[24px]`}
      style={{
        resize: "none",
        overflowY: "hidden",
        wordWrap: "break-word",
      }}
    />
  );
};

export const WhatsAppTemplateContent = ({
  template,
  editable = false,
  onTemplateChange,
}: WhatsAppTemplateContentProps) => {
  const [editableTemplate, setEditableTemplate] = useState(template);

  const getFormattedText = (text: string, type: string) => {
    let formattedText = text;

    // Handle formatting (bold, italic, strikethrough, monospace)
    formattedText = formattedText
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/_(.*?)_/g, '<em>$1</em>') // Italic
      .replace(/~~(.*?)~~/g, '<del>$1</del>') // Strikethrough
      .replace(/`(.*?)`/g, '<code>$1</code>'); // Monospace

    return formattedText;
  };

  const handleTextChange = (
    componentIndex: number,
    field: string,
    value: string
  ) => {
    const updatedComponents = [...(editableTemplate.components || [])];
    if (field === "text") {
      updatedComponents[componentIndex].text = value;
    } else if (
      field.startsWith("buttons-") &&
      Array.isArray(updatedComponents[componentIndex].buttons)
    ) {
      const btnIndex = Number(field.split("-")[1]);
      updatedComponents[componentIndex].buttons = updatedComponents[
        componentIndex
      ].buttons.map((btn: { type: string; text: string; value?: string }, index: number) =>
        index === btnIndex ? { ...btn, text: value } : btn
      );
    }
    const newTemplate = { ...editableTemplate, components: updatedComponents };
    setEditableTemplate(newTemplate);
    onTemplateChange?.(newTemplate);
  };


  const renderHeader = (component: { type: string; format?: string; example?: { header_handle?: string[], header_text?: string[] }; text?: string }, index: number) => {
    if (component.type !== "HEADER") return null;

    let text = component.text || "";
    if (component.example?.header_text?.[0]) {
      // Replace placeholders like {{1}}, {{2}}, etc.
      component.example.header_text.forEach((value, idx) => {
        text = text.replace(`{{${idx + 1}}}`, value);
      });
    }

    // if (component.example?.body_text?.[0]) {
    //   const bodyText = component.example.body_text[0];
    //   for (let idx = 0; idx < bodyText.length; idx++) {
    //     text = text.replace(`{{${idx + 1}}}`, bodyText[idx]);
    //   }
    // }
    // Render media if present
    if (component.format && component.example?.header_handle?.[0]) {
      const mediaUrl = component.example.header_handle[0];
      if (component.format === "IMAGE") {
        return (
          <div className="mb-4">
            <img src={mediaUrl} alt="Header Media" className="w-full h-auto rounded-lg" />
          </div>
        );
      } else if (component.format === "VIDEO") {
        return (
          <div className="mb-4">
            <video controls className="w-full h-auto rounded-lg">
              <source src={mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      } else if (component.format === "DOCUMENT") {
        // Extract file name from the URL
        const fileName = decodeURIComponent(
          mediaUrl.split("/").pop()?.replace(/\.[^/.]+$/, "") || "Document"
        );
  
        return (
          <div className="bg-gray-500 rounded-lg p-3 w-[300px] mb-4">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0">
                <FileText className="w-4 h-4 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">{fileName}</p>
                <p className="text-zinc-400 text-xs mt-0.5">Microsoft Edge PDF Document</p>
              </div>
            </div>
            <button 
              className="mt-2 w-full py-1.5 px-3 text-xs text-center text-white bg-zinc-700 hover:bg-zinc-600 rounded-md transition-colors"
            >
              Download
            </button>
          </div>
        );
      } 
    }

    if (component.format === "LOCATION") {
      return (
        <div className="bg-gray-400 rounded-lg p-3 w-[300px] mb-4">
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0">
              <MapPin className="w-4 h-4 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium">Current Location</p>
            </div>
          </div>
        </div>
      );
    }

    if (component.format === "TEXT" || !component.format) {
      return (
        <div className="mb-4 text-gray-800">
          {editable ? (
            <AutoResizeTextArea
              value={text}
              onChange={(e) => handleTextChange(index, "text", e.target.value)}
              className="w-full bg-transparent outline-none border-none p-0 text-gray-800 placeholder:text-gray-500 text-base leading-normal"
              placeholder="Header text here"
            />
          ) : (
            <div
              dangerouslySetInnerHTML={{ __html: getFormattedText(text, "HEADER") }}
              className="whitespace-pre-wrap text-base leading-normal"
            />
          )}
        </div>
      );
    }
    // Render text if no media is present
    
    return (
      <div className="mb-4 text-gray-800">
        {editable ? (
          <AutoResizeTextArea
            value={text}
            onChange={(e) => handleTextChange(index, "text", e.target.value)}
            className="w-full bg-transparent outline-none border-none p-0 text-gray-800 placeholder:text-gray-500 text-base leading-normal"
            placeholder="Header text here"
          />
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: getFormattedText(text, "HEADER") }}
            className="whitespace-pre-wrap text-base leading-normal"
          />
        )}
      </div>
    );
  };

  const renderBody = (component: { type: string; text?: string; example?: { body_text?: string[] } }, index: number) => {
    if (component.type !== "BODY") return null;
    let text = component.text || "";
    
    if (component.example?.body_text?.[0]) {
      const bodyText = component.example.body_text[0];
      for (let idx = 0; idx < bodyText.length; idx++) {
        text = text.replace(`{{${idx + 1}}}`, bodyText[idx]);
      }
    }


    return (
      <div className="mb-4 text-gray-800">
        {editable ? (
          <AutoResizeTextArea
            value={text}
            onChange={(e) => handleTextChange(index, "text", e.target.value)}
            className="w-full bg-transparent outline-none border-none p-0 text-gray-800 placeholder:text-gray-500 text-base leading-normal"
            placeholder="Message body will appear here"
          />
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: getFormattedText(text, "BODY") }}
            className="whitespace-pre-wrap text-base leading-normal"
          />
        )}
      </div>
    );
  };

  const renderFooter = (component: { type: string; text?: string }, index: number) => {
    if (component.type !== "FOOTER") return null;
    return (
      <div className="mt-2 mb-4 text-sm text-gray-500">
        {editable ? (
          <AutoResizeTextArea
            value={component.text || ""}
            onChange={(e) => handleTextChange(index, "text", e.target.value)}
            className="w-full bg-transparent outline-none border-none p-0 text-gray-500 placeholder:text-gray-400 text-sm leading-normal"
            placeholder="Footer text here"
          />
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: component.text || "" }}
            className="whitespace-pre-wrap text-sm leading-normal"
          />
        )}
      </div>
    );
  };

  const renderButtons = (component: { type: string; buttons: { type: string; text: string }[] }, index: number) => {
    if (component.type !== "BUTTONS") return null;
    return (
      <div className="space-y-2">
        {component.buttons.map((button, btnIndex) => (
          <button
            key={btnIndex}
            className="w-full p-3 text-center bg-gray-50 text-blue-500 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium"
          >
            {editable ? (
              <AutoResizeTextArea
                value={button.text || ""}
                onChange={(e) =>
                  handleTextChange(index, `buttons-${btnIndex}`, e.target.value)
                }
                className="w-full bg-transparent outline-none border-none p-0 text-blue-500 placeholder:text-gray-400 text-center text-sm font-medium"
                placeholder={`Button ${btnIndex + 1}`}
              />
            ) : (
              <span dangerouslySetInnerHTML={{ __html: button.text || "" }} />
            )}
          </button>
        ))}
      </div>
    );
  };


  return (
    <div className="max-w-md mx-auto">
      <ScrollArea className="h-[350px] rounded-lg">
        <div className="bg-[#E5DDD5] rounded-lg p-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            {editableTemplate.components?.map((component, index) => (
              <div key={index}>
                {renderHeader(component, index)}
                {renderBody(component, index)}
                {renderFooter(component, index)}
                {component.buttons ? renderButtons({ ...component, buttons: component.buttons || [] }, index) : null}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};