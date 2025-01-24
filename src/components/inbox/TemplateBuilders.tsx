import { Copy, Link, Link2, X } from "lucide-react";
import { WhatsAppTemplate } from "../types/template";
import { useEffect, useState } from "react";

import { TemplateSetup } from "./templateUI/TemplateSetup";
import { TemplateEditor } from "./templateUI/TemplateEditor";
import { TemplatePreview } from "./templateUI/TemplatePreview";
import { VariableModal } from "./templateUI/Variablemodal";
import { ButtonModal } from "./templateUI/ButtonModal";
import { Button } from "../types/button";
import Catlog from "./templateUI/Catlog";
import AuthTemplate from "./templateUI/AuthTemplate";
import { AuthPreview } from "./templateUI/AuthPreview";
import { Card } from "../ui/card";
import { Tooltip,TooltipContent,TooltipTrigger } from "../ui/tooltip";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";

interface Variable {
  id: string;
  name: string;
  type: "text" | "number" | "date" | "currency" | "datetime";
  example: string;
  section: "header" | "body";
}

export interface Header {
  type: "none" | "text";
  content: string;
}

export interface Footer {
  type: "none" | "text";
  content: string;
}

interface Component {
  type: string;
  format?: string;
  text?: string;
  example?: Record<string, any>;
  buttons?: { type: string; text: string }[];
}

interface AppSetup {
  packageName: string;
  signatureHash: string;
}


type TemplateBuildersProps ={
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  templates: WhatsAppTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<WhatsAppTemplate[]>>;
  searchTemplate: string;
  setSearchTemplate: React.Dispatch<React.SetStateAction<string>>;
}

// Helper function to format template name

