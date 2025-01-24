import { MapPin, Upload } from "lucide-react";
import React, { useState } from "react";
import { AuthPreview } from "./AuthPreview";


interface Button {
  id: string;
  text: string;
}

interface TemplatePreviewProps {
  headerType: "none" | "text" | "image" | "video" | "document" | "location";
  headerContent: string | null;
  previewFile: string | null;
  messageBody: string;
  footer: string;
  button: Button[];
  getFormatedText: (text: string, type: "header" | "body") => React.ReactNode;
  templateType: string;
  templateName?: string;
  
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  headerType,
  headerContent,
  previewFile,
  messageBody,
  footer,
  button,
  getFormatedText,
  templateType,
  templateName = "",
  
}) => {
    const [addSecurityRecommendation, setAddSecurityRecommendation] =
      useState(true);
    const [addExpirationTime, setAddExpirationTime] = useState(false);
    const [customValidityPeriod, setCustomValidityPeriod] = useState(false);
    const [validityPeriod, setValidityPeriod] = useState("10 minutes");
  
    // State for button text
    const [autofillText, setAutofillText] = useState("Autofill");
    const [copyCodeText, setCopyCodeText] = useState("Copy code");

      const [codeDeliveryMethod, setCodeDeliveryMethod] = useState<
        "zero-tap" | "one-tap" | "copy"
      >("zero-tap");
      const [termsAccepted, setTermsAccepted] = useState(false);
  
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
    const code = "{{1}}"; // Placeholder for the verification code
    const currentTime = new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  

  if (templateType === "one-time_Passcode"){
 
    return(
      <AuthPreview
                addSecurityRecommendation={addSecurityRecommendation}
                addExpirationTime={addExpirationTime}
                validityPeriod={validityPeriod}
                codeDeliveryMethod={codeDeliveryMethod}
                autofillText={autofillText}
                copyCodeText={copyCodeText}
              />
    )
  }

  if (templateType === "catalog") {
    return (
      <div className="bg-gray-50 p-6 border-l">
        <h3 className="text-lg font-semibold mb-4">Preview</h3>
        <div className="bg-[#E5DDD5] p-4 rounded-lg h-[calc(100vh-12rem)] overflow-y-auto">
          <div className="max-w-sm mx-auto">
            <div className="bg-white rounded-lg p-4 shadow-sm relative">
              <div className="flex items-start space-x-3">
                <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-[#00A884] text-[15px] leading-snug">
                    View {templateName || '[BIZ_NAME]'}'s Catalog on WhatsApp
                  </h4>
                  <p className="text-[13px] text-gray-600 mt-0.5">
                    Browse pictures and details of their offerings.
                  </p>
                </div>
              </div>

              {messageBody && (
                <div className="mt-4 text-[14px] text-gray-700 leading-relaxed">
                  {messageBody}
                </div>
              )}

              <div className="mt-4 border-t pt-3">
                <button className="text-[#00A884] font-medium text-[14px]">
                  View catalog
                </button>
              </div>

              <div className="mt-1.5 flex justify-end">
                <span className="text-[11px] text-gray-500">{currentTime}</span>
              </div>

              {/* Message Tail */}
              <div className="absolute top-0 -left-2 w-4 h-4 overflow-hidden">
                <div className="absolute w-2 h-2 bg-white rotate-45 transform origin-center translate-x-1/2 translate-y-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (templateType !== "custom") {
    return null;
  }

  return (
    <div className="bg-gray-50 p-6 border-l">
      <h3 className="text-lg font-semibold mb-4">Preview</h3>
      <div className="bg-[#E5DDD5] p-4 rounded-lg h-[calc(100vh-12rem)] overflow-y-auto">
        <div className="max-w-sm mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            {headerType !== "none" && headerContent && (
              <div className="font-medium mb-2">
                {headerType === "text" &&
                  getFormatedText(headerContent || "", "header")}
                {headerType === "image" && previewFile && (
                  <img
                    src={previewFile}
                    alt="Preview"
                    className="w-full rounded"
                  />
                )}
                {headerType === "video" && previewFile && (
                  <video
                    src={previewFile}
                    controls
                    className="w-full rounded"
                  />
                )}
                {headerType === "document" && (
                  <div className="flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    <span>{headerContent}</span>
                  </div>
                )}
                {headerType === "location" && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>Location</span>
                  </div>
                )}
              </div>
            )}
            <div className="mb-2">
              {getFormatedText(messageBody, "body") ||
                "Message body will appear here"}
            </div>

            {footer && (
              <div className="mt-2 pt-2 border-t text-sm text-gray-500">
                {footer}
              </div>
            )}

            {button.length > 0 && (
              <div className="mt-2 pt-2 border-t space-y-2">
                {button.map((buttons) => (
                  <button
                    key={buttons.id}
                    className="w-full p-2 text-center bg-gray-50 text-blue-500 rounded"
                  >
                    {buttons.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};