'use client';

import React, { useState, useEffect } from 'react';
import { 
  Send, 
  BriefcaseBusiness ,
  ArrowLeft, 
  ArrowRight, 
  Check,
  Plus,
  X,
  MailCheck,
} from 'lucide-react';
import Lottie from 'lottie-react';
import { useRouter } from 'next/navigation';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

interface IssueType {
  id: string;
  label: string;
  color: string;
}

const OnboardingFlow: React.FC = () => {
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [newIssueType, setNewIssueType] = useState('');
  const [selectedIssueTypes, setSelectedIssueTypes] = useState<IssueType[]>([
    { id: '1', label: 'Follow up', color: 'bg-blue-100 text-blue-800' },
    { id: '2', label: 'Support', color: 'bg-green-100 text-green-800' },
    { id: '3', label: 'Finance service', color: 'bg-purple-100 text-purple-800' },
    { id: '4', label: 'Bug report', color: 'bg-red-100 text-red-800' },
    { id: '5', label: 'Special request', color: 'bg-yellow-100 text-yellow-800' },
  ]);
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [noCompany, setNoCompany] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: ''
  });
  const [selectedCompanyTypes, setSelectedCompanyTypes] = useState<string[]>([]);
  const [companySize, setCompanySize] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [tempCompanySize, setTempCompanySize] = useState(0);
  const [teamMembers, setTeamMembers] = useState<Array<{id: string, email: string, selected: boolean}>>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [step2Error, setStep2Error] = useState('');
  const [setupComplete, setSetupComplete] = useState(false);


  const [userData, setUserData] = useState<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    account?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    companyDetails?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    team?: any;
    completed?: boolean;
  }>({});

  const generateStepData = (step: number) => {
    switch (step) {
      case 1:
        return {
          account: {
            email,
            hasCompany: !noCompany,
            companyName: companyName || null,
            createdAt: new Date().toISOString()
          }
        };
      case 2:
        return {
          companyDetails: {
            companyTypes: selectedCompanyTypes,
            companySize: companySizeRanges[companySize],
            companySizeIndex: companySize
          }
        };
      case 3:
        return {
          team: {
            members: teamMembers.map(member => ({
              email: member.email,
              invitedAt: new Date().toISOString()
            }))
          }
        };
      case 4:
        return {
          completed: true,
          completedAt: new Date().toISOString()
        };
      default:
        return {};
    }
  };



  const steps: Step[] = [
    {
      id: 1,
      title: 'Create Account',
      description: 'Provide an email and password',
      icon: <MailCheck className="w-5 h-5" />,
      completed: currentStep > 1
    },
    {
      id: 2,
      title: 'Your Details',
      description: 'Tell us a bit more for personalised experience',
      icon: <BriefcaseBusiness className="w-5 h-5" />,
      completed: currentStep > 2
    },
    {
      id: 3,
      title: 'Invite your Team',
      description: 'Start collaborating with your team',
      icon: <Send className="w-5 h-5" />,
      completed: currentStep > 3
    },
    {
      id: 4,
      title: 'Success',
      description: 'All done! Account setup successful',
      icon: <Check className="w-5 h-5" />,
      completed: false
    }
  ];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isDragging) {
      setTempCompanySize(value);
    } else {
      setCompanySize(value);
    }
  };

  // Update slider styles for smoother animation
  const sliderStyles = `
    .slider {
      transition: none;
    }
    
    .slider.snapping {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .slider::-webkit-slider-thumb {
      appearance: none;
      height: 20px;
      width: 20px;
      border-radius: 50%;
      background: white;
      border: 2px solid #16a34a;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      transition: all 0.2s ease;
    }
    
    .slider::-webkit-slider-thumb:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    
    .slider::-webkit-slider-thumb:active {
      transform: scale(1.05);
    }

    .slider::-moz-range-thumb {
      height: 20px;
      width: 20px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
      border: 2px solid #16a34a;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      transition: all 0.2s ease;
    }
    
    .slider::-moz-range-thumb:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
  `;

  const removeMember = (id: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
  };

  // Team member functions with limit
  const addTeamMember = () => {
    // Check if limit is reached
    if (teamMembers.length >= 2) {
      setEmailError('You can only add up to 2 team members');
      return;
    }

    if (!newMemberEmail.trim()) {
      setEmailError('Email address is required');
      return;
    }
    
    if (!validateEmail(newMemberEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Check if user is trying to invite themselves
    if (newMemberEmail.toLowerCase() === email.toLowerCase()) {
      setEmailError("You can't invite yourself");
      return;
    }

    if (teamMembers.some(member => member.email.toLowerCase() === newMemberEmail.toLowerCase())) {
      setEmailError('This email is already added');
      return;
    }

    const newMember = {
      id: Date.now().toString(),
      email: newMemberEmail.trim(),
      selected: true
    };

    setTeamMembers([...teamMembers, newMember]);
    setNewMemberEmail('');
    setEmailError('');
  };
 

  const selectedCount = teamMembers.filter(member => member.selected).length;

  // Generate initials from email
  const getInitials = (email: string) => {
    const name = email.split('@')[0];
    return name.length >= 2 ? name.substring(0, 2).toUpperCase() : name.charAt(0).toUpperCase();
  };

  // Generate random color for profile picture
  const getProfileColor = (email: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
      'bg-yellow-500', 'bg-indigo-500', 'bg-red-500', 'bg-gray-500'
    ];
    const index = email.length % colors.length;
    return colors[index];
  };


  // Company type options
  const companyTypes = [
    'Technology',
    'Healthcare',
    'Finance',
    'E-commerce',
    'Education',
    'Retail',
    'Manufacturing',
    'Consulting',
    'Marketing',
    'Real Estate',
    'Non-profit',
    'Other'
  ];

  // Company size ranges
  const companySizeRanges = [
    '1-10 people',
    '10-50 people', 
    '50-100 people',
    '100-500 people',
    '500-1000 people',
    '1000+ people'
  ];


  // Enter key handler
React.useEffect(() => {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      // Don't trigger handleNext on step 3 if user is in the email input
      if (currentStep === 3) {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.tagName === 'INPUT' && activeElement.getAttribute('type') === 'email') {
          // Let the input field handle the Enter key (for adding team member)
          return;
        }
      }
      handleNext();
    }
  };

  document.addEventListener('keydown', handleKeyPress);
  return () => {
    document.removeEventListener('keydown', handleKeyPress);
  };
}, [currentStep, email, password, confirmPassword, companyName, noCompany]); // Dependencies to ensure validation runs with current values


    // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleInputChange = (field: string, value: string) => {
    // Clear errors when user starts typing
    setErrors(prev => ({ ...prev, [field]: '' }));
    
    switch (field) {
      case 'companyName':
        setCompanyName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }
  };

  const validateStep1 = () => {
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: '',
      companyName: ''
    };

    // Company name validation (only if not checked "no company")
    if (!noCompany && !companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  
  const validateStep2 = () => {
    if (selectedCompanyTypes.length === 0) {
      setStep2Error('Please select at least one category to continue');
      return false;
    }
    setStep2Error('');
    return true;
  };

  // Clear error when user selects a company type
  const toggleCompanyType = (type: string) => {
    setSelectedCompanyTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
    // Clear error when user makes a selection
    if (step2Error) {
      setStep2Error('');
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) {
        return;
      }
      // Save step 1 data
      setUserData(prev => ({ ...prev, ...generateStepData(1) }));
    }

    if (currentStep === 2) {
      if (!validateStep2()) {
        return;
      }
      // Save step 2 data
      setUserData(prev => ({ ...prev, ...generateStepData(2) }));
    }

    if (currentStep === 3) {
      // Save step 3 data even if no team members
      setUserData(prev => ({ ...prev, ...generateStepData(3) }));
    }

    if (currentStep === 4) {
      // Complete setup
      setUserData(prev => ({ ...prev, ...generateStepData(4) }));
      setSetupComplete(true);
      
      // Here you would typically send the complete userData to your backend
      console.log("Complete user data:", userData);
      
      // In a real app, you'd redirect to dashboard after API call
      // For now, we'll just simulate completion
      return;
    }

    if (currentStep < 4) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  // Log the current state of userData whenever it changes
  useEffect(() => {
    console.log("Current user data:", userData);
  }, [userData]);

  const handleSkip = () => {
    if (currentStep < 4) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
      setCurrentStep(currentStep - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep || steps[stepId - 1].completed) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(stepId);
        setIsTransitioning(false);
      }, 150);
    }
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={`space-y-6 transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Create your account with us</h2>
              <p className="text-gray-600">
                Set up your workspace to connect platforms like WhatsApp, Instagram, and more. From here, you can add team members, and streamline conversations across all your channels. All in one place.
              </p>
            </div>

            {/* Company Name Field */}
            <div className={`transition-all p-1 duration-300 overflow-hidden ${
              !noCompany ? 'max-h-22 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company name *
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="e.g. X"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
                    errors.companyName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.companyName && (
                  <p className="text-sm text-red-600 mt-1">{errors.companyName}</p>
                )}
              </div>
            </div>

            {/* No Company Checkbox */}
            <div className="flex pl-1 items-center space-x-2">
              <input
                type="checkbox"
                id="noCompany"
                checked={noCompany}
                onChange={(e) => {
                  setNoCompany(e.target.checked);
                  if (e.target.checked) {
                    setCompanyName('');
                    setErrors(prev => ({ ...prev, companyName: '' }));
                  }
                }}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500 transition-all duration-200 cursor-pointer"
              />
              <label htmlFor="noCompany" className="text-sm text-gray-700 cursor-pointer">
                I don&apos;t have a company
              </label>
            </div>

            {/* Email Address Field */}
            <div className='pl-1'>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="e.g. musk@x.com"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className='pl-1'>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <p className={`text-sm mt-1 ${errors.password ? 'text-red-600' : 'text-gray-500'}`}>
                Password must be at least 8 characters long
              </p>
            </div>

            {/* Confirm Password Field */}
            <div className='pl-1'>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm your password"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            
          </div>
        );

        case 2:
          return (
            <div className={`space-y-6 transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Tell us more about {companyName ? `${companyName}` : 'yourself'}
                </h2>
                <p className="text-gray-600 mb-10 sm:mb-16">
                  Help us customize your workspace by telling us a bit about 
                  {companyName 
                    ? ` ${companyName} and how it operates.`
                    : ' yourself and your work.'
                  }
                </p>
              </div>

              {/* Company Type Selection */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-5">
                  What kind of {companyName ? 'company are you' : 'work do you do'}?
                </h3>
                <div className="flex flex-wrap gap-4 max-w-3xl">
                  {companyTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleCompanyType(type)}
                      className={`px-4 py-2 rounded-lg ${
                        selectedCompanyTypes.includes(type)
                          ? 'bg-zinc-800 text-white'
                          : 'bg-[#f0f0f0] text-black hover:bg-[#dbdbdb]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {/* Show validation error only when step2Error is set */}
                {step2Error && (
                  <p className="text-sm text-red-600 mt-2">
                    {step2Error}
                  </p>
                )}
              </div>

              {/* Company Size Slider */}
              <div>
                <h3 className="text-xl font-semibold mt-14 text-gray-900 mb-5">
                  How large is your {companyName ? 'company' : 'team'}?
                </h3>
                
                <div className="space-y-4 max-w-3xl">
                  {/* Size Display */}
                  <div className="text-left">
                    <span className="text-4xl font-semibold text-black">
                      {companySizeRanges[companySize]}
                    </span>
                  </div>

                  {/* Simple Slider */}
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max={companySizeRanges.length - 1}                               
                      value={isDragging ? tempCompanySize : companySize}
                      onChange={handleSliderChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #16a34a 0%, #16a34a ${
                          (companySize / (companySizeRanges.length - 1)) * 100
                        }%, #e5e7eb ${
                          (companySize / (companySizeRanges.length - 1)) * 100
                        }%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                  {/* Snap indicators */}
                    <div className="flex justify-between mt-2 px-1">
                      {companySizeRanges.map((_, index) => (
                        <div
                          key={index}
                          className={`w-1 h-1 rounded-full transition-all duration-200 ${
                            index === (isDragging ? tempCompanySize : companySize)
                              ? 'bg-green-600 scale-150'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                </div>
              </div>
              
            </div>
          );

      case 3:
    return (
      <div className={`space-y-6 transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Invite your team to {companyName || 'your workspace'}
          </h2>
          <p className="text-gray-600">
            Collaborate with your team members by inviting them to join your workspace. 
            They&apos;ll be able to access conversations and help manage customer communications.
          </p>
        </div>

        {/* Add Team Member Section */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-3">
            Add team members (up to 2)
          </h3>
          <div className="flex items-start space-x-2">
            <div className="flex-1">
              <input
                type="email"
                value={newMemberEmail}
                onChange={(e) => {
                  setNewMemberEmail(e.target.value);
                  setEmailError('');
                }}
                placeholder="Enter email address"
                disabled={teamMembers.length >= 2}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${
                  emailError ? 'border-red-300' : 'border-gray-300'
                } ${teamMembers.length >= 2 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                onKeyPress={(e) => e.key === 'Enter' && addTeamMember()}
              />
              {emailError && (
                <p className="text-sm text-red-600 mt-1">{emailError}</p>
              )}
            </div>
            <button
              onClick={addTeamMember}
              disabled={teamMembers.length >= 2}
              className={`px-4 py-2 rounded-md text-sm flex items-center transition-all duration-200 ${
                teamMembers.length >= 2
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-700 text-white hover:bg-green-800 hover:shadow-md'
              }`}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </button>
          </div>
          {teamMembers.length >= 2 && (
            <p className="text-sm text-gray-500 mt-2">
              Maximum of 2 team members reached
            </p>
          )}
        </div>

        {/* Team Members List */}
        {teamMembers.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Team members ({teamMembers.length}/2)
            </h4>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center flex-1 space-x-3">
                    {/* Profile Picture */}
                    <div className={`w-10 h-10 rounded-full ${getProfileColor(member.email)} flex items-center justify-center text-white font-medium text-sm`}>
                      {getInitials(member.email)}
                    </div>
                    
                    {/* Email */}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{member.email}</p>
                      <p className="text-xs text-gray-500">Team member</p>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeMember(member.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {teamMembers.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>{teamMembers.length}</strong> team member{teamMembers.length > 1 ? 's' : ''} will be invited
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {teamMembers.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
            <p className="text-gray-500">Add up to 2 email addresses to start building your team</p>
          </div>
        )}
      </div>
    );

      case 4:
        return (
          <div className={`space-y-6 flex flex-col items-center justify-center h-full transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <div className="text-center max-w-lg">
              <div className="mx-auto w-40 h-40 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <Check className="w-20 h-20 text-green-600" />
              </div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                Welcome to Heidel AI!
              </h2>
              <p className="text-gray-600 mb-8">
                {companyName ? `${companyName}'s` : 'Your'} workspace is ready to use. You can now start managing your customer conversations and collaborating with your team.
              </p>
              
              
              
             
            </div>
          </div>
        );

          default:
            return null;
        }
      };

  return (
  <>
  <style dangerouslySetInnerHTML={{ __html: sliderStyles }} />
  <div className="min-h-screen flex justify-center items-center overflow-hidden bg-white">
    <div className="w-full mx-auto p-6 ">
      <div className="bg-white h-full rounded-xl transition-shadow duration-300">
        

        <div className="flex sm:h-[calc(100vh-3rem)]">
          {/* Sidebar - Fixed */}
          <div className="w-96 bg-[#f0f0f0] rounded-xl hidden sm:flex p-6  flex-col flex-shrink-0">
            {/* Background Logo */}
            <div 
              className="absolute left-36 bottom-8 opacity-10 pointer-events-none"
              style={{
                backgroundImage: "url('/heidelai.png')",
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                width: '350px',
                height: '350px',
                filter: 'grayscale(100%) brightness(0.5)',
                clipPath: 'inset(0% 25% 0% 0%)' // top, right, bottom, left crop percentages
              }}
            ></div>

            {/* Logo and Title */}
            <div className="mb-14 relative z-10">
              <div className="flex items-center mb-6 space-x-2">
                <div className="w-12 h-12 rounded flex items-center justify-center transition-colors duration-200">
                  <img src="/heidelai.png" alt="HeidelAI Logo" className='w-full text-black h-full'/>
                </div>
                <span className="text-xl font-semibold">Heidel AI</span>
              </div>
            </div>
           

            {/* Steps - flex-1 to take remaining space */}
            <div className="flex-1 relative z-10">
              {steps.map((step, index) => (
                <div 
                  key={step.id} 
                  className={`flex items-start space-x-3 cursor-pointer transition-all duration-200 ${
                    step.id <= currentStep || step.completed ? 'hover:bg-blue-100 rounded-lg p-2 -m-2' : ''
                  }`}
                  onClick={() => handleStepClick(step.id)}
                >
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? 'bg-green-600 text-white ' 
                        : currentStep === step.id 
                        ? 'bg-green-600 text-white ring-4 ring-green-200 ' 
                        : 'bg-gray-200 text-gray-500'
                    } transition-all duration-300`}>
                      {step.completed ? <Check className="w-5 h-5" /> : step.icon}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-px h-12 ml-5 mt-2 transition-colors duration-300 ${
                        step.completed ? 'bg-green-300' : 'bg-gray-300'
                      }`}></div>
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Back to Home Button */}
            <div className="flex items-center relative z-10">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:bg-white hover:bg-opacity-50 px-3 py-2 rounded-md"
                onClick={() => router.push('/')}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to home</span>
              </button>
            </div>

          </div>

          {/* Main Content - Scrollable */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Content Area - Scrollable */}
            <div className="flex-1 overflow-y-auto px-1 sm:px-20 pb-24 sm:py-12">
              {renderStepContent()}
            </div>

            {/* Navigation - Fixed at bottom */}
            <div className="flex-shrink-0 px-4 sm:px-20 sm:pb-6 fixed sm:relative bottom-0 left-0 right-0 bg-white border-t border-gray-200">
              <div className="flex items-center justify-between pt-4 md:pt-6">
                <div>
                  {currentStep > 1 && (
                    <button
                      onClick={handleBack}
                      className="flex items-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:bg-gray-100 px-3 py-2 rounded-md"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Back</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  {/* Skip button for step 3 */}
                  {currentStep === 3 && (
                    <button
                      onClick={handleSkip}
                      className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-md transition-all duration-200 hover:bg-gray-100 text-sm"
                    >
                      <span className="hidden sm:inline">Skip this step</span>
                      <span className="inline sm:hidden">Skip</span>
                    </button>
                  )}
                  
                  <button
                    onClick={handleNext}
                    className="px-4 md:px-6 py-2 rounded-md flex items-center transition-all duration-200 hover:shadow-lg transform hover:scale-105 bg-green-700 text-white hover:bg-green-800 text-sm md:text-base"
                  >
                    {/* Desktop text (hidden on mobile) */}
                    <span className="hidden sm:inline">
                      {currentStep === 3 && teamMembers.length > 0 
                        ? `Invite ${teamMembers.length} people` 
                        : currentStep === 4 
                        ? `Continue to Dashboard` 
                        : 'Save and continue'
                      }
                    </span>
                    
                    {/* Mobile text (hidden on desktop) */}
                    <span className="inline sm:hidden">
                      {currentStep === 3 && teamMembers.length > 0 
                        ? `Invite` 
                        : currentStep === 4 
                        ? `Continue` 
                        : 'Save'
                      }
                    </span>
                    
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>

              {/* Progress Bars - Only visible on desktop */}
              <div className="hidden sm:flex justify-center mt-6 space-x-2">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-2 w-16 rounded-full transition-all duration-300 ${
                      step === currentStep 
                        ? 'bg-green-700' 
                        : step < currentStep 
                        ? 'bg-gray-300' 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </>
);
};

export default OnboardingFlow;