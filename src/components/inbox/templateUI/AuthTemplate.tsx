import React, { useState } from "react";
import { AuthPreview } from "./AuthPreview";
// import { AuthPreview } from "./AuthPreview";

interface AppSetup {
  packageName: string;
  signatureHash: string;
}

interface AuthTemplateProps {
  templateName: string;
  setTemplateName: (name: string) => void;
  language: string;
  setLanguage: (language: string) => void;
}

export const AuthTemplate: React.FC<AuthTemplateProps> = ({
  templateName,
  setTemplateName,
  language,
  setLanguage,
}) => {
  // State for code delivery method
  const [codeDeliveryMethod, setCodeDeliveryMethod] = useState<
    "zero-tap" | "one-tap" | "copy"
  >("zero-tap");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // State for app setup
  const [apps, setApps] = useState<AppSetup[]>([
    { packageName: "", signatureHash: "" },
  ]);

  // State for content settings
  const [addSecurityRecommendation, setAddSecurityRecommendation] =
    useState(true);
  const [addExpirationTime, setAddExpirationTime] = useState(false);
  const [customValidityPeriod, setCustomValidityPeriod] = useState(false);
  const [validityPeriod, setValidityPeriod] = useState("10 minutes");

  // State for button text
  const [autofillText, setAutofillText] = useState("Autofill");
  const [copyCodeText, setCopyCodeText] = useState("Copy code");

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
      setApps([...apps, { packageName: "", signatureHash: "" }]);
    }
  };

  const updateApp = (index: number, field: keyof AppSetup, value: string) => {
    const newApps = [...apps];
    newApps[index] = { ...newApps[index], [field]: value };
    setApps(newApps);
  };
 
  return (
    <>
    <div className="">
      <div>
        {/* Code Delivery Setup */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Code delivery setup</h3>
          <p className="text-sm text-gray-600 mb-4">
            Choose how customers send the code from WhatsApp to your app.
          </p>

          <div className="space-y-4">
            <label className="flex items-start gap-3">
              <input
                type="radio"
                checked={codeDeliveryMethod === "zero-tap"}
                onChange={() => setCodeDeliveryMethod("zero-tap")}
                className="mt-1"
              />
              <div>
                <div className="font-medium">Zero-tap autofill</div>
                <p className="text-sm text-gray-600">
                  Automatically sends code without requiring customer
                  interaction.
                </p>
                {codeDeliveryMethod === "zero-tap" && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1"
                      />
                      <div className="text-sm">
                        I accept the WhatsApp Business Terms of Service for
                        zero-tap authentication.
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="radio"
                checked={codeDeliveryMethod === "one-tap"}
                onChange={() => setCodeDeliveryMethod("one-tap")}
                className="mt-1"
              />
              <div>
                <div className="font-medium">One-tap autofill</div>
                <p className="text-sm text-gray-600">
                  Code sends when customers tap the button.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="radio"
                checked={codeDeliveryMethod === "copy"}
                onChange={() => setCodeDeliveryMethod("copy")}
                className="mt-1"
              />
              <div>
                <div className="font-medium">Copy code</div>
                <p className="text-sm text-gray-600">
                  Customers manually copy and paste the code.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* App Setup */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">App setup</h3>
          <p className="text-sm text-gray-600 mb-4">
            You can add up to 5 apps.
          </p>

          {apps.map((app, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Package name
                </label>
                <input
                  type="text"
                  value={app.packageName}
                  onChange={(e) =>
                    updateApp(index, "packageName", e.target.value)
                  }
                  placeholder="com.example.myapplication"
                  className="w-full p-2 border rounded-md"
                  maxLength={224}
                />
                <div className="text-right text-sm text-gray-500">
                  {app.packageName.length}/224
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  App signature hash
                </label>
                <input
                  type="text"
                  value={app.signatureHash}
                  onChange={(e) =>
                    updateApp(index, "signatureHash", e.target.value)
                  }
                  placeholder="Enter hash"
                  className="w-full p-2 border rounded-md"
                  maxLength={11}
                />
                <div className="text-right text-sm text-gray-500">
                  {app.signatureHash.length}/11
                </div>
              </div>
            </div>
          ))}

          {apps.length < 5 && (
            <button
              onClick={addApp}
              className="text-green-600 font-medium hover:text-green-700"
            >
              Add another app
            </button>
          )}
        </div>

        {/* Content Settings */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Content</h3>
          <p className="text-sm text-gray-600 mb-4">
            Content for authentication message templates can't be edited. You
            can add additional content from the options below.
          </p>

          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={addSecurityRecommendation}
                onChange={(e) => setAddSecurityRecommendation(e.target.checked)}
              />
              <span>Add security recommendation</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={addExpirationTime}
                onChange={(e) => setAddExpirationTime(e.target.checked)}
              />
              <span>Add expiration time for the code</span>
            </label>
          </div>
        </div>

        {/* Button Text */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Buttons</h3>
          <p className="text-sm text-gray-600 mb-4">
            Customize button text for autofill and copy code.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Autofill text
              </label>
              <input
                type="text"
                value={autofillText}
                onChange={(e) => setAutofillText(e.target.value)}
                className="w-full p-2 border rounded-md"
                maxLength={25}
              />
              <div className="text-right text-sm text-gray-500">
                {autofillText.length}/25
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Copy code text
              </label>
              <input
                type="text"
                value={copyCodeText}
                onChange={(e) => setCopyCodeText(e.target.value)}
                className="w-full p-2 border rounded-md"
                maxLength={25}
              />
              <div className="text-right text-sm text-gray-500">
                {copyCodeText.length}/25
              </div>
            </div>
          </div>
        </div>

        {/* Validity Period */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">
            Message validity period
          </h3>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Set a custom validity period for your authentication message.
            </p>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={customValidityPeriod}
                onChange={(e) => setCustomValidityPeriod(e.target.checked)}
              />
              <span>Set custom validity period for your message</span>
            </label>

            {customValidityPeriod && (
              <div className="ml-7">
                <p className="text-sm text-gray-600 mb-2">
                  Default validity period is 10 minutes if not customized.
                </p>
                <select
                  value={validityPeriod}
                  onChange={(e) => setValidityPeriod(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {validityPeriods.map((period) => (
                    <option key={period} value={period}>
                      {period}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    <div>
    <div>
        <AuthPreview
          addSecurityRecommendation={addSecurityRecommendation}
          addExpirationTime={addExpirationTime}
          validityPeriod={validityPeriod}
          codeDeliveryMethod={codeDeliveryMethod}
          autofillText={autofillText}
          copyCodeText={copyCodeText}
        />
      </div>
    </div>
    </>
  );
};

export default AuthTemplate;
