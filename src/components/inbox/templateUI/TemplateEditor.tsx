import React, { useState } from "react";
import { Plus, Trash2, Info, Upload, MapPin, Smile } from "lucide-react";
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
  value?: string;
};

interface AppSetup {
  packageName: string;
  signatureHash: string;
  templateType: string;
}

interface TemplateEditorProps {
  templateName: string;

  setTemplateName: (name: string) => void;

  language: string;

  setLanguage: (language: string) => void;

  variables: Variable[];

  setVariables: (variables: Variable[]) => void;

  showVariableModal: boolean;

  setShowVariableModal: (show: boolean) => void;

  messageBody: string;

  setMessageBody: (body: string) => void;

  header: string;

  setHeader: (header: string) => void;

  newVariable: Variable;

  setNewVariable: (variable: Variable) => void;

  footer: string;

  setFooter: (footer: string) => void;

  button: Button[];

  showButtonModal: boolean;

  setShowButtonModal: (show: boolean) => void;

  newButton: Button;

  headerType: string;

  setHeaderType: (type: string) => void;

  headerContent: string | null;

  setHeaderContent: (content: string | null) => void;

  previewFile: string | null;

  setPreviewFile: (file: string | null) => void;

  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;

  insertVariable: (variable: Variable) => void;

  removeVariable: (id: string) => void;

  removeButton: (id: string) => void;

  languages: string[];

  headerVariables: Variable[];
  bodyVariables: Variable[];

  onAddVariable: (variable: Variable) => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;
  templateType: string;
}

const headerTypes = [
  { value: "text", label: "Text" },
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
  { value: "document", label: "Document" },
  { value: "location", label: "Location" },
];

