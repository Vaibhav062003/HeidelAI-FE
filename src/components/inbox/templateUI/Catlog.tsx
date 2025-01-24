import React, { useState } from "react";
import { LightbulbIcon, AlertCircle, Trash2, Smile } from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

type Variable = {
  id: string;
  name: string;
  type: "text" | "number" | "date" | "currency" | "datetime";
  example: string;
  section: "header" | "body";
};

type Button = {
  id: string;
  type: "reply" | "url" | "phone" | "copy";
  text: string;
  content: string;
  value: string;
};

interface CatalogProps {
  templateName: string;
  setTemplateName: (name: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  messageBody: string;
  setMessageBody: (body: string) => void;
  button: Button[];
  headerType: "text" | "image" | "video" | "document" | "location" | "none";
  headerContent: string | null;
  languages: string[];
  previewFile: string | null;
  setPreviewFile: (file: string | null) => void;
  header: string;
  headerVariables: Variable[];
  bodyVariables: Variable[];
  footer: string;
  insertVariable: (variable: Variable) => void;
  removeVariable: (id: string) => void;
  setFooter: (footer: string) => void;
}

export const Catalog: React.FC<CatalogProps> = ({
  templateName,
  setTemplateName,
  language,
  setLanguage,
  messageBody,
  setMessageBody,
  languages,
  footer,
  setFooter,
  bodyVariables,
  insertVariable,
  removeVariable,
}) => {
  const [catalogFormat, setCatalogFormat] = useState<
    "catalog" | "multi-product"
  >("catalog");
  const buttonText = "View catalog";
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const handleEmojiSelect = (emoji: any) => {
    // Append selected emoji to message body
    setMessageBody(messageBody + emoji.native);
    setEmojiPickerVisible(false); // Optionally hide picker after selection
  };

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const applyFormatting = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // No text selected
    if (start === end) {
      return; // Optionally handle this case
    }

    // Get selected text
    const selectedText = messageBody.substring(start, end);
    let formattedText = "";

    // Apply formatting based on type
    switch (format) {
      case "bold":
        formattedText = `*${selectedText}*`; // Markdown style for bold
        break;
      case "italic":
        formattedText = `_${selectedText}_`; // Markdown style for italic
        break;
      case "strikethrough":
        formattedText = `~${selectedText}~`; // Markdown style for strikethrough
        break;
      default:
        return; // Invalid format type
    }

    // Update message body
    const newMessageBody =
      messageBody.substring(0, start) +
      formattedText +
      messageBody.substring(end);

    setMessageBody(newMessageBody);

    // Set cursor position
    setTimeout(() => {
      textarea.focus(); // Ensure the textarea is focused
      textarea.selectionStart = start;
      textarea.selectionEnd = start + formattedText.length;
    }, 0);
  };

