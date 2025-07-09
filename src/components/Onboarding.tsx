import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Building2, User, Check, ArrowRight, ArrowLeft, Users, Shield, Globe, Mail, Phone, MapPin, Sparkles } from "lucide-react";

interface OnboardingProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 1 | 2 | 3 | 4;

const Onboarding = ({ isOpen, onClose }: OnboardingProps) => {
  const [step, setStep] = useState<Step>(1);
  const [accountType, setAccountType] = useState<'organization' | 'individual' | null>(null);

  // Organization fields
  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");
  const [orgDomain, setOrgDomain] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const [orgWebsite, setOrgWebsite] = useState("");
  const [orgSize, setOrgSize] = useState("");
  const [orgIndustry, setOrgIndustry] = useState("");
  
  // Admin user fields
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminRole, setAdminRole] = useState("");
  
  // Organization settings
  const [allowPublicSignup, setAllowPublicSignup] = useState(false);
  const [requireEmailVerification, setRequireEmailVerification] = useState(true);
  const [enableSSO, setEnableSSO] = useState(false);

  // Individual fields
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const totalSteps = accountType === 'organization' ? 4 : 2;
  const progressPercentage = (step / totalSteps) * 100;

  const dialogProps = {
    open: isOpen,
    onOpenChange: (open: boolean) => {
      if (!open) onClose();
    },
    modal: true,
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => (prev + 1) as Step);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as Step);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting:', {
      accountType,
      ...(accountType === 'organization' ? {
        organization: { orgName, orgSlug, orgDomain, orgDescription, orgWebsite, orgSize, orgIndustry },
        admin: { adminName, adminEmail, adminPhone, adminRole },
        settings: { allowPublicSignup, requireEmailVerification, enableSSO }
      } : {
        user: { userName, userEmail }
      })
    });
    onClose();
  };

  const stepTitles = {
    1: "Choose Account Type",
    2: accountType === 'organization' ? "Organization Details" : "Personal Information",
    3: "Administrator Setup",
    4: "Organization Settings"
  };

  return (
    <Dialog {...dialogProps}>
      <DialogContent
        className="max-w-2xl w-full max-h-[90vh] bg-white p-0 rounded-lg shadow-xl border overflow-hidden flex flex-col"
        onEscapeKeyDown={e => e.preventDefault()}
      >
        {/* Compact Header with progress indicator */}
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <DialogHeader className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <DialogTitle className="text-white text-xl font-bold mb-1">
              Welcome to Heidel AI
            </DialogTitle>
            <DialogDescription className="text-blue-100 text-sm mb-3">
              {stepTitles[step]}
            </DialogDescription>
            
            {/* Compact Step indicator */}
            <div className="flex justify-center space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    step >= stepNum 
                      ? 'bg-white text-blue-600 shadow-md' 
                      : 'bg-white/30 text-white'
                  }`}>
                    {step > stepNum ? <Check className="w-4 h-4" /> : stepNum}
                  </div>
                  {stepNum < totalSteps && (
                    <div className={`w-8 h-0.5 mx-1 rounded-full transition-all duration-300 ${
                      step > stepNum ? 'bg-white' : 'bg-white/30'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </DialogHeader>
        </div>

        {/* Content Area - Fixed height to prevent scrolling */}
        <div className="flex-1 p-6 overflow-hidden ">
          {/* Step 1: Account Type Selection */}
          {step === 1 && (
            <div className="h-full flex flex-col justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  className={`group relative border-2 rounded-lg p-4 flex flex-col items-center transition-all duration-300 hover:scale-105 ${
                    accountType === 'organization'
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : "border-gray-200 hover:border-blue-300 hover:shadow-md bg-white"
                  }`}
                  onClick={() => setAccountType('organization')}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-all duration-300 ${
                    accountType === 'organization'
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                  }`}>
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-gray-900 text-lg mb-1">Organization</span>
                  <span className="text-gray-600 text-center text-sm mb-3 px-2">
                    Team workspace with advanced features
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Users className="w-3 h-3 mr-1" />
                    <span>Team</span>
                    <Shield className="w-3 h-3 ml-2 mr-1" />
                    <span>Enterprise</span>
                  </div>
                  {accountType === 'organization' && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
                
                <button
                  className={`group relative border-2 rounded-lg p-4 flex flex-col items-center transition-all duration-300 hover:scale-105 ${
                    accountType === 'individual'
                      ? "border-green-500 bg-green-50 shadow-lg"
                      : "border-gray-200 hover:border-green-300 hover:shadow-md bg-white"
                  }`}
                  onClick={() => setAccountType('individual')}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-all duration-300 ${
                    accountType === 'individual'
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-600"
                  }`}>
                    <User className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-gray-900 text-lg mb-1">Individual</span>
                  <span className="text-gray-600 text-center text-sm mb-3 px-2">
                    Personal workspace and projects
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Globe className="w-3 h-3 mr-1" />
                    <span>Personal</span>
                    <Shield className="w-3 h-3 ml-2 mr-1" />
                    <span>Full Access</span>
                  </div>
                  {accountType === 'individual' && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              </div>
              
              <div className="text-center">
                <button
                  className={`font-semibold py-2 px-6 rounded-lg transition-all duration-300 ${
                    accountType !== null
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={accountType === null}
                  onClick={handleNext}
                >
                  <span className="flex items-center">
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Organization Details */}
          {step === 2 && accountType === 'organization' && (
            <div className="h-full flex flex-col">
              <div className="text-center mb-2">
                
                <h3 className="text-lg font-bold text-gray-900 mb-1">Organization Information</h3>
                <p className="text-gray-600 text-sm">Basic details about your organization</p>
              </div>
              
              <form className="flex-1 space-y-4" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium text-sm mb-1">Organization Name *</label>
                    <input
                      type="text"
                      className="w-full border-2 text-black border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      placeholder="Acme Corporation"
                      value={orgName}
                      onChange={e => setOrgName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium text-sm mb-1">Slug *</label>
                    <input
                      type="text"
                      className="w-full border-2 text-black border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      placeholder="acme-corp"
                      value={orgSlug}
                      onChange={e => setOrgSlug(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium text-sm mb-1">Domain</label>
                    <input
                      type="text"
                      className="w-full border-2 text-black border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      placeholder="acme.com"
                      value={orgDomain}
                      onChange={e => setOrgDomain(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium text-sm mb-1">Website</label>
                    <input
                      type="url"
                      className="w-full border-2 text-black border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      placeholder="https://acme.com"
                      value={orgWebsite}
                      onChange={e => setOrgWebsite(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium text-sm mb-1">Company Size</label>
                    <select
                      className="w-full border-2 text-black border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white"
                      value={orgSize}
                      onChange={e => setOrgSize(e.target.value)}
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-1000">201-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium text-sm mb-1">Industry</label>
                    <select
                      className="w-full border-2 text-black border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white"
                      value={orgIndustry}
                      onChange={e => setOrgIndustry(e.target.value)}
                    >
                      <option value="">Select industry</option>
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="education">Education</option>
                      <option value="retail">Retail</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-1">Description</label>
                  <textarea
                    className="w-full border-2 text-black border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none"
                    placeholder="Brief description of your organization..."
                    rows={3}
                    value={orgDescription}
                    onChange={e => setOrgDescription(e.target.value)}
                  />
                </div>
                
                <DialogFooter className="flex justify-between pt-4">
                  <button
                    type="button"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all duration-300 font-medium flex items-center"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg flex items-center"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </DialogFooter>
              </form>
            </div>
          )}

          {/* Step 2: Individual Information */}
          {step === 2 && accountType === 'individual' && (
            <div className="h-full flex flex-col justify-center">
              <div className="text-center mb-6">
                
                <h3 className="text-lg font-bold text-gray-900 mb-1">Personal Information</h3>
                <p className="text-gray-600 text-sm">Set up your individual account</p>
              </div>
              
              <form className="space-y-4 max-w-md mx-auto w-full" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-1">Your Name *</label>
                  <input
                    type="text"
                    className="w-full border-2 text-black border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                    placeholder="John Doe"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-1">Email *</label>
                  <input
                    type="email"
                    className="w-full border-2 text-black border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                    placeholder="john@example.com"
                    value={userEmail}
                    onChange={e => setUserEmail(e.target.value)}
                    required
                  />
                </div>
                
                <DialogFooter className="flex justify-between pt-4">
                  <button
                    type="button"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all duration-300 font-medium flex items-center"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium shadow-lg flex items-center"
                  >
                    Create Account
                    <Check className="w-4 h-4 ml-2" />
                  </button>
                </DialogFooter>
              </form>
            </div>
          )}

          {/* Step 3: Administrator Setup */}
          {step === 3 && accountType === 'organization' && (
            <div className="h-full flex flex-col">
              <div className="text-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Administrator Setup</h3>
                <p className="text-gray-600 text-sm">Primary administrator for your organization</p>
              </div>
              
              <form className="flex-1 space-y-4" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium text-sm mb-1">
                      <Mail className="w-3 h-3 inline mr-1" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="w-full border-2 text-black border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                      placeholder="John Smith"
                      value={adminName}
                      onChange={e => setAdminName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium text-sm mb-1">
                      <Mail className="w-3 h-3 inline mr-1" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className="w-full border-2 text-black border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                      placeholder="john@acme.com"
                      value={adminEmail}
                      onChange={e => setAdminEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium text-sm mb-1">
                      <Phone className="w-3 h-3 inline mr-1" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full border-2 text-black border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                      placeholder="+1 (555) 123-4567"
                      value={adminPhone}
                      onChange={e => setAdminPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium text-sm mb-1">
                      <MapPin className="w-3 h-3 inline mr-1" />
                      Job Title/Role
                    </label>
                    <input
                      type="text"
                      className="w-full border-2 text-black border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                      placeholder="CEO, CTO, Admin, etc."
                      value={adminRole}
                      onChange={e => setAdminRole(e.target.value)}
                    />
                  </div>
                </div>
                
                <DialogFooter className="flex justify-between pt-4">
                  <button
                    type="button"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all duration-300 font-medium flex items-center"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg flex items-center"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </DialogFooter>
              </form>
            </div>
          )}

          {/* Step 4: Organization Settings */}
          {step === 4 && accountType === 'organization' && (
            <div className="h-full flex flex-col">
              <div className="text-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Organization Settings</h3>
                <p className="text-gray-600 text-sm">Configure security and access settings</p>
              </div>
              
              <form className="flex-1 space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div>
                      <label className="font-medium text-gray-800 text-sm">Allow Public Signup</label>
                      <p className="text-gray-600 text-xs">Users can join without invitation</p>
                    </div>
                    <button
                      type="button"
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                        allowPublicSignup ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                      onClick={() => setAllowPublicSignup(!allowPublicSignup)}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                          allowPublicSignup ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div>
                      <label className="font-medium text-gray-800 text-sm">Require Email Verification</label>
                      <p className="text-gray-600 text-xs">Users must verify email before access</p>
                    </div>
                    <button
                      type="button"
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                        requireEmailVerification ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                      onClick={() => setRequireEmailVerification(!requireEmailVerification)}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                          requireEmailVerification ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div>
                      <label className="font-medium text-gray-800 text-sm">Enable Single Sign-On (SSO)</label>
                      <p className="text-gray-600 text-xs">Allow SSO with enterprise providers</p>
                    </div>
                    <button
                      type="button"
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                        enableSSO ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                      onClick={() => setEnableSSO(!enableSSO)}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                          enableSSO ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                
                <DialogFooter className="flex justify-between pt-4">
                  <button
                    type="button"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all duration-300 font-medium flex items-center"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium shadow-lg flex items-center"
                  >
                    Create Organization
                    <Check className="w-4 h-4 ml-2" />
                  </button>
                </DialogFooter>
              </form>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Onboarding;