// Add this line to define the languages array
export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  templateName,
  setTemplateName,
  language,
  setLanguage,
  setShowVariableModal,
  messageBody,
  setMessageBody,
  header,
  setHeader,
  newVariable,
  setNewVariable,
  footer,
  setFooter,
  button,
  setShowButtonModal,
  headerType,
  setHeaderType,
  headerContent,
  setHeaderContent,
  setPreviewFile,
  handleFileUpload,
  insertVariable,
  removeVariable,
  removeButton,
  languages,
  headerVariables,
  bodyVariables,
  onAddVariable,
  activeTab,
  setActiveTab,
  templateType,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [codeDeliveryMethod, setCodeDeliveryMethod] = useState<
    "zero-tap" | "one-tap" | "copy"
  >("zero-tap");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [apps, setApps] = useState<AppSetup[]>([
    { packageName: "", signatureHash: "", templateType: "" },
  ]);
  const [addSecurityRecommendation, setAddSecurityRecommendation] =
    useState(true);
  const [addExpirationTime, setAddExpirationTime] = useState(false);
  const [customValidityPeriod, setCustomValidityPeriod] = useState(false);
  const [validityPeriod, setValidityPeriod] = useState("10 minutes");
  const [autofillText, setAutofillText] = useState("Autofill");
  const [copyCodeText, setCopyCodeText] = useState("Copy code");
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const handleEmojiSelect = (emoji: any) => {
    // Append selected emoji to message body
    setMessageBody(messageBody + emoji.native);
    setEmojiPickerVisible(false); // Optionally hide picker after selection
  };

  const validityPeriods = [
    "10 minutes",
    "30 minutes",
    "1 hour",
    "2 hours",
    "3 hours",
    "4 hours",
    "5 hours",
    "6 hours",
  ];

  const addApp = () => {
    if (apps.length < 5) {
      setApps([
        ...apps,
        { packageName: "", signatureHash: "", templateType: "" },
      ]);
    }
  };

  const updateApp = (index: number, field: keyof AppSetup, value: string) => {
    const newApps = [...apps];
    newApps[index] = { ...newApps[index], [field]: value };
    setApps(newApps);
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
    <div className="space-y-6">
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
      {(activeTab === "marketing" || activeTab === "utility") && (
        <>
          {/* Header Section */}
          {/* Header Section with Variables */}
          <div className="border p-4 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Header (Optional)</h3>
              <button
                onClick={() => {
                  setNewVariable({ ...newVariable, section: "header" });
                  setShowVariableModal(true);
                }}
                disabled={headerVariables.length >= 5}
                className="text-blue-500 hover:text-blue-600 disabled:text-gray-400 text-sm flex items-center gap-1"
              >
                <Plus size={16} />
                Add Header Variable
              </button>
            </div>

            {/* Header Variables */}
            <div className="space-y-2 mb-4">
              {headerVariables.map((variable) => (
                <div
                  key={variable.id}
                  className="flex items-center justify-between p-2 border rounded-md bg-white"
                >
                  <div>
                    <span className="text-sm font-medium">{variable.name}</span>
                    <p className="text-sm text-gray-600">
                      Type: {variable.type}
                    </p>
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

            {/* Header Input */}
            <div>
              <div className="mb-6">
                <select
                  value={headerType}
                  onChange={(e) => {
                    setHeaderType(e.target.value);
                    setHeaderContent(null);
                    setPreviewFile(null);
                  }}
                  className="w-full p-2 border rounded-md mb-4"
                >
                  {headerTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>

                {headerType === "text" && (
                  <input
                    type="text"
                    value={headerContent || ""}
                    onChange={(e) => {
                      setHeaderContent(e.target.value);
                      setHeader(e.target.value); // Sync header
                    }}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter header text"
                  />
                )}

                {(headerType === "image" ||
                  headerType === "video" ||
                  headerType === "document") && (
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept={
                        headerType === "image"
                          ? "image/*"
                          : headerType === "video"
                          ? "video/*"
                          : "*"
                      }
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="mx-auto w-8 h-8 mb-2" />
                      <p>Click to upload {headerType}</p>
                    </label>
                  </div>
                )}

                {headerType === "location" && (
                  <div className="border rounded-lg p-4">
                    <MapPin className="w-6 h-6 mb-2" />
                    <p>Location will be requested when sending</p>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {header.length} / 60
              </div>
            </div>
          </div>

          <div className="border p-4 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Message Body Section</h3>
              <button
                onClick={() => {
                  setNewVariable({ ...newVariable, section: "body" });
                  setShowVariableModal(true);
                }}
                disabled={bodyVariables.length >= 5}
                className="text-blue-500 hover:text-blue-600 disabled:text-gray-400 text-sm flex items-center gap-1"
              >
                <Plus size={16} />
                Add Body Variable
              </button>
            </div>

            {/* Body Variables */}
            <div className="space-y-2 mb-4">
              {bodyVariables.map((variable) => (
                <div
                  key={variable.id}
                  className="flex items-center justify-between p-2 border rounded-md bg-white"
                >
                  <div>
                    <span className="text-sm font-medium">{variable.name}</span>
                    <p className="text-sm text-gray-600">
                      Type: {variable.type}
                    </p>
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

            {/* Message Body Input */}
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
          </div>

          {/* Footer Section */}
          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Footer (Optional)
            </label>
            <input
              type="text"
              placeholder="Enter footer text"
              className="w-full p-2 border rounded-md"
              value={footer}
              onChange={(e) => setFooter(e.target.value)}
              maxLength={60}
            />
            <div className="text-sm text-gray-500 mt-1">{footer.length}/10</div>
          </div>

          {/* Buttons Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Button {button.length}/10
                    </label>
                  </div>
                  <div className="p-4 bg-yellow-100 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Create buttons that let customers respond to your message
                      or take action. You can add up to 10 buttons. If you add
                      more than 3 buttons, they will appear in a list.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowButtonModal(true)}
                    disabled={button.length >= 10}
                    className="p-4 text-blue-500 hover:text-blue-600 disabled:text-gray-400 text-sm flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Add Button
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {button.map((buttons) => (
                <div
                  key={buttons.id}
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <div>
                    <span className="text-sm font-medium capitalize">
                      {" "}
                      {buttons.type}
                    </span>
                    <p className="text-sm text-gray-600">{buttons.text}</p>
                  </div>

                  <button
                    onClick={() => removeButton(buttons.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === "utility" ? (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">
            Message validity period
          </h3>
          <p className="text-gray-600 mb-4">
            You can set a custom validity period that your utility message must
            be delivered by before it expires. If a message is not delivered
            within this timeframe, you will not be charged and your customer
            will not see the message.
          </p>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">
                Set custom validity period for your message
              </h4>
              <p className="text-sm text-gray-600">
                If you don't set a custom validity period, the standard 10
                minutes WhatsApp message validity period will be applied.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          {isChecked && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Validity Period (Minutes)
              </label>
              <select
                value={selectedTime} // Use a state variable to track the selected time
                onChange={(e) => setSelectedTime(e.target.value)} // Set the selected time when user changes
                className="w-full p-2 border rounded-md"
              >
                <option value="30s">30 seconds</option>
                <option value="1m">1 minute</option>
                <option value="2m">2 minutes</option>
                <option value="5m">5 minutes</option>
                <option value="10m">10 minutes</option>
                <option value="15m">15 minutes</option>
                <option value="30m">30 minutes</option>
                <option value="1h">1 hour</option>
                <option value="3h">3 hours</option>
                <option value="6h">6 hours</option>
                <option value="12h">12 hours</option>
              </select>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Info size={16} className="text-blue-500" />
            <h4 className="font-medium">Sample Content</h4>
          </div>
          <p className="text-sm text-gray-600">
            To help us review your message template, please add an example of
            each variable to your body text. Do not use real customer
            information. Meta's hosted cloud API reviews template and variable
            parameters to protect the security and integrity of our services.
          </p>
        </div>
      )}
    </div>
  );
};
