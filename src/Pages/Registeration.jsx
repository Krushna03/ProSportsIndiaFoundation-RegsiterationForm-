import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Users, Mail, Phone, MapPin, Trophy, User, CheckCircle, CalendarIcon, CreditCard, ArrowLeft, ArrowRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Mock data for demonstration
const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"];
const genders = ["Male", "Female", "Other"];
const categoryEligibility = [
  { label: "Under 12", cutoff: new Date("2013-01-01") },
  { label: "Under 14", cutoff: new Date("2011-01-01") },
  { label: "Under 16", cutoff: new Date("2009-01-01") },
  { label: "Under 18", cutoff: new Date("2007-01-01") }
];

const rulesText = "Sample rules and regulations text...";
const termsText = "Sample terms and conditions text...";

export default function Registration() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [modal, setModal] = useState({ open: false, type: null });
  const [step, setStep] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [formData, setFormData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm({});

  const dateOfBirth = watch("dateOfBirth");
  const category = watch("category");

  const checkEligibility = (dob) => {
    if (!dob) return [];
    return categoryEligibility.filter(cat => dob >= cat.cutoff).map(cat => cat.label);
  };

  const eligibleCategories = checkEligibility(dateOfBirth);

  const handleDateChange = (date) => {
    setIsCalendarOpen(false);
    setValue("dateOfBirth", date || null, { shouldValidate: true });
    if (date && !eligibleCategories.includes(category)) {
      setValue("category", "");
    }
  };

  const openModal = (type) => setModal({ open: true, type });
  const closeModal = () => setModal({ open: false, type: null });

  // Step 1: Form submission (validation only)
  const onFormSubmit = async (data) => {
    if (!eligibleCategories.includes(data.category)) {
      alert("Selected category is not valid for your Date of Birth.");
      return;
    }
    
    setFormData(data);
    setStep(2); // Move to payment step
  };

  // Step 2: Payment processing
  const handlePayment = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    setProcessingPayment(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock payment success
      setPaymentStatus(true);
      setStep(3); // Move to final registration step
      
      // Now submit the actual registration
      await submitRegistration();
      
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  // Step 3: Final registration submission
  const submitRegistration = async () => {
    setSubmitted(true);
    
    try {
      // Simulate API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ status: 200 });
        }, 1000);
      });

      if (response.status === 200) {
        console.log("Registration Successful");
        reset();
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Registration failed. Please contact support.");
      setSubmitted(false);
    }
  };

  const goBackToForm = () => {
    setStep(1);
    setPaymentMethod('');
    setPaymentStatus(false);
  };

  // Success page
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-700" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-4">Your team registration has been submitted successfully. You will receive a confirmation email shortly.</p>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800 font-semibold">Payment Status: Confirmed</p>
            <p className="text-green-600 text-sm">Transaction ID: TXN{Date.now()}</p>
          </div>
        </div>
      </div>
    );
  }

  // Payment step
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-48 h-48 rounded-full">
              <img src="pjc-logo-1.png" alt="logo" />
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-800 -mt-2">
              Payment Details
            </h1>
          </div>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-sm font-medium text-green-600">Registration Form</span>
              </div>
              <div className="w-16 h-1 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">2</span>
                </div>
                <span className="ml-2 text-sm font-medium text-blue-600">Payment</span>
              </div>
              <div className="w-16 h-1 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-bold">3</span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500">Confirmation</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Complete Your Payment</h3>
              <p className="text-gray-600">Registration Fee: ₹2,500</p>
            </div>

            {/* Registration Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">Registration Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{formData?.teamRepName}</span>
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{formData?.category}</span>
                <span className="text-gray-600">Academy:</span>
                <span className="font-medium">{formData?.teamName}</span>
                <span className="text-gray-600">City:</span>
                <span className="font-medium">{formData?.city}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Payment Method</label>
              <div className="grid grid-cols-1 gap-3">
                {/* UPI */}
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'upi' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="upi" 
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="mr-3"
                    />
                    <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                    <span className="font-medium">UPI Payment</span>
                  </div>
                </div>

                {/* Card */}
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="card" 
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="mr-3"
                    />
                    <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                    <span className="font-medium">Credit/Debit Card</span>
                  </div>
                </div>

                {/* Net Banking */}
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'netbanking' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod('netbanking')}
                >
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="netbanking" 
                      checked={paymentMethod === 'netbanking'}
                      onChange={() => setPaymentMethod('netbanking')}
                      className="mr-3"
                    />
                    <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                    <span className="font-medium">Net Banking</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={goBackToForm}
                className="flex-1 flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Form
              </button>
              <button
                onClick={handlePayment}
                disabled={!paymentMethod || processingPayment}
                className="flex-1 flex items-center justify-center py-2 px-4 rounded-lg font-semibold text-white shadow-lg disabled:opacity-50"
                style={{ background: 'linear-gradient(to right, #1e3a8a, #1d4ed8)' }}
              >
                {processingPayment ? (
                  "Processing..."
                ) : (
                  <>
                    Pay ₹2,500
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Registration form (Step 1)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-48 h-48 rounded-full">
            <img src="pjc-logo-1.png" alt="logo" />
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold sm:font-bold text-gray-800 -mt-2">
            Pro Junior Championship Registration
          </h1>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">1</span>
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Registration Form</span>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-bold">2</span>
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Payment</span>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-bold">3</span>
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit(onFormSubmit)} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Title */}
              <div className="lg:col-span-2">
                <h3 className="text-xl font-bold sm:font-semibold text-gray-800 mb-2 sm:mb-4 text-center">
                  Pro Junior Championship 2025
                </h3>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <Input
                  type="text"
                  placeholder="Enter full name"
                  {...register("teamRepName", { required: "Full name is required" })}
                />
                {errors.teamRepName && <p className="text-red-500 text-sm">{errors.teamRepName.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email ID *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    className="pl-10"
                    placeholder="Enter email address"
                    {...register("emailId", {
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                    })}
                  />
                </div>
                {errors.emailId && <p className="text-red-500 text-sm">{errors.emailId.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone No *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="tel"
                    className="pl-10"
                    placeholder="Enter phone number"
                    {...register("phoneNo", {
                      required: "Phone number is required",
                      pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" }
                    })}
                  />
                </div>
                {errors.phoneNo && <p className="text-red-500 text-sm">{errors.phoneNo.message}</p>}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Select
                    value={watch("gender")}
                    onValueChange={(val) => setValue("gender", val, { shouldValidate: true })}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((gender) => (
                        <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.gender && <p className="text-red-500 text-sm">Gender is required</p>}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cities *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Select
                    value={watch("city")}
                    onValueChange={(val) => setValue("city", val, { shouldValidate: true })}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.city && <p className="text-red-500 text-sm">City is required</p>}
              </div>

              {/* DOB */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-400",
                        !dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateOfBirth ? format(dateOfBirth, "PPP") : "Pick your date of birth"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateOfBirth || undefined}
                      onSelect={handleDateChange}
                      disabled={(date) => date > new Date() || date < new Date("2000-01-01")}
                      fromYear={2000}
                      toYear={new Date().getFullYear()}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                {errors.dateOfBirth && <p className="text-red-500 text-sm">DOB is required</p>}
              </div>

              {/* Category */}
              {eligibleCategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Choose Category *</label>
                  <div className="relative">
                    <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Select
                      value={category}
                      onValueChange={(val) => setValue("category", val, { shouldValidate: true })}
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select your category" />
                      </SelectTrigger>
                      <SelectContent>
                        {eligibleCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.category && <p className="text-red-500 text-sm">Category is required</p>}
                </div>
              )}

              {/* Academy */}
              <div className="lg:col-span-2 mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-700" /> Academy Information
                </h3>
              </div>

              <div className='-mt-3'>
                <label className="block text-sm font-medium text-gray-700 mb-2">Academy Name *</label>
                <Input
                  type="text"
                  placeholder="Enter academy name"
                  {...register("teamName", { required: "Academy name is required" })}
                />
                {errors.teamName && <p className="text-red-500 text-sm">{errors.teamName.message}</p>}
              </div>

              <div className='sm:-mt-3'>
                <label className="block text-sm font-medium text-gray-700 mb-2">Academy Location *</label>
                <Input
                  type="text"
                  placeholder="Enter academy location"
                  {...register("academyLocation", { required: "Academy location is required" })}
                />
                {errors.academyLocation && <p className="text-red-500 text-sm">{errors.academyLocation.message}</p>}
              </div>

              {/* Coach */}
              <div className="lg:col-span-2 mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-700" /> Coach Information
                </h3>
              </div>

              <div className='-mt-3'>
                <label className="block text-sm font-medium text-gray-700 mb-2">Coach Name *</label>
                <Input
                  type="text"
                  placeholder="Enter coach name"
                  {...register("coachName", { required: "Coach name is required" })}
                />
                {errors.coachName && <p className="text-red-500 text-sm">{errors.coachName.message}</p>}
              </div>

              <div className='sm:-mt-3'>
                <label className="block text-sm font-medium text-gray-700 mb-2">Coach's Mobile Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="tel"
                    className="pl-10"
                    placeholder="Enter coach's mobile number"
                    {...register("coachMobile", {
                      required: "Coach mobile is required",
                      pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" }
                    })}
                  />
                </div>
                {errors.coachMobile && <p className="text-red-500 text-sm">{errors.coachMobile.message}</p>}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Coach's Email ID *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    className="pl-10"
                    placeholder="Enter coach's email address"
                    {...register("coachEmail", {
                      required: "Coach email is required",
                      pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                    })}
                  />
                </div>
                {errors.coachEmail && <p className="text-red-500 text-sm">{errors.coachEmail.message}</p>}
              </div>

              {/* Terms */}
              <div className="lg:col-span-2 mt-6">
                {/* Rules & Regulations */}
                <div className="flex items-start space-x-3 mb-3">
                  <input
                    id="rulesAccepted"
                    type="checkbox"
                    {...register("rulesAccepted", { required: "You must accept Rules & Regulations" })}
                    className="mt-1 w-4 h-4 sm:w-4 sm:h-4 text-gray-700 border-gray-300 rounded focus:ring-gray-500 cursor-pointer"
                  />
                  <span className="sm:text-base text-gray-700 leading-relaxed">
                    I have read and understood the{" "}
                    <span
                      className="text-gray-800 font-medium underline cursor-pointer"
                      onClick={() => openModal("rules")}
                    >
                      Rules & Regulations
                    </span>
                  </span>
                </div>
                {errors.rulesAccepted && (
                  <p className="text-red-500 text-sm -mt-2 mb-2">{errors.rulesAccepted.message}</p>
                )}

                {/* Terms & Conditions */}
                <div className="flex items-start space-x-3 mb-3">
                  <input
                    id="termsAccepted"
                    type="checkbox"
                    {...register("termsAccepted", { required: "You must accept Terms & Conditions" })}
                    className="mt-1 w-4 h-4 sm:w-4 sm:h-4 text-gray-700 border-gray-300 rounded focus:ring-gray-500 cursor-pointer"
                  />
                  <span className="sm:text-base text-gray-700 leading-relaxed">
                    I agree to the{" "}
                    <span
                      className="text-gray-800 font-medium underline cursor-pointer"
                      onClick={() => openModal("terms")}
                    >
                      Terms & Conditions
                    </span>
                  </span>
                </div>
                {errors.termsAccepted && (
                  <p className="text-red-500 text-sm -mt-2 mb-2">{errors.termsAccepted.message}</p>
                )}

                {/* Modal */}
                {modal.open && (
                  <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Overlay */}
                    <div
                      className="absolute inset-0 bg-black bg-opacity-50"
                      onClick={closeModal}
                    ></div>

                    {/* Modal Content */}
                    <div className="bg-white rounded-lg shadow-lg p-6 z-10 max-w-3xl w-full max-h-[85vh] flex flex-col">
                      <h2 className="text-lg font-semibold mb-4">
                        {modal.type === "rules" ? "Rules & Regulations" : "Terms & Conditions"}
                      </h2>
                      <div
                        className="overflow-y-auto pr-2"
                        style={{ maxHeight: "calc(90vh - 100px)" }}
                      >
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                          {modal.type === "rules" ? rulesText : termsText}
                        </p>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <button
                          className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                          onClick={closeModal}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Acknowledgement */}
                <div className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("agreeTerms", { required: "You must acknowledge the terms" })}
                    className="mt-1 w-4 h-4 sm:w-6 sm:h-6 text-blue-700 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="sm:text-base text-gray-700 leading-relaxed">
                    I hereby acknowledge that I have read and agree to all tournament guidelines, rules,
                    and regulations. The information I have provided above is true and accurate to the
                    best of my knowledge.
                  </span>
                </div>
                {errors.agreeTerms && (
                  <p className="text-red-500 text-sm -mt-2 mb-2">{errors.agreeTerms.message}</p>
                )}
              </div>

              {/* Payment Notice */}
              <div className="lg:col-span-2 mt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-800">Registration Fee: ₹2,500</span>
                  </div>
                  <p className="text-blue-700 text-sm mt-1">
                    Complete payment after submitting the form to finalize your registration.
                  </p>
                </div>
              </div>

              {/* Submit */}
              <div className="lg:col-span-2 mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || (dateOfBirth && eligibleCategories.length === 0)}
                  className="w-full text-white py-2 px-8 rounded-lg font-semibold text-lg shadow-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(to right, #1e3a8a, #1d4ed8)' }}
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : (
                    <>
                      Continue to Payment
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}