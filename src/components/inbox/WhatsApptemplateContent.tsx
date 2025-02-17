import React, { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
 // Adjust the import path accordingly
import { WhatsAppTemplate } from "../types/template";
import { ScrollArea } from "../ui/scroll-area";
import { Variable } from "../types/template_types";

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
  const [variables, setVariables] = useState<Variable[]>([]);

  const getFormatedText = (text: string, type: string) => {
    let formattedText = text;
  
    // Replace variables with their example values
    variables
      .filter((v) => v.section === type)
      .forEach((variable) => {
        const regex = new RegExp(`{{${variable.name}}}`, "g");
        formattedText = formattedText.replace(regex, variable.example);
      });
  
    // Handle formatting (bold, italic, strikethrough, monospace)
    formattedText = formattedText
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold
    .replace(/_(.*?)_/g, '<em>$1</em>')               // Italic
    .replace(/~~(.*?)~~/g, '<del>$1</del>')           // Strikethrough
    .replace(/`(.*?)`/g, '<code>$1</code>');   // Monospace
  
    // Ensure all remaining placeholders are replaced (including numeric ones)
    formattedText = formattedText.replace(
      /{{(\d+)}}/g, // Match numeric placeholders like {{1}}, {{2}}, etc.
      (_, number) => {
        const variable = variables.find((v) => v.name === number && v.section === type);
        return variable ? variable.example : `{{${number}}}`; // Fallback if no match
      }
    );
  
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
      ].buttons.map((btn: any, index: number) =>
        index === btnIndex ? { ...btn, text: value } : btn
      );
    }
    const newTemplate = { ...editableTemplate, components: updatedComponents };
    setEditableTemplate(newTemplate);
    onTemplateChange?.(newTemplate);
  };

  const renderBody = (component: any, index: number) => {
    if (component.type !== "BODY") return null;

    let text = component.text || "";
    if (component.example?.body_text?.[0]) {
      component.example.body_text[0].forEach((value: string, idx: number) => {
        text = text.replace(`{{${idx + 1}}}`, value);
      });
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
            dangerouslySetInnerHTML={{ __html: getFormatedText(text, "BODY") }}
            className="whitespace-pre-wrap text-base leading-normal"
          />
        )}
      </div>
    );
  };

  const renderFooter = (component: any, index: number) => {
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

  const renderButtons = (component: any, index: number) => {
    if (component.type !== "BUTTONS") return null;

    return (
      <div className="space-y-2">
        {component.buttons.map((button: any, btnIndex: number) => (
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
                {renderBody(component, index)}
                {renderFooter(component, index)}
                {renderButtons(component, index)}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};