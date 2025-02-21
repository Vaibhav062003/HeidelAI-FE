/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { WhatsAppTemplate } from "../types/template";
import { ScrollArea } from "../ui/scroll-area";
import { FileText, MapPin } from "lucide-react";
import { Upload, X } from "lucide-react";

interface WhatsAppTemplateContentProps {
  template: WhatsAppTemplate;
  languageCode?: string;
  setMediaId: (id: string | null) => void;
  setPreviewFile: (url: string | null) => void;
}

export const WhatsAppTemplateContent: React.FC<WhatsAppTemplateContentProps & { onInputChange: (key: string, value: string) => void }> = ({ template, onInputChange, languageCode, setMediaId, setPreviewFile }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [localPreviewFile, setLocalPreviewFile] = useState<string | null>(null);

  const calculateInputWidth = (text: string, fontSize: number = 14): number => {
    const span = document.createElement("span");
    span.style.visibility = "hidden";
    span.style.position = "absolute";
    span.style.fontSize = `${fontSize}px`;
    span.style.fontFamily = "inherit";
    span.innerText = text || "";
    document.body.appendChild(span);
    const width = span.offsetWidth;
    document.body.removeChild(span);
    return width + 25; // Add padding
  };

  const calculateHeaderInputWidth = (text: string): number => {
    const span = document.createElement('span');
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.fontSize = '16px';
    span.style.fontFamily = 'inherit';
    span.style.fontWeight = '600'; // Add bold font weight for header
    span.innerText = text;
    document.body.appendChild(span);
    const width = span.offsetWidth;
    document.body.removeChild(span);
    return width + 20;
  };

  const renderVariableText = (text: string, variables: string[] = [], isHeader: boolean = false) => {
    const parts = text.split(/(\{\{\d+\}\})/g);
  
    return parts.map((part, index) => {
      const match = part.match(/\{\{(\d+)\}\}/);
      if (match) {
        const varIndex = parseInt(match[1], 10) - 1;
        const exampleValue = variables[varIndex] || "";
        return (
          <input
            key={index}
            type="text"
            value={exampleValue}
            placeholder={exampleValue || "Enter value"}
            className={`inline-block px-1 mx-1 ${isHeader ? 'font-semibold' : ''}`}
            style={{ width: `${isHeader ? calculateHeaderInputWidth(exampleValue) : calculateInputWidth(exampleValue)}px` }}
            onChange={(e) => onInputChange(`${isHeader ? 'header' : 'body'}_${varIndex}`, e.target.value)}
          />
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const renderHeader = (component: { type: string; text?: string; format?: string; example?: { header_text?: string[], header_handle?: string[] } }) => {
    if (component.type !== "HEADER") return null;
  
    const text = component.text || "";
    const exampleValues = component.example?.header_text;
  
    // Render media upload option if present
    if (component.format) {
      const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const fileUrl = URL.createObjectURL(file);
          setLocalPreviewFile(fileUrl);
          setPreviewFile(fileUrl);
      
          // Upload the file to the endpoint
          const formData = new FormData();
          formData.append("file", file);
      
          try {
            const response = await fetch("https://egenie-whatsapp.koyeb.app/api/media/upload", {
              method: "POST",
              body: formData,
            });
      
            if (response.ok) {
              const data = await response.json();
              setMediaId(data.media_id); // Save the media_id from the response
              console.log("Uploaded media_id:", data.media_id); // Log the media_id to the console
            } else {
              console.error("Failed to upload media");
            }
          } catch (error) {
            console.error("Error uploading media:", error);
          }
        }
      };
  
      const handleRemoveFile = () => {
        setLocalPreviewFile(null);
        setMediaId(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
  
      return (
        <div className="mb-4">
          {!localPreviewFile ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center w-full px-4 py-2 bg-gray-400 text-white rounded-md text-sm hover:bg-[#128C7E] transition-colors"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload {component.format.toLowerCase()}
            </button>
          ) : (
            <div className="relative">
              {component.format === "IMAGE" && (
                <img
                  src={localPreviewFile}
                  alt="Header"
                  className="w-full h-auto max-h-[300px] object-contain rounded-md"
                />
              )}
              {component.format === "VIDEO" && (
                <video controls className="w-full rounded-md max-h-[300px] object-contain">
                  <source src={localPreviewFile} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {component.format === "DOCUMENT" && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-md">
                      <FileText className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">PDF Document</span>
                      <span className="text-xs text-gray-500">Attached</span>
                    </div>
                  </div>
                  <a 
                    href={localPreviewFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 rounded transition-colors"
                  >
                    <FileText className="w-6 h-6 text-gray-600" />
                  </a>
                </div>
              )}
              {component.format === "LOCATION" && (
                <div className="flex items-center gap-2">
                  <MapPin className="text-gray-500" size={16} />
                  <span>{text || "Current Location"}</span>
                </div>
              )}
              <button
                onClick={handleRemoveFile}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      );
    }
  
    return (
      <h3 className="text-[16px] font-semibold text-[#1a1a1a] mb-3">
        {renderVariableText(text, exampleValues || [], true)}
      </h3>
    );
  };

  const renderBody = (component: { type: string; text?: string; example?: { body_text?: string[] } }, index: number) => {
    if (component.type !== "BODY") return null;

    const text = component.text || "";
    const exampleValues = component.example?.body_text?.[0];

    // Process markdown and variables
    const processText = (text: string) => {
      const parts = text.split(/(\{\{\d+\}\})|(\*\*.*?\*\*)|(_.*?_)|(~~.*?~~)|(`.*?`)/g);

      return parts.map((part, idx) => {
        if (!part) return null;

        const varMatch = part.match(/\{\{(\d+)\}\}/);
        if (varMatch) {
          const varIndex = parseInt(varMatch[1]) - 1;
          const exampleValue = exampleValues?.[varIndex] || '';
          return (
            <input
              key={idx}
              type="text"
              defaultValue={exampleValue}
              placeholder={exampleValue}
              className="inline-block px-1 mx-1 border border-gray-300 rounded focus:outline-none focus:border-[#25D366] text-sm"
              style={{ width: `${calculateInputWidth(exampleValue)}px` }}
              onChange={(e) => onInputChange(`body_${varIndex}`, e.target.value)}
            />
          );
        }

        // Process markdown
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={idx}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('_') && part.endsWith('_')) {
          return <em key={idx}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('~~') && part.endsWith('~~')) {
          return <del key={idx}>{part.slice(2, -2)}</del>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={idx}>{part.slice(1, -1)}</code>;
        }

        return <span key={idx}>{part}</span>;
      });
    };

    // Split text by newlines and create multiple paragraphs
    const paragraphs = text.split('\n').filter(Boolean);

    return (
      <div className="text-gray-800 mb-4">
        {paragraphs.map((paragraph, idx) => (
          <p key={idx} className={idx < paragraphs.length - 1 ? 'mb-2' : ''}>
            {processText(paragraph)}
          </p>
        ))}
      </div>
    );
  };

  const renderFooter = (component: { type: string; text?: string }) => {
    if (component.type !== "FOOTER") return null;
    return <p className="text-[13px] text-gray-500 italic mb-2">{component.text}</p>;
  };

  const renderButtons = (component: { type: string; buttons: { text: string }[] }) => {
    if (component.type !== "BUTTONS") return null;

    return (
      <div className="flex flex-col gap-2 w-full">
        {component.buttons.map((button: { text: string }, index: number) => (
          <button
            key={index}
            className="w-full px-4 py-2 bg-[#25D366] text-white rounded-md text-sm hover:bg-[#128C7E] transition-colors"
          >
            {button.text}
          </button>
        ))}
      </div>
    );
  };

  return (
    <ScrollArea className="max-h-[400px] overflow-y-auto">
      <div className="bg-[#f0f2f5] p-4 min-h-[300px]">
        <div className="max-w-[600px] mx-auto bg-white rounded-lg shadow-sm p-4 space-y-3">
          {template.components?.map((component, index) => (
            <div key={index} className="message-bubble">
              {renderHeader(component)}
              {renderBody(component, index)}
              {renderFooter(component)}
              {component.buttons && renderButtons({ type: component.type, buttons: component.buttons.filter(button => button && button.text) })}
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};