const TemplateBuilders = ({ isOpen, setIsOpen, templates, setTemplates,searchTemplate,setSearchTemplate }: TemplateBuildersProps) => {
 
    // name: "",
    // category: "MARKETING",
    // language: "",
    // body: "",
    // header: {
    //   type: "none",
    //   content: "",
    // },
    // template: "custom",
    // footer: "",
    // button: {
    //   id: "",
    //   type: "reply",
    //   text: "",
    //   content: "",
    // },
    // status: "PENDING",
    // variable: [
    //   {
    //     id: "",
    //     name: "",
    //     type: "text",
    //     example: "",
    //     section: "body",
    //   },
    //],

  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState("marketing");
  const [templateType, setTemplateType] = useState("custom");
  const [templateName, setTemplateName] = useState("");
  const [language, setlanguage] = useState("English");
  const [variables, setVariables] = useState<Variable[]>([]);
  const [showVariableModal, setShowVariableModal] = useState(false);
  const [messageBody, setMessageBody] = useState("");
  const [header, setHeader] = useState("");
  const [newVariable, setNewVariable] = useState<Variable>({
    id: "",
    name: "",
    type: "text",
    example: "",
    section: "body",
  });
  const [footer, setFooter] = useState("");
  const [button, setButton] = useState<Button[]>([]);
  const [showButtonModal, setShowButtonModal] = useState(false);
  const [newButton, setNewButton] = useState<Button>({
    id: "",
    type: "reply",
    text: "",
    content: "",
    value: "",
  });
  const [headerType, setHeaderType] = useState<
    "none" | "text" | "image" | "video" | "document" | "location"
  >("none");
  const [headerContent, setHeaderContent] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [codeDeliveryMethod, setCodeDeliveryMethod] = useState<
    "zero-tap" | "one-tap" | "copy"
  >("zero-tap");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [apps, setApps] = useState<AppSetup[]>([
    { packageName: "", signatureHash: "" },
  ]);
  const [addSecurityRecommendation, setAddSecurityRecommendation] =
    useState(true);
  const [addExpirationTime, setAddExpirationTime] = useState(false);
  const [customValidityPeriod, setCustomValidityPeriod] = useState(false);
  const [validityPeriod, setValidityPeriod] = useState("10 minutes");
  const [autofillText, setAutofillText] = useState("Autofill");
  const [copyCodeText, setCopyCodeText] = useState("Copy code");
  const [stepButton, setStepButton] = useState<any>(null);

  const headerTypes = [
    { value: "none", label: "None" },
    { value: "text", label: "Text" },
    { value: "image", label: "Image" },
    { value: "video", label: "Video" },
    { value: "document", label: "Document" },
    { value: "location", label: "Location" },
  ];

  const removeVariable = (id: string) => {
    setVariables(variables.filter((variable) => variable.id !== id));
  };

  const insertVariable = (variable: Variable) => {
    const variableText = `{{${variable.name}}}`;
    if (variable.section === "header") {
      const updatedHeader = (header || "") + variableText;
      setHeader(updatedHeader);
      setHeaderContent(updatedHeader); // Sync headerContent
    } else {
      setMessageBody((messageBody || "") + variableText);
    }
  };

  const removeButton = (id: string) => {
    setButton(button.filter((button) => button.id !== id));
  };

  const handleback = () => {
    step === 2 ? setStep(1) : setIsOpen(false), setStep(1);
  };

  const handleNext = () => {
    if (step === 1) {
      if (templateType === "custom") {
        setStepButton("next");
        setStep(2);
      } else if (templateType === "catalog") {
        setStepButton("editor2");
        setStep(2);
      } else if (templateType === 'one-time_Passcode') {
        setStepButton("editor3");
        setStep(2);
      } else if (templateType === 'pre-approved_utility') {
        setStepButton("editor4");
        setStep(2);
      }else if (templateType === 'pre-approved_auth') {
        setStepButton("editor5");
        setStep(2);
      }
    }
  };

  const formatTemplateName = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, "_");
  };
  
  // Helper function to format language code
  const formatLanguageCode = (language: string): string => {
    const languageMap: { [key: string]: string } = {
      English: "en_US",
      "English (UK)": "en_GB",
      "English (US)": "en_US",
      // Add more mappings as needed
    };
    return languageMap[language] || "en_US";
  };
  
  // Helper function to format category
  const formatCategory = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
      marketing: "MARKETING",
      utility: "UTILITY",
      verification: "AUTHENTICATION",
    };
    return categoryMap[category] || "MARKETING";
  };
  
  // Helper function to format button type
  const formatButtonType = (type: string): string => {
    const buttonTypeMap: { [key: string]: string } = {
      reply: "QUICK_REPLY",
      url: "URL",
      phone: "PHONE_NUMBER",
      copy: "COPY_CODE",
    };
    return buttonTypeMap[type] || "QUICK_REPLY";
  };

  const exportData = () => {
    // Get variables for header and body
    const headerVars = variables.filter((v) => v.section === "header");
    const bodyVars = variables.filter((v) => v.section === "body");

    // Format header variables for example
    const headerExamples = headerVars.map((v) => v.example);

    // Format body variables for example
    const bodyExamples = bodyVars.map((v) => v.example);

    // Replace variable names with placeholders
    let headerText = header;
    headerVars.forEach((v, index) => {
      headerText = headerText.replace(`{{${v.name}}}`, `{{${index + 1}}}`);
    });

    let bodyText = messageBody;
    bodyVars.forEach((v, index) => {
      bodyText = bodyText.replace(`{{${v.name}}}`, `{{${index + 1}}}`);
    });

    // Format buttons
    const formattedButtons = button.map((button) => ({
      type: formatButtonType(button.type),
      text: button.text,
      ...(button.value && button.type === "url" && { url: button.value }),
      ...(button.value &&
        button.type === "phone" && { phone_number: button.value }),
    }));

    // Create the template data structure
    const templateData = {
      name: formatTemplateName(templateName),
      language: formatLanguageCode(language),
      category: formatCategory(activeTab),
      components: [
        ...(header
          ? [
              {
                type: "HEADER",
                format: "TEXT",
                text: headerText,
                example: {
                  header_text: [headerExamples],
                },
              },
            ]
          : []),
        {
          type: "BODY",
          text: bodyText,
          example: {
            body_text: [bodyExamples],
          },
        },
        ...(footer
          ? [
              {
                type: "FOOTER",
                text: footer,
              },
            ]
          : []),
        ...(button.length > 0
          ? [
              {
                type: "BUTTONS",
                buttons: formattedButtons,
              },
            ]
          : []),
      ],
    };

    // Log the formatted data
    console.log(JSON.stringify(templateData, null, 2));

    // Create downloadable JSON file
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(templateData, null, 2)
    )}`;
  };

  const getFormatedText = (text: string, type: string) => {
    let formattedText = text;
    variables
      .filter((v) => v.section === type)
      .forEach((variable) => {
        const regex = new RegExp(`{{${variable.name}}}`, "g");
        formattedText = formattedText.replace(regex, variable.example);
      });
    return formattedText;
  };

  const addButton = () => {
    if (button.length < 10) {
      const newBtn: Button = {
        ...newButton,
        id: Math.random().toString(36).substr(2, 9),
      };
      setButton([...button, newBtn]);
      setShowButtonModal(false);
      setNewButton({ id: "", type: "reply", text: "", content: "", value: "" });
    }
  };

  const addVariable = () => {
    if (variables.length < 10) {
      const variable: Variable = {
        ...newVariable,
        id: Math.random().toString(36).substr(2, 9),
      };
      setVariables([...variables, variable]);
      setShowVariableModal(false);
      setNewVariable({
        id: "",
        name: "",
        type: "text",
        example: "",
        section: "body",
      });
    }
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] =useState<string | null>(null);
  
  useEffect(() => {
      const loadTemplates = async () => {
        try {
          setLoading(true);
    
          const response = await fetch('/api/fetchTemplate');
          console.log("Response:", response);
    
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
          }
    
          const result = await response.json();
          
          if (result && result.data){
            setTemplates(result.data);
          }else {
            console.error("Invalid response format:", result);
            setError("Invalid response format from server");
          }
          
        } catch (err) {
          console.error("Error in fetch:", err);
          setError(err instanceof Error ? err.message : "Fetch error");
        } finally {
          setLoading(false);
        
        }
      };
      loadTemplates();
    }, []);


 
  const languages = [
    "Afrikaans",
    "Albanian",
    "Arabic",
    "Azerbaijani",
    "Bengali",
    "Bulgarian",
    "Catalan",
    "Chinese (CHN)",
    "Chinese (HKG)",
    "Chinese (TAIWAN)",
    "Croatian",
    "Czech",
    "Danish",
    "Dutch",
    "English",
    "English (UK)",
    "English (US)",
    "Estonian",
    "Filipino",
    "Finnish",
    "French",
    "Georgian",
    "German",
    "Greek",
    "Gujarati",
    "Hausa",
    "Hebrew",
    "Hindi",
    "Hungarian",
    "Indonesian",
    "Irish",
    "Italian",
    "Japanese",
    "Kannada",
    "Kazakh",
    "Kinyarwanda",
    "Korean",
    "Kyrgyz (Kyrgyzstan)",
    "Lao",
    "Latvian",
    "Lithuanian",
    "Macedonian",
    "Malay",
    "Malayalam",
    "Marathi",
    "Norwegian",
    "Persian",
    "Polish",
    "Portuguese (BR)",
    "Portuguese (POR)",
    "Punjabi",
    "Romanian",
    "Russian",
    "Serbian",
    "Slovak",
    "Slovenian",
    "Spanish",
    "Spanish (ARG)",
    "Spanish (MEX)",
    "Spanish (SPA)",
    "Swahili",
    "Swedish",
    "Tamil",
    "Telugu",
    "Thai",
    "Turkish",
    "Ukrainian",
    "Urdu",
    "Uzbek",
    "Vietnamese",
    "Zulu",
  ];

  const headerVariables = variables.filter((v) => v.section === "header");
  const bodyVariables = variables.filter((v) => v.section === "body");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewFile(reader.result as string);
        setHeaderContent(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredTemplates = (templates || []).filter((template) => 
    template?.name?.toLocaleLowerCase().includes(searchTemplate.toLocaleLowerCase()) &&
    template.status === 'APPROVED' &&
    template.type === 'utility'
  );
  
  if (!isOpen) return null;


  
  return (
    <div className="relative">
      {isOpen && (
        <div className=" fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            {/* header */}
            <div className="border-b p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-semibold">Set up a template</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center 
                      ${step === 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  >
                    1
                  </div>
                  <span
                    className={step === 1 ? "text-blue-500" : "text-gray-500"}
                  >
                    Set up a template
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      step === 2 ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    2
                  </div>
                  <span
                    className={step === 2 ? "text-blue-500" : "text-gray-500"}
                  >
                    Edit template
                  </span>
                </div>
              </div>
            </div>

            {/* content */}
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="p-6">
                {
                  step === 1 ? (
                    <TemplateSetup
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      templateType={templateType}
                      setTemplateType={setTemplateType}
                      newVariable={newVariable}
                      setNewVariable={setNewVariable}
                      bodyVariables={bodyVariables}
                    />
                  ) : step === 2 && templateType === "custom" && stepButton === "next" &&(
                    <TemplateEditor
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    templateName={templateName}
                    setTemplateName={setTemplateName}
                    language={language}
                    setLanguage={setlanguage}
                    variables={variables}
                    setVariables={setVariables}
                    showVariableModal={showVariableModal}
                    setShowVariableModal={setShowVariableModal}
                    messageBody={messageBody}
                    setMessageBody={setMessageBody}
                    header={header}
                    setHeader={setHeader}
                    footer={footer}
                    setFooter={setFooter}
                    button={button}
                    showButtonModal={showButtonModal}
                    setShowButtonModal={setShowButtonModal}
                    newButton={newButton}
                    headerType={headerType}
                    setHeaderType={(type: string) =>
                      setHeaderType(
                        type as
                          | "none"
                          | "text"
                          | "image"
                          | "video"
                          | "document"
                          | "location"
                      )
                    }
                    headerContent={headerContent}
                    setHeaderContent={setHeaderContent}
                    previewFile={previewFile}
                    setPreviewFile={setPreviewFile}
                    handleFileUpload={handleFileUpload}
                    insertVariable={insertVariable}
                    removeVariable={removeVariable}
                    removeButton={removeButton}
                    languages={languages}
                    headerVariables={headerVariables}
                    onAddVariable={(variable: Variable) => {
                      setNewVariable(variable);
                      setShowVariableModal(true);
                    }}
                    newVariable={newVariable}
                    setNewVariable={setNewVariable}
                    bodyVariables={bodyVariables}
                    templateType={templateType}
                  />)
                }

                {step === 2 && templateType === "catalog" && stepButton === "editor2" && (
                  <Catlog
                    templateName={templateName}
                    setTemplateName={setTemplateName}
                    language={language}
                    setLanguage={setlanguage}
                    messageBody={messageBody}
                    setMessageBody={setMessageBody}
                    header={header}
                    button={button}
                    headerType={headerType}                  
                    headerContent={headerContent}                   
                    previewFile={previewFile}
                    setPreviewFile={setPreviewFile}
                    languages={languages}
                    headerVariables={headerVariables}
                    bodyVariables={bodyVariables}
                    footer={footer}
                    setFooter={setFooter}
                    insertVariable={insertVariable}
                    removeVariable={removeVariable}
                  />
                ) }

                {step === 2 && templateType === "one-time_Passcode" && stepButton === "editor3" && (
                    <AuthTemplate
                      templateName={templateName}
                      setTemplateName={setTemplateName}
                      language={language}
                      setLanguage={setlanguage}
                    />
                    
                )}
                  
           
                {step === 2 && templateType === "pre-approved_utility" && stepButton === "editor4" &&(
                  <div>
                    <Input
                    placeholder="Search templates..."
                    value={searchTemplate}
                    onChange={(e) => setSearchTemplate(e.target.value)}
                    className="flex-1"
                  />
                    {filteredTemplates.map((template)=>(
                      <Card
                      key={template.id}
                      className="p-3 mb-3 cursor-pointer hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="font-medium truncate max-w-[150px] block">
                              {template.name.length > 15
                                ? `${template.name.slice(0, 15)}...`
                                : template.name}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>{template.name}</TooltipContent>
                        </Tooltip>
                        <div className="flex gap-2">
                          <Badge variant="secondary">{template.category}</Badge>
                          <Badge
                            variant={
                              template.status === 'APPROVED'
                                ? 'success'
                                : template.status === 'REJECTED'
                                ? 'REJECTED'
                                : 'destructive'
                            }
                          >
                            {template.status}
                          </Badge>
                        </div>
                      </div>
                      </Card>
                    ))}
                  </div>
                )}

                {step === 2 && templateType === "pre-approved_auth" && stepButton === "editor5" &&(
                  <div>
                    <h1>Approve auth</h1>
                  </div>
                )}

                {/* Action button */}
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={handleback}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                  >
                    {step === 1 ? "Go Back" : "Previous"}
                  </button>
                  <button
                    onClick={step === 1 ? handleNext : exportData}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    value={stepButton}
                    onChange={(e) =>
                      setStepButton((e.target as HTMLButtonElement).value)
                    }
                  >
                    {step === 1 ? "Next" : "Export Template"}
                  </button>
                </div>
              </div>

              {/* {(templateType==='custom' && stepButton === 'next') &&(
                (<TemplateEditor
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  templateName={templateName}
                  setTemplateName={setTemplateName}
                  language={language}
                  setLanguage={setlanguage}
                  variables={variables}
                  setVariables={setVariables}
                  showVariableModal={showVariableModal}
                  setShowVariableModal={setShowVariableModal}
                  messageBody={messageBody}
                  setMessageBody={setMessageBody}
                  header={header}
                  setHeader={setHeader}
                  footer={footer}
                  setFooter={setFooter}
                  button={button}
                  showButtonModal={showButtonModal}
                  setShowButtonModal={setShowButtonModal}
                  newButton={newButton}
                  headerType={headerType}
                  setHeaderType={(type: string) =>
                    setHeaderType(
                      type as
                        | "none"
                        | "text"
                        | "image"
                        | "video"
                        | "document"
                        | "location"
                    )
                  }
                  headerContent={headerContent}
                  setHeaderContent={setHeaderContent}
                  previewFile={previewFile}
                  setPreviewFile={setPreviewFile}
                  handleFileUpload={handleFileUpload}
                  insertVariable={insertVariable}
                  removeVariable={removeVariable}
                  removeButton={removeButton}
                  languages={languages}
                  headerVariables={headerVariables}
                  onAddVariable={(variable: Variable) => {
                    setNewVariable(variable);
                    setShowVariableModal(true);
                  }}
                  newVariable={newVariable}
                  setNewVariable={setNewVariable}
                  bodyVariables={bodyVariables}
                />)
              )} */}

              {/* preview */}
              {step ===2 && templateType==='one-time_passcode' && stepButton ==='editor5' && (   
                  <AuthPreview
                    addSecurityRecommendation={addSecurityRecommendation}
                    addExpirationTime={addExpirationTime}
                    validityPeriod={validityPeriod}
                    codeDeliveryMethod={codeDeliveryMethod}
                    autofillText={autofillText}
                    copyCodeText={copyCodeText}
                  />
              )}
              {step === 2 ? (
                <TemplatePreview
                  headerType={headerType}
                  headerContent={headerContent}
                  previewFile={previewFile}
                  messageBody={messageBody}
                  footer={footer}
                  button={button}
                  getFormatedText={getFormatedText}
                  templateType={templateType}
                />
              ) : step === 1 && activeTab === "marketing" ? (
                <div className="bg-gray-50 p-6 border-l">
                  <h3 className="text-lg font-semibold mb-4">Preview</h3>
                  <div className="bg-[#E5DDD5] p-4 rounded-lg  overflow-y-auto">
                    <div className="max-w-sm mx-auto">
                      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                        {/* Message Body */}
                        <div className="mb-2 text-gray-800">
                          Message body will appear here
                        </div>

                        {/* Footer */}
                        <div className="mt-2 pt-2 border-t text-sm text-gray-500">
                          Sample footer content here
                        </div>

                        {/* Buttons */}
                        <div className="mt-2 pt-2 border-t space-y-2">
                          <button className="w-full p-2 text-center bg-gray-50 text-blue-500 rounded">
                            Button 1
                          </button>
                          <button className="w-full p-2 text-center bg-gray-50 text-blue-500 rounded">
                            Button 2
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : step === 1 && activeTab === "utility" ? (
                <div className="bg-gray-50 p-6 border-l">
                  <h3 className="text-lg font-semibold mb-4">Preview</h3>
                  <div className="bg-[#E5DDD5] p-4 rounded-lg  overflow-y-auto">
                    <div className="max-w-sm mx-auto">
                      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                        {/* Message Body */}
                        <div className="mb-2 text-gray-800">
                          Finalize account set-up
                        </div>

                        {/* Footer */}
                        <div className="mt-2 pt-2 border-t text-sm text-gray-500">
                          Hi John, Your new account has been created
                          successfully. Please verify your email address to
                          complete your profile.
                        </div>

                        {/* Buttons */}
                        <div className="mt-2 pt-2 border-t space-y-2">
                          <button className="flex items-center justify-center w-full p-2 text-center bg-gray-50 text-blue-500 rounded">
                            <Link2 />
                            Verify
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeTab ==='Authentication' && (
                <div className="bg-gray-50 p-6 border-l">
                  <h3 className="text-lg font-semibold mb-4">Preview</h3>
                  <div className="bg-[#E5DDD5] p-4 rounded-lg  overflow-y-auto">
                    <div className="max-w-sm mx-auto">
                      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                        {/* Message Body */}
                        <div className="mb-2 text-gray-800">
                          Here is One-Time PassCode 225566
                        </div>

                        {/* Footer */}
                        <div className="mt-2 pt-2 border-t text-sm text-gray-500">
                          Please use OTP it will be valid for next 2 minutes
                        </div>

                        {/* Buttons */}
                        <div className="mt-2 pt-2 border-t space-y-2">
                          <button className="flex items-center justify-center w-full p-2 text-center bg-gray-50 text-blue-500 rounded">
                            <Copy />
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Variable Modal */}
      {showVariableModal && (
       
        <VariableModal
          newVariable={newVariable}
          setNewVariable={setNewVariable}
          setShowVariableModal={setShowVariableModal}
          addVariable={addVariable}
        />
      )}

      {/* Button Modal */}
      {showButtonModal && (
       
        <ButtonModal
          newButton={newButton}
          setNewButton={setNewButton}
          setShowButtonModal={setShowButtonModal}
          addButton={addButton}
        />
      )}
    </div>
  );
};

export default TemplateBuilders;


