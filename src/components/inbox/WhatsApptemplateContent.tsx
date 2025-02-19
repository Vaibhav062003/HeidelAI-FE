import React from "react";
import { WhatsAppTemplate } from "../types/template";
import { ScrollArea } from "../ui/scroll-area";
import { FileText, MapPin } from "lucide-react";

interface WhatsAppTemplateContentProps {
  template: WhatsAppTemplate;
}

export const WhatsAppTemplateContent: React.FC<WhatsAppTemplateContentProps> = ({ template }) => {

  // Add this helper function at the top of your component
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

  const renderVariableText = (
    text: string,
    variables: string[] = [],
    isHeader: boolean = false
  ): React.ReactNode => {
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
            defaultValue={exampleValue}
            placeholder={exampleValue || "Enter value"}
            className="inline-block px-1 mx-1 "
            style={{
              width: `${isHeader ? calculateInputWidth(exampleValue, 16) : calculateInputWidth(exampleValue)}px`,
            }}
          />
        );
      }
      return <span key={index}>{part}</span>;
    });
  };


  // Helper function to replace placeholders with example value

  // Render Header Component
  const renderHeader = (component: { type: string; text?: string; format?: string; example?: { header_text?: string[], header_handle?: string[] } }) => {
    if (component.type !== "HEADER") return null;

    const text = component.text || "";
    const exampleValues = component.example?.header_text;

    // Render media if present
    if (component.format && component.example?.header_handle?.[0]) {
      const mediaUrl = component.example.header_handle[0];

      switch (component.format) {
        case "IMAGE":
          return (
            <div className="mb-4">
              <img src={mediaUrl} alt="Header" className="w-full h-auto rounded-md" />
            </div>
          );
        case "VIDEO":
          return (
            <div className="mb-4">
              <video controls className="w-full rounded-md">
                <source src={mediaUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          );
        case "DOCUMENT":
          return (
            <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-md">
                  
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">PDF Document</span>
                  <span className="text-xs text-gray-500">Attached</span>
                </div>
              </div>
              <a 
                href={mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 rounded transition-colors"
              >
                <FileText className="w-6 h-6 text-gray-600" />
              </a>
            </div>
          );
        case "LOCATION":
          return (
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="text-gray-500" size={16} />
              <span>{text || "Current Location"}</span>
            </div>
          );
        default:
          return null;
      }
    }

    return(
      <h3 className="text-[16px] font-semibold text-[#1a1a1a] mb-3">
        {renderVariableText(text, exampleValues || [], true)}
      </h3>
      )
  };

  // Render Body Component
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
              className="inline-block px-1 mx-1"
              style={{ width: `${calculateInputWidth(exampleValue)}px` }}
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



  // Render Footer Component
  const renderFooter = (component: { type: string; text?: string }) => {
    if (component.type !== "FOOTER") return null;

    return <p className="text-[13px] text-gray-500 italic mb-2">{component.text}</p>;
  };

  // Render Buttons Component
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
    <ScrollArea className="max-h-[400px]">
      <div className="bg-[#f0f2f5] p-4 min-h-[300px]">
        <div className="max-w-[600px] mx-auto bg-white rounded-lg shadow-sm p-4 space-y-3">
          {template.components?.map((component, index) => (
            <div key={index} className="message-bubble">
              {renderHeader(component)}
              {renderBody(component,index)}
              {renderFooter(component)}
              {component.buttons && (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  {renderButtons({ type: component.type, buttons: component.buttons.filter(button => button.text) })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};