import React from 'react';

interface AuthPreviewProps {
  addSecurityRecommendation: boolean;
  addExpirationTime: boolean;
  validityPeriod: string;
  codeDeliveryMethod: "zero-tap" | "one-tap" | "copy";
  autofillText: string;
  copyCodeText: string;
}

export const AuthPreview: React.FC<AuthPreviewProps> = ({
  addSecurityRecommendation,
  addExpirationTime,
  validityPeriod,
  codeDeliveryMethod,
  autofillText,
  copyCodeText,
}) => {
  const code = "{{1}}"; // Placeholder for the verification code
  const currentTime = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  return (
    <div className="bg-gray-50 p-6 border-l">
      <div className="bg-[#E5DDD5] p-4 rounded-lg h-[calc(100vh-12rem)] overflow-y-auto">
        <div className="max-w-sm mx-auto">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Template Preview</h3>
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-3">
              <p className="text-gray-800 mb-2">
                {code} is your verification code. For your security, do not share this code.
              </p>
              {addSecurityRecommendation && (
                <p className="text-gray-600 text-sm mb-2">
                  Never share this code with anyone.
                </p>
              )}
              {addExpirationTime && (
                <p className="text-gray-600 text-sm">
                  This code will expire in {validityPeriod}.
                </p>
              )}
              <div className="text-right text-xs text-gray-500 mt-1">
                {currentTime}
              </div>
            </div>
            {codeDeliveryMethod !== "zero-tap" && (
              <div className="border-t">
                {codeDeliveryMethod === "one-tap" && (
                  <button className="w-full p-3 text-center text-blue-500 hover:bg-gray-50 transition-colors">
                    {autofillText}
                  </button>
                )}
                {codeDeliveryMethod === "copy" && (
                  <button className="w-full p-3 text-center text-blue-500 hover:bg-gray-50 transition-colors">
                    {copyCodeText}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};