  return (
    <div className="grid gap-5">
      <div className="space-y-6 px-2">
        {/* Template Name and Language Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template name
            </label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter a template name"
              className="w-full p-2 border rounded-md"
              maxLength={512}
            />
            <div className="text-xs text-gray-500 mt-1">
              {templateName.length} / 512
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Catalog Format Section */}
        <div className="bg-gray-600">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-3">
              Catalog format
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Choose the message format that best fits your needs.
            </p>

            <div
              className="space-y-4"
              role="radiogroup"
              aria-labelledby="catalog-format"
            >
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  checked={catalogFormat === "catalog"}
                  onChange={() => setCatalogFormat("catalog")}
                  className="mt-1"
                  name="catalogFormat"
                  aria-label="Catalog message"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    Catalog message
                  </span>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Include the entire catalog to give your users a
                    comprehensive view of all your products.
                  </p>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  checked={catalogFormat === "multi-product"}
                  onChange={() => setCatalogFormat("multi-product")}
                  className="mt-1"
                  name="catalogFormat"
                  aria-label="Multi-product message"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    Multi-product message
                  </span>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Include up to 30 products from the catalog.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Catalog Setup Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-3">
            Catalog setup
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Connecting a catalog will allow customers to view, message and send
            carts containing your products and services via WhatsApp.{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Learn More
            </a>
          </p>

          <div className="bg-gray-50 p-4 rounded-md flex items-start space-x-3 mb-4">
            <AlertCircle
              className="h-5 w-5 text-gray-500 mt-0.5"
              aria-hidden="true"
            />
            <p className="text-sm text-gray-600">
              Please note that you cannot add media to this template. Instead,
              you can link your catalog to showcase your products.
            </p>
          </div>

          <button className="bg-[#00A884] text-white px-4 py-2 rounded-md hover:bg-[#008f70] transition-colors">
            Connect Catalog
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {bodyVariables.map((variable) => (
            <div
              key={variable.id}
              className="flex items-center justify-between p-2 border rounded-md bg-white"
            >
              <div>
                <span className="text-sm font-medium">{variable.name}</span>
                <p className="text-sm text-gray-600">Type: {variable.type}</p>
                <p className="text-sm text-gray-600">
                  Example: {variable.example}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => insertVariable(variable)}
                  className="text-blue-500 hover:text-blue-600 text-sm"
                >
                  Insert
                </button>
                <button
                  onClick={() => removeVariable(variable.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Message Body Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message Body
          </label>
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              placeholder="Enter your message"
              className="w-full p-2 border rounded-md h-32 bg-white"
              maxLength={1024}
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              {/* Emoji Picker Toggle */}
              <div className="relative">
                <button
                  className="p-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setEmojiPickerVisible((prev) => !prev)}
                  aria-label="Toggle emoji picker"
                >
                  <Smile size={16} />
                </button>
                {emojiPickerVisible && (
                  <div className="absolute mt-2 z-50 bg-white border rounded shadow-lg">
                    <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                  </div>
                )}
              </div>

              {/* Formatting Buttons */}
              <button
                className="p-1 text-gray-500 hover:text-gray-700"
                onClick={() => applyFormatting("bold")}
                aria-label="Bold"
              >
                <span className="font-bold">B</span>
              </button>
              <button
                className="p-1 text-gray-500 hover:text-gray-700"
                onClick={() => applyFormatting("italic")}
                aria-label="Italic"
              >
                <span className="italic">I</span>
              </button>
              <button
                className="p-1 text-gray-500 hover:text-gray-700"
                onClick={() => applyFormatting("strikethrough")}
                aria-label="Strikethrough"
              >
                <span className="line-through">S</span>
              </button>
              <button
                className="p-1 text-gray-500 hover:text-gray-700"
                aria-label="Insert code"
              >
                <code>&lt;/&gt;</code>
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {messageBody.length} / 1024
          </div>
        </div>

        {/* Footer Section */}
        <div className="border p-4 rounded-lg bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Footer (Optional)
          </label>
          <textarea
            placeholder="Enter footer text"
            value={footer}
            onChange={(e) => setFooter(e.target.value)}
            maxLength={60}
            className="w-full p-2 border rounded-md"
          />
          <div className="text-sm text-gray-500 mt-1">{footer.length}/60</div>
        </div>
      </div>

      {/* Button Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-3">Button</h2>

        <div className="bg-gray-50 p-4 rounded-md flex items-start space-x-3 mb-4">
          <LightbulbIcon
            className="h-5 w-5 text-gray-500 mt-0.5"
            aria-hidden="true"
          />
          <p className="text-sm text-gray-600">
            Only one button is supported for this type of template. The button
            text is not editable.
          </p>
        </div>

        <div>
          <label
            htmlFor="buttonText"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Button Text
          </label>
          <div className="relative">
            <input
              id="buttonText"
              type="text"
              value={buttonText}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
              maxLength={25}
              aria-label="Button text (not editable)"
            />
            <span
              className="absolute right-3 top-2.5 text-sm text-gray-500"
              aria-live="polite"
            >
              {buttonText.length}/25
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
