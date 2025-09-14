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
  const [adminPassword, setAdminPassword] = useState("");
  
  // Organization settings
  const [allowPublicSignup, setAllowPublicSignup] = useState(false);
  const [requireEmailVerification, setRequireEmailVerification] = useState(true);
  const [enableSSO, setEnableSSO] = useState(false);

  // Individual fields
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const [createdUserId, setCreatedUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orgCreated, setOrgCreated] = useState(false);
  const [orgSlugCreated, setOrgSlugCreated] = useState<string | null>(null);

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

  // Handle individual user creation
  const handleIndividualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        first_name: userName.split(" ")[0] || userName,
        last_name: userName.split(" ").slice(1).join(" ") || "",
        email_address: [userEmail],
        username: userEmail.split("@")[0],
        password: userPassword,
        skip_password_checks: true,
        skip_password_requirement: true,
        public_metadata: { role: "user" },
        legal_accepted_at: new Date().toISOString(),
        skip_legal_checks: true,
        create_organization_enabled: false,
        create_organizations_limit: 0,
        created_at: new Date().toISOString(),
      };

      const res = await fetch("/api/create_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.id) {
        setCreatedUserId(data.id);
        onClose();
      } else {
        alert(data.error || "Failed to create user");
      }
    } catch (err) {
      alert("Error creating user");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle admin user creation for organization
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        first_name: adminName.split(" ")[0] || adminName,
        last_name: adminName.split(" ").slice(1).join(" ") || "",
        email_address: [adminEmail],
        username: adminEmail.split("@")[0],
        password: adminPassword,
        skip_password_checks: true,
        skip_password_requirement: true,
        public_metadata: { role: adminRole },
        legal_accepted_at: new Date().toISOString(),
        skip_legal_checks: true,
        create_organization_enabled: true,
        create_organizations_limit: 2,
        created_at: new Date().toISOString(),
      };

      const res = await fetch("/api/create_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.id) {
        setCreatedUserId(data.id);
        handleNext();
      } else {
        alert(data.error || "Failed to create admin user");
      }
    } catch (err) {
      alert("Error creating admin user");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle organization creation (step 4)
  const handleOrganizationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdUserId) {
      alert("Admin user must be created first.");
      return;
    }
    setIsSubmitting(true);
    try {
      const slug = orgSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
      const payload = {
        name: orgName,
        slug,
        created_by: createdUserId,
        private_metadata: {},
        public_metadata: {},
        max_allowed_memberships: Number(orgSize) || 0, // ensure number type
      };

      const res = await fetch("/api/create_org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setOrgSlugCreated(slug);
        setOrgCreated(true);
      } else {
        alert(data.error || "Failed to create organization");
      }
    } catch (err) {
      alert("Error creating organization");
    } finally {
      setIsSubmitting(false);
    }
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
              className="h-full bg-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <DialogHeader className="bg-white p-4 text-center border-b border-gray-200 relative">
            <button
              type="button"
              className="absolute right-4 top-4 border border-gray-400 text-gray-700 bg-white hover:bg-gray-100 hover:border-gray-600 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
              onClick={onClose}
              aria-label="Cancel"
            >
              <span className="text-lg font-bold leading-none">×</span>
            </button>
            <div className="flex items-center justify-center mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <DialogTitle className="text-gray-900 text-xl font-bold mb-1 text-center">
              Welcome to Heidel AI
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm mb-3 text-center">
              {stepTitles[step]}
            </DialogDescription>
            {/* Step indicator */}
            <div className="flex justify-center space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    step >= stepNum 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > stepNum ? <Check className="w-4 h-4" /> : stepNum}
                  </div>
                  {stepNum < totalSteps && (
                    <div className={`w-8 h-0.5 mx-1 rounded-full transition-all duration-300 ${
                      step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
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
                      ? "bg-blue-600 text-white"
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
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
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
                      ? "bg-green-600 text-white"
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
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              </div>
              
              <div className="text-center">
                <button
                  className={`font-semibold py-2 px-6 rounded-lg transition-all duration-300 ${
                    accountType !== null
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
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
              <div className="text-center mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Administrator Setup</h3>
                <p className="text-gray-600 text-sm">Primary administrator for your organization</p>
              </div>
              
              <form className="flex-1 space-y-4" onSubmit={handleAdminSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium text-sm mb-1">
                      <Mail className="w-3 h-3 inline mr-1" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="w-full border-2 text-black border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
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
                      className="w-full border-2 text-black border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
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
                      className="w-full border-2 text-black border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      placeholder="+1 (555) 123-4567"
                      value={adminPhone}
                      onChange={e => setAdminPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium text-sm mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      className="w-full border-2 text-black border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      placeholder="Password"
                      value={adminPassword}
                      onChange={e => setAdminPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <DialogFooter className="flex justify-between pt-4">
                  <button
                    type="button"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all duration-300 font-medium flex items-center"
                    onClick={handleBack}
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium shadow-lg flex items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Account"}
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
            <form className="space-y-4 max-w-md mx-auto w-full" onSubmit={handleIndividualSubmit}>
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
              <div>
                <label className="block text-gray-700 font-medium text-sm mb-1">Password *</label>
                <input
                  type="password"
                  className="w-full border-2 text-black border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                  placeholder="Password"
                  value={userPassword}
                  onChange={e => setUserPassword(e.target.value)}
                  required
                />
              </div>
              <DialogFooter className="flex justify-between pt-4">
                <button
                  type="button"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all duration-300 font-medium flex items-center"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 font-medium shadow-lg flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Account"}
                  <Check className="w-4 h-4 ml-2" />
                </button>
              </DialogFooter>
            </form>
          </div>
          )}

          {/* Step 3: Administrator Setup */}
          {step === 3 && accountType === 'organization' && (
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
                    <label className="block text-gray-700 font-medium text-sm mb-1">Number of Members *</label>
                    <input
                      type="number"
                      min={1}
                      className="w-full border-2 text-black border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      placeholder="e.g. 25"
                      value={orgSize}
                      onChange={e => setOrgSize(e.target.value)}
                      required
                    />
                  </div>
                  {/* Industry field removed */}
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
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium shadow-lg flex items-center"
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
                <div className="w-10 h-10 bg-slate-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Organization Settings</h3>
                <p className="text-gray-600 text-sm">Configure security and access settings</p>
              </div>
              
              <form className="flex-1 space-y-4" onSubmit={handleOrganizationSubmit}>
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
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 font-medium shadow-lg flex items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Organization"}
                    <Check className="w-4 h-4 ml-2" />
                  </button>
                </DialogFooter>
              </form>
            </div>
          )}
        </div>

        {orgCreated && orgSlugCreated && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center">
              <Check className="mx-auto mb-4 w-12 h-12 text-green-500" />
              <h2 className="text-xl font-bold mb-2">Organization Created!</h2>
              <p className="mb-4">Your organization was created successfully.</p>
              <a
                href={`http://${orgSlugCreated}.localhost:3000`}
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition-all duration-300"
                onClick={() => {
                  // Optionally close onboarding or do cleanup here
                  setOrgCreated(false);
                  onClose();
                }}
              >
                Go to {orgSlugCreated}.yourdomain.com
              </a>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Onboarding;