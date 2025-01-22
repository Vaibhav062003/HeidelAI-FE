import { Info, Key, MapPin, MessageSquare, Plus, ShieldCheck, Trash, Trash2, Upload, Wrench, X } from "lucide-react";
import { WhatsAppTemplate } from "../types/template";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

  interface Variable {
    id: string;
    name: string;
    type: 'text' | 'number' | 'date' | 'currency' | 'datetime';
    example: string;
    section: 'header' | 'body';
  }

  interface Button {
    id: string;
    type: string;
    text: string;
    content: string;
    value?: string;
  }
  
  export interface Header {
    type: 'none' | 'text';
    content: string;
  }
  
  export interface Footer {
    type: 'none' | 'text';
    content: string;
  }

  interface Component {
    type: string;
    format?: string;
    text?: string;
    example?: Record<string, any>;
    buttons?: { type: string; text: string }[];
  }
  
  type ComponentType = 

  | { type: "HEADER"; format: string; text: string; example: { header_text: (string[] | undefined)[] } }

  | { type: "BODY"; text: string; example: { body_text: (string[] | undefined)[] } }

  | { type: "FOOTER"; text: string }

  | { type: "BUTTONS"; buttons: { type: string; text: string }[] };


  interface FormattedData {
    components: ComponentType[];
  }

  interface FormattedTemplate {
    name: string;
    language: string;
    category: string;
    components: ComponentType[];
  }

  interface TemplateBuildersProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    templates: WhatsAppTemplate[];
    setTemplates: React.Dispatch<React.SetStateAction<WhatsAppTemplate[]>>;
    onSave?: (template: unknown) => void;
  }

  const TemplateBuilders = ({
    isOpen,
    setIsOpen,
    onSave = () => {},
  }: TemplateBuildersProps) => {
    const [template, setTemplate] = useState<WhatsAppTemplate>({
      name: '',
      category: 'MARKETING', 
      language: '',
      body: '',
      header: {
        type: 'none', 
        content: '',
      },
      template: 'custom',
      footer: '',
      button: {
        id: '',
        type: 'reply',
        text: '',
        content: '',
      },
      status: 'PENDING',
      variable: [{
        id: '',
        name: '',
        type: 'text',
        example: '',
        section: 'body'
      }],
    });
    const [step, setStep] = useState(1);
    const [activeTab, setActiveTab] = useState('marketing');
    const [templateType, setTemplateType]= useState('custom')
    const [templateName, setTemplateName]=useState('')
    const [language, setlanguage] =useState('English')
    const [variables, setVariables] = useState<Variable[]>([])
    const [showVariableModal, setShowVariableModal] = useState(false);
    const [messageBody, setMessageBody] = useState('')
    const [header, setHeader] =useState('')
    const [newVariable, setNewVariable] = useState<Variable>({
      id: '',
      name: '',
      type: 'text',
      example: '',
      section: 'body'
    });
    const [footer,setFooter] = useState('')
    const [button, setButton] = useState<Button[]>([])
    const [showButtonModal, setShowButtonModal] = useState(false);
    const [newButton, setNewButton] = useState<Button>({
      id: '',
      type: 'reply',
      text: '',
      content: '',
      value: ''
    });
    const [headerType, setHeaderType] = useState('none');
    const [headerContent, setHeaderContent] = useState<string | null>(null);
    const [previewFile, setPreviewFile] = useState<string | null>(null);
    const formattedData = {
      name: template.name?.toLowerCase().replace(/\s+/g, '_') || '',
      language: template.language?.toLowerCase().replace(/-/g, '_') || '',
      category: template.category || '',
      components: [] // Ensure this is initialized as an array
    };
    
    

    const headerTypes = [
      { value: 'none', label: 'None' },
      { value: 'text', label: 'Text' },
      { value: 'image', label: 'Image' },
      { value: 'video', label: 'Video' },
      { value: 'document', label: 'Document' },
      { value: 'location', label: 'Location' }
    ];

    const removeVariable = (id: string) => {
      setVariables(variables.filter(variable => variable.id !== id));
    };
  
    const insertVariable = (variable: Variable) => {
      const variableText = `{{${variable.name}}}`;
      if (variable.section === 'header') {
        setHeader(header + variableText);
      } else {
        setMessageBody(messageBody + variableText);
      }
    };
  

    const removeButton =(id:string)=>{
      setButton(button.filter(button=>button.id !== id))
    }

    const handleback =()=>{
      step ===2 ?setStep(1):setIsOpen(false),setStep(1);
    }

    const handleNext= ()=>{
      if (step ===1 ){
        setStep(2)
      }
    }

    const exportData = () => {
      // Explicitly define the structure of formattedData
      const formattedData: {
        name: string;
        language: string;
        category: string;
        components: Component[];
      } = {
        name: template.name?.toLowerCase().replace(/\s+/g, '_') || '',
        language: template.language?.toLowerCase().replace(/-/g, '_') || '',
        category: template.category || '',
        components: [] // Initialize as an empty array of Component[]
      };
    
      // Add header component if it exists
      if (template?.header?.content) {
        const headerExamples = template.variable
          ?.filter((v: Variable) => v.section === 'header')
          .map((v) => v.example) || [];
    
        formattedData.components.push({
          type: "HEADER",
          format: "TEXT",
          text: template.header.content,
          example: {
            header_text: [headerExamples]
          }
        });
      }
    
      // Add body component if it exists
      if (template?.body) {
        const bodyExamples = template.variable
          ?.filter((v) => v.section === 'body')
          .map((v) => v.example) || [];
    
        formattedData.components.push({
          type: "BODY",
          text: template.body,
          example: {
            body_text: [bodyExamples]
          }
        });
      }
    
      // Add footer component if it exists
      if (template.footer) {
        formattedData.components.push({
          type: "FOOTER",
          text: template.footer
        });
      }
    
      // Add buttons component if buttons exist
      if (button.length > 0) {
        formattedData.components.push({
          type: "BUTTONS",
          buttons: button.map((btn) => ({
            type: btn.type === 'reply' ? 'QUICK_REPLY' : btn.type.toUpperCase(),
            text: btn.text
          }))
        });
      }
    
      // Log the final formatted data as JSON
      console.log(JSON.stringify(formattedData, null, 2));
    };
    

    const getFormatedText =(text:string, section: 'header' | 'body')=>{
      let formattedText = text;
      variables 
        .filter(v => v.section === section)
        .forEach(variable => {
          const regex = new RegExp(`{{${variable.name}}}`, 'g');
          formattedText=formattedText.replace(regex, variable.example)
        })
        return formattedText;
    }

    const addButton = () => {
      if (button.length < 10) {
        const newBtn: Button = {
          ...newButton,
          id: Math.random().toString(36).substr(2, 9)
        };
        setButton([...button, newBtn]);
        setShowButtonModal(false);
        setNewButton({ id: '', type: 'reply', text: '', content: '', value: '' });
      }
    };

    const addVariable = () => {
      if (variables.length < 10) {
        const variable: Variable = {
          ...newVariable,
          id: Math.random().toString(36).substr(2, 9)
        };
        setVariables([...variables, variable]);
        setShowVariableModal(false);
        setNewVariable({ id: '', name: '', type: 'text', example: '', section: 'body' });
      }
    };

    const languages = [
      'Afrikaans', 'Albanian', 'Arabic', 'Azerbaijani', 'Bengali', 'Bulgarian', 'Catalan',
      'Chinese (CHN)', 'Chinese (HKG)', 'Chinese (TAIWAN)', 'Croatian', 'Czech', 'Danish',
      'Dutch', 'English', 'English (UK)', 'English (US)', 'Estonian', 'Filipino', 'Finnish',
      'French', 'Georgian', 'German', 'Greek', 'Gujarati', 'Hausa', 'Hebrew', 'Hindi',
      'Hungarian', 'Indonesian', 'Irish', 'Italian', 'Japanese', 'Kannada', 'Kazakh',
      'Kinyarwanda', 'Korean', 'Kyrgyz (Kyrgyzstan)', 'Lao', 'Latvian', 'Lithuanian',
      'Macedonian', 'Malay', 'Malayalam', 'Marathi', 'Norwegian', 'Persian', 'Polish',
      'Portuguese (BR)', 'Portuguese (POR)', 'Punjabi', 'Romanian', 'Russian', 'Serbian',
      'Slovak', 'Slovenian', 'Spanish', 'Spanish (ARG)', 'Spanish (MEX)', 'Spanish (SPA)',
      'Swahili', 'Swedish', 'Tamil', 'Telugu', 'Thai', 'Turkish', 'Ukrainian', 'Urdu',
      'Uzbek', 'Vietnamese', 'Zulu'
    ];

  
    const headerVariables = variables.filter(v => v.section === 'header');
    const bodyVariables = variables.filter(v => v.section === 'body');
    
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
                      <button onClick={()=>setIsOpen(false)}
                        className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                      </button>
                  </div>  
                  <div className="flex gap-4">  
                    <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center 
                      ${step === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                      1
                    </div>
                    <span className={step === 1 ? 'text-blue-500' : 'text-gray-500'}>
                      Set up a template
                    </span>
                    </div>
                      
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        step === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                        2
                      </div>
                      <span className={step === 2 ? 'text-blue-500' : 'text-gray-500'}>
                        Edit template
                      </span>
                    </div>
                  </div>
              </div>

              {/* content */}
              <div className="grid grid-cols-2 gap-4 p-4">
                  <div className="p-6">
                    {step === 1 ? (
                      <>
                        <h2 className="text-xl font-semibold mb-4">Set up your template</h2>
                        <p className="text-gray-600 mb-6">Choose the category that best describes your message template. Then, choose the type of message you want to send.</p>
                      
                      {/* Template Type Tabs */}
                      <div className="grid grid-cols-3 gap-4 mb-8">
                        <button className={`flex items-center justify-center gap-2 p-4 rounded-lg border ${
                            activeTab ==='marketing' ? 'border-blue-500' : 'border-gray-200'}`}
                            onClick={()=> setActiveTab('marketing')}>
                              <MessageSquare size={20} />
                              <span >Marketing</span>
                        </button>
                        <button className={`flex items-center justify-center gap-2 p-4 rounded-lg border ${
                          activeTab === 'utility' ? 'border-blue-500' : 'border-gray-200'}`}
                          onClick={()=>setActiveTab('utility')}>
                            <Wrench size={20} />
                            <span>Utility</span>
                          </button>

                          <button className={`flex items-center justify-center gap-2 p-4 rounded-lg border ${
                            activeTab === 'verification' ? "border-blue-500" :"border-gray-200"}`} 
                            onClick={()=>setActiveTab('verification')}>
                              <ShieldCheck size={20} />
                              <span>Verification</span>
                            </button>
                      </div>

                      {/* template type selection */}
                      
                      <div className="space-y-4">
                          <div className={`p-4 rounded--lg border ${
                            templateType === 'custom'? 'border-blue-500 bg-blue-50':'border-gray-200'}`}
                            onClick={()=>setTemplateType('custom')}>
                              <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-lg border ${
                                  templateType==='custom' ? "border-4 border-blue-500" : "border-gray-300"}`}>                                    
                                  </div>
                                  <h3 className="font-semibold">Custom</h3>
                              </div>
                              <p className="text-gray-500 ml-6">Send promotions or announcements to increase awareness and engagement.</p>
                          </div>
                          <div className={`p-4 rounded-lg border ${
                            templateType === 'catalogue'? 'border-blue-500 bg-blue-50':'border-gray-200'}`}
                            onClick={()=>setTemplateType('catalogue')}>
                              <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-lg border ${
                                  templateType ==='catalogue'? "border-4 border-blue-500":'border-gray-300'}`}></div>
                                  <h3 className="font-semibold">Catalogue</h3>
                              </div>
                              <p className="text-gray-500 ml-6">Send messages about your entire catalog or just a few of its products.</p>
                          </div>
                      </div>
                      </>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Template Name
                            </label>
                            <input
                              type="text"
                              value={templateName}
                              onChange={(e)=> setTemplateName(e.target.value)}
                              placeholder="Enter template name"
                              className="w-full p-2 border rounded-md"
                              maxLength={512}
                            />
                            <div className="text-sm text-gray-500 mt-1">
                              {templateName.length} /512
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Language
                            </label>
                            <select
                             value={language}
                             onChange={(e)=>setlanguage(e.target.value)}
                             className="w-full p-2 border rounded-md"
                            >
                             {languages.map((lang) => (
                              <option key={lang} value={lang}>{lang}</option>
                             ))}
                            </select>
                          </div>
                        </div>


                          {/* Header Section with Variables */}
                      <div className="border p-4 rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Header (Optional)</h3>
                          <button
                            onClick={() => {
                              setNewVariable({ ...newVariable, section: 'header' });
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
                              <p className="text-sm text-gray-600">Type: {variable.type}</p>
                              <p className="text-sm text-gray-600">Example: {variable.example}</p>
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
                                <option key={type.value} value={type.value}>{type.label}</option>
                              ))}
                            </select>

                            {headerType === 'text' && (
                              <input
                                type="text"
                                value={headerContent || ''}
                                onChange={(e) => setHeaderContent(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="Enter header text"
                              />
                            )}

                            {(headerType === 'image' || headerType === 'video' || headerType === 'document') && (
                              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                                <input
                                  type="file"
                                  accept={headerType === 'image' ? 'image/*' : headerType === 'video' ? 'video/*' : '*'}
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

                            {headerType === 'location' && (
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

                    {/* Body Section with Variables */}
                    <div className="border p-4 rounded-lg bg-gray-50">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Message Body Section</h3>
                            <button
                              onClick={() => {
                                setNewVariable({ ...newVariable, section: 'body' });
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
                                  <p className="text-sm text-gray-600">Type: {variable.type}</p>
                                  <p className="text-sm text-gray-600">Example: {variable.example}</p>
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
                                value={messageBody}
                                onChange={(e) => setMessageBody(e.target.value)}
                                placeholder="Enter your message"
                                className="w-full p-2 border rounded-md h-32 bg-white"
                                maxLength={1024}
                              />
                              <div className="absolute bottom-2 right-2 flex gap-2">
                                <button className="p-1 text-gray-500 hover:text-gray-700">
                                  <span className="font-bold">B</span>
                                </button>
                                <button className="p-1 text-gray-500 hover:text-gray-700">
                                  <span className="italic">I</span>
                                </button>
                                <button className="p-1 text-gray-500 hover:text-gray-700">
                                  <span className="line-through">S</span>
                                </button>
                                <button className="p-1 text-gray-500 hover:text-gray-700">
                                  <code>&lt;/&gt;</code>
                                </button>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {messageBody.length} / 1024
                            </div>
                          </div>
                    </div>
 

                              {/* Footer */}
                          <div className="">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                              Footer (Optional)
                              </label>
                              <input
                              type="text"
                              placeholder="Enter footer text"
                              className="w-full p-2 border rounded-md"
                              value={footer}
                              onChange={(e)=>setFooter(e.target.value)}
                              maxLength={60}
                              />
                              <div className="text-sm text-gray-500 mt-1">
                                  {footer.length}/10
                              </div>
                          </div>  

                          {/* button*/}
                          <div >
                              <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Button {button.length}/10
                                </label>
                                <button
                                onClick={()=>setShowButtonModal(true)}
                                disabled={button.length >=10}
                                className="text-blue-500 hover:text-blue-600 disabled:text-gray-400 text-sm flex items-center gap-1">
                                  <Plus size={16}/>
                                  Add Button
                                </button>
                              </div>

                              <div className="space-y-2">
                                {button.map((buttons)=>(
                                  <div key={buttons.id}
                                  className="flex items-center justify-between p-2 border rounded-md">
                                    <div>
                                        <span className="text-sm font-medium capitalize"> {buttons.type}</span>
                                        <p className="text-sm text-gray-600">{buttons.text}</p>
                                    </div>

                                    <button
                                    onClick={()=>removeButton(buttons.id)}
                                    className="text-red-500 hover:text-red-600"
                                    >
                                      <Trash2 size={16}/>
                                    </button>
                                  </div>
                                ))}
                              </div>
                          </div>

                          {/* Sample Content Section */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Info size={16} className="text-blue-500"/>
                                    <h4 className="font-medium">Sample Content</h4>
                                </div>
                                <p className="text-sm text-gray-600">
                                  To help us review your message template, please add an example of each variable to your body text. Do not use real customer information. Meta's hosted cloud API reviews template and variable parameters to protect the security and integrity of our services.
                                </p>
                          </div>
                    </div>
                    )}

                    {/* Action button */}
                    <div className="flex justify-end gap-4 mt-8">
                      <button
                      onClick={handleback}
                      className="px-4 py-2 border rounded-md hover:bg-gray-50">
                        {step === 1 ? 'Go Back' : 'Previous'}
                      </button>
                      <button
                      onClick={step ===1 ?handleNext : exportData}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                         {step === 1 ? 'Next' : 'Export Template'}
                      </button>
                      </div>
                  </div>
                  
                  {/* preview */}
                  {step ===2 ? (
                    <div className="bg-gray-50 p-6 border-l">
                    <h3 className="text-lg font-semibold mb-4">Preview</h3>
                    <div className="bg-[#E5DDD5] p-4 rounded-lg h-[calc(100vh-12rem)] overflow-y-auto">
                      <div className="max-w-sm mx-auto">
                          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                              {headerType !== 'none' && headerContent && (
                                  <div className="font-medium mb-2">
                                    {headerType === 'text' && getFormatedText(headerContent, 'header')}
                                    {headerType === 'image' && previewFile && (
                                      <img src={previewFile} alt="Preview" className="w-full rounded" />
                                    )}
                                    {headerType === 'video' && previewFile && (
                                      <video src={previewFile} controls className="w-full rounded" />
                                    )}
                                    {headerType === 'document' && (
                                      <div className="flex items-center">
                                        <Upload className="w-5 h-5 mr-2" />
                                        <span>{headerContent}</span>
                                      </div>
                                    )}
                                    {headerType === 'location' && (
                                      <div className="flex items-center">
                                        <MapPin className="w-5 h-5 mr-2" />
                                        <span>Location</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                            <div className="mb-2">
                                  {getFormatedText(messageBody, 'body') || 'Message body will appear here'}
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
                  ) : (
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
                              <button
                                className="w-full p-2 text-center bg-gray-50 text-blue-500 rounded"
                              >
                                Button 1
                              </button>
                              <button
                                className="w-full p-2 text-center bg-gray-50 text-blue-500 rounded"
                              >
                                Button 2
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Add {newVariable.section === 'header' ? 'Header' : 'Body'} Variable
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variable Name
                </label>
                <input
                  type="text"
                  value={newVariable.name}
                  onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
                  placeholder="Enter variable name"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variable Type
                </label>
                <select
                  value={newVariable.type}
                  onChange={(e) => setNewVariable({ ...newVariable, type: e.target.value as Variable['type'] })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Example Value
                </label>
                <input
                  type="text"
                  value={newVariable.example}
                  onChange={(e) => setNewVariable({ ...newVariable, example: e.target.value })}
                  placeholder="Enter example value"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowVariableModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addVariable}
                disabled={!newVariable.name || !newVariable.example}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
              >
                Add Variable
              </button>
            </div>
          </div>
        </div>
        )}

        {/* Button Modal */}
        {showButtonModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Add Button</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button Type
                  </label>
                  <select
                    value={newButton.type}
                    onChange={(e) => setNewButton({ ...newButton, type: e.target.value as Button['type'] })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="reply">Quick Reply</option>
                    <option value="url">URL</option>
                    <option value="phone">Phone Number</option>
                    <option value="copy">Copy Text</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={newButton.text}
                    onChange={(e) => setNewButton({ ...newButton, text: e.target.value })}
                    placeholder="Enter button text"
                    className="w-full p-2 border rounded-md"
                    maxLength={20}
                  />
                </div>
                {(newButton.type === 'url' || newButton.type === 'phone' || newButton.type === 'copy') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {newButton.type === 'url' ? 'URL' : newButton.type === 'phone' ? 'Phone Number' : 'Text to Copy'}
                    </label>
                    <input
                      type={newButton.type === 'phone' ? 'tel' : 'text'}
                      value={newButton.value || ''}
                      onChange={(e) => setNewButton({ ...newButton, value: e.target.value })}
                      placeholder={
                        newButton.type === 'url'
                          ? 'https://example.com'
                          : newButton.type === 'phone'
                          ? '+1234567890'
                          : 'Text to copy'
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowButtonModal(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addButton}
                  disabled={!newButton.text}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                >
                  Add Button
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default TemplateBuilders;