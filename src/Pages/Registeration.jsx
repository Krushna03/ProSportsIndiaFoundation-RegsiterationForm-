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
import { toast } from 'sonner';
import { cities, genders } from '../constants/formConstants';
import { rulesText, termsText } from "../constants/rulesAndTerms"
import { Checkbox } from "@/components/ui/checkbox"
import { useNavigate } from 'react-router-dom';

export default function Registration() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [modal, setModal] = useState({ open: false, type: null });
  const [step, setStep] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [formData, setFormData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [registrationId, setRegistrationId] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(1000);
  const url = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      category: [] 
    }
  });

  const dateOfBirth = watch("dateOfBirth");
  const category = watch("category");

  const checkEligibilityExplicit = (dob) => {
    if (!dob) return [];
    
    const eligible = [];
    
    // Born 2015 or later -> U11 only
    if (dob >= new Date("2015-01-01")) {
      eligible.push("Under 11 (U11)", "Under 13 (U13)");
    }
    // Born 2013-2014 -> U11 and U13
    else if (dob >= new Date("2013-01-01")) {
      eligible.push("Under 13 (U13)", "Under 15 (U15)");
    }
    // Born 2011-2012 -> U15 and U17
    else if (dob >= new Date("2011-01-01")) {
      eligible.push("Under 15 (U15)", "Under 17 (U17)");
    } 
    // Born 2009-2010 -> U17
    else if (dob >= new Date("2009-01-01")) {
      eligible.push("Under 17 (U17)");
    }
    
    return eligible;
  };

  const eligibleCategories = checkEligibilityExplicit(dateOfBirth);

  const openModal = (type) => setModal({ open: true, type });
  const closeModal = () => setModal({ open: false, type: null });

  // Step 1: Form submission with API call
  const onFormSubmit = async (data) => {
    if (!data.dateOfBirth) {
      toast.error("Please select date of birth.");
      return;
    }
    if (!data.category || data.category.length === 0) {
      toast.error("Please select at least one category.");
      return;
    }
    const invalidCategories = data.category.filter(cat => !eligibleCategories.includes(cat));
    if (invalidCategories.length > 0) {
      toast.error("Please select only eligible categories.");
      return;
    }
    if (!data.gender) {
      toast.error("Please select gender.");
      return;
    }
    if (!data.city) {
      toast.error("Please select city.");
      return;
    }
    
    setApiError(null);
    
    try {
      const response = await fetch(`${url}/api/registration/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          dateOfBirth: data.dateOfBirth.toISOString(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Success - store the registration ID and form data
        setRegistrationId(result.registrationId);
        setFormData(data);
        setPaymentAmount(result.data.paymentAmount);
        setStep(2);
        toast.success("Registration details saved successfully!");
      } else {
        // Handle API errors
        setApiError(result.message || 'Registration failed');
        toast.error(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error("Registration API error:", error);
      setApiError('Network error. Please check your connection and try again.');
      toast.error('Network error. Please check your connection and try again.');
    }
  };

  // Step 2: Payment processing
  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setProcessingPayment(true);
    
    try {
      // Create Razorpay order
      const orderResponse = await fetch(`${url}/api/payment/create-order`, {
        method: 'POST',
        headers: {  
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationId: registrationId,
          amount: paymentAmount, 
          paymentMethod: paymentMethod
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

      // Initialize Razorpay payment
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Pro Junior Championship',
        description: 'Registration Fee',
        order_id: orderData.id,
        handler: async function (response) {
          await verifyPayment(response);
        },
        prefill: {
          name: formData?.teamRepName,
          email: formData?.emailId,
          contact: formData?.phoneNo
        },
        theme: {
          color: '#1e3a8a'
        },
        modal: {
          ondismiss: function() {
            setProcessingPayment(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment failed. Please try again.");
      setProcessingPayment(false);
    }
  };

  // Verify payment on backend
  const verifyPayment = async (paymentResponse) => {
    try {
      const response = await fetch(`${url}/api/payment/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationId: registrationId,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setPaymentStatus(true);
        setStep(3);
        setSubmitted(true);
        toast.success("Payment successful! Registration completed.");
      } else {
        throw new Error(result.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      toast.error(error.message || "Payment verification failed. Please contact support.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const goBackToForm = () => {
    setStep(1);
    setPaymentMethod('');
    setPaymentStatus(false);
    setApiError(null);
  };

  const handleNavigate = () => {
    navigate(0);
  }

  // Retry registration
  const retryRegistration = () => {
    setApiError(null);
    // User can try submitting the form again
  };

  // Success page
  if (submitted && paymentStatus) {
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
            <p className="text-green-600 text-sm">Registration ID: {registrationId}</p>
          </div>
          <div onClick={handleNavigate} className='mt-5 p-2 bg-blue-600 text-white font-semibold rounded-lg cursor-pointer'>
            Go Back
          </div>
        </div>
      </div>
    );
  }

  // Payment step
  if (step === 2 && registrationId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-48 h-48 rounded-full">
              <img src="pjc-logo-1.png" alt="logo" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 -mt-2">
              Payment Details
            </h1>
          </div>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2 sm:space-x-4">
              <div className="flex items-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-green-600">Registration</span>
              </div>
              <div className="w-16 h-1 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs sm:textr-sm font-bold">2</span>
                </div>
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-blue-600">Payment</span>
              </div>
              <div className="w-16 h-1 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-xs sm:textr-sm font-bold">3</span>
                </div>
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-gray-500">Confirmation</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8">
            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Complete Your Payment</h3>
              <p className="text-gray-600">Registration Fee: ₹{paymentAmount.toLocaleString()}</p>
              <p className="text-sm text-blue-600 mt-1">
              {formData?.category?.length} categor{formData?.category?.length > 1 ? 'ies' : 'y'} × ₹1,000 = ₹{paymentAmount.toLocaleString()}
            </p>
              <p className="text-sm text-green-600 mt-1">Registration ID: {registrationId}</p>
            </div>

            {/* Registration Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 sm:mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">Registration Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{formData?.teamRepName}</span>
                <span className="text-gray-600">Categories:</span>
                <span className="font-medium">{formData?.category?.join(", ")}</span>
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
                  className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
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
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" />
                    <span className="text-sm sm:text-base font-medium">UPI Payment</span>
                  </div>
                </div>

                {/* Card */}
                <div 
                  className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
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
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" />
                    <span className="text-sm sm:text-base font-medium">Credit/Debit Card</span>
                  </div>
                </div>

                {/* Net Banking */}
                <div 
                  className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
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
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" />
                    <span className="text-sm sm:text-base font-medium">Net Banking</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={goBackToForm}
                disabled={processingPayment}
                className="flex-1 flex items-center justify-center py-2 px-2 sm:px-4 border border-gray-300 rounded-lg text-sm sm:text-base font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Form
              </button>
              <button
                onClick={handlePayment}
                disabled={!paymentMethod || processingPayment}
                className="flex-1 flex items-center justify-center py-2 px-2 sm:px-4 rounded-lg font-semibold text-white text-sm sm:text-base shadow-lg disabled:opacity-50"
                style={{ background: 'linear-gradient(to right, #1e3a8a, #1d4ed8)' }}
              >
                {processingPayment ? (
                  "Processing..."
                ) : (
                  <>
                    Pay ₹{paymentAmount.toLocaleString()}
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
          <div className="flex items-center justify-center space-x-2 sm:space-x-4">
            <div className="flex items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs sm:text-sm font-bold">1</span>
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-blue-600">Registration</span>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-xs sm:text-sm font-bold">2</span>
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-gray-500">Payment</span>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-xs sm:text-sm font-bold">3</span>
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-gray-500">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {apiError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 text-red-500 mr-2">⚠</div>
                <span className="text-red-800 font-medium">{apiError}</span>
              </div>
              <button
                onClick={retryRegistration}
                className="text-red-600 hover:text-red-800 text-sm font-medium underline"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit(onFormSubmit)} className="p-4 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Title */}
              <div className="lg:col-span-2">
                <h3 className="text-xl font-bold sm:font-semibold text-gray-800 mb-2 mt-4 sm:mt-0 sm:mb-4 text-center">
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
                {errors.teamRepName && <p className="text-red-500 mt-1 ml-1 text-sm">{errors.teamRepName.message}</p>}
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
                {errors.emailId && <p className="text-red-500 mt-1 ml-1 text-sm">{errors.emailId.message}</p>}
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
                {errors.phoneNo && <p className="text-red-500 mt-1 ml-1 text-sm">{errors.phoneNo.message}</p>}
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
                      selected={watch("dateOfBirth") || undefined}
                      onSelect={(date) => {
                        if (date) {
                          setValue("dateOfBirth", date, { shouldValidate: true })
                        }
                      }}
                      onMonthChange={(month) => {
                        setValue("dateOfBirth", month, { shouldValidate: true })
                      }}
                      onYearChange={(year) => {
                        setValue("dateOfBirth", year, { shouldValidate: true })
                      }}
                      disabled={(date) => date > new Date() || date < new Date("2009-01-01")}
                      fromYear={2009}
                      toYear={2017}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                {errors.dateOfBirth && <p className="text-red-500 text-sm">DOB is required</p>}
              </div>

              {/* Category */}
              {eligibleCategories.length > 0 && (
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Choose Categories *
                  </label>
                  <div className="space-y-3">
                    {eligibleCategories.map((cat) => (
                      <div key={cat} className="flex items-center space-x-3">
                        <Checkbox
                          id={cat}
                          checked={category?.includes(cat) || false}
                          onCheckedChange={(checked) => {
                            const currentCategories = category || [];
                            if (checked) {
                              setValue("category", [...currentCategories, cat], { shouldValidate: true });
                            } else {
                              setValue(
                                "category",
                                currentCategories.filter((c) => c !== cat),
                                { shouldValidate: true }
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={cat}
                          className="text-sm text-gray-700 cursor-pointer"
                        >
                          {cat}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.category && (
                    <p className="text-red-500 text-sm">At least one category is required</p>
                  )}
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
                {errors.teamName && <p className="text-red-500 mt-1 ml-1 text-sm">{errors.teamName.message}</p>}
              </div>

              <div className='sm:-mt-3'>
                <label className="block text-sm font-medium text-gray-700 mb-2">Academy Location *</label>
                <Input
                  type="text"
                  placeholder="Enter academy location"
                  {...register("academyLocation", { required: "Academy location is required" })}
                />
                {errors.academyLocation && <p className="text-red-500 mt-1 ml-1 text-sm">{errors.academyLocation.message}</p>}
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
                {errors.coachName && <p className="text-red-500 mt-1 ml-1 text-sm">{errors.coachName.message}</p>}
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
                {errors.coachMobile && <p className="text-red-500 mt-1 ml-1 text-sm">{errors.coachMobile.message}</p>}
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
                {errors.coachEmail && <p className="text-red-500 mt-1 ml-1 text-sm">{errors.coachEmail.message}</p>}
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
                  <p className="text-red-500 text-sm -mt-2 ml-7 mb-2">{errors.rulesAccepted.message}</p>
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
                  <p className="text-red-500 text-sm ml-7 -mt-2 mb-2">{errors.termsAccepted.message}</p>
                )}

                {/* Modal */}
                {modal.open && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 px-4 md:px-0">
                    {/* Overlay */}
                    <div
                      className="absolute inset-0 bg-black bg-opacity-50"
                      onClick={closeModal}
                    ></div>

                    {/* Modal Content */}
                    <div className="bg-white rounded-lg shadow-lg p-5 sm:p-6 z-10 max-w-3xl w-full max-h-[85vh] flex flex-col">
                      <h2 className="text-lg font-semibold mb-3 sm:mb-4">
                        {modal.type === "rules" ? "Rules & Regulations" : "Terms & Conditions"}
                      </h2>
                      <div
                        className="overflow-y-auto pr-2"
                        style={{ maxHeight: "calc(90vh - 100px)" }}
                      >
                        <p className="text-base text-gray-800 leading-relaxed whitespace-pre-line">
                          {modal.type === "rules" ? rulesText : termsText}
                        </p>
                      </div>
                      <div className="mt-3 sm:mt-6 flex justify-end">
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
                    className="mt-1 w-4 h-4 sm:w-7 sm:h-7 text-blue-700 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="sm:text-base text-gray-700 leading-relaxed">
                    I hereby acknowledge that I have read and agree to all tournament guidelines, rules,
                    and regulations. The information I have provided above is true and accurate to the
                    best of my knowledge.
                  </span>
                </div>
                {errors.agreeTerms && (
                  <p className="text-red-500 text-sm ml-7 mt-1 mb-2">{errors.agreeTerms.message}</p>
                )}
              </div>

              {/* Payment Notice */}
              <div className="lg:col-span-2 sm:mt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-800">Registration Fee: ₹1,000 per category</span>
                  </div>
                  <p className="text-blue-700 text-sm mt-1">
                    Complete payment after submitting the form to finalize your registration.
                  </p>
                </div>
              </div>  

              {/* Submit */}
              <div className="lg:col-span-2 mb-3 sm:mb-0 sm:mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || (dateOfBirth && eligibleCategories.length === 0)}
                  className="w-full text-white py-2 px-8 rounded-lg font-semibold text-lg shadow-lg flex items-center justify-center disabled:opacity-50"
                  style={{ background: 'linear-gradient(to right, #1e3a8a, #1d4ed8)' }}
                >
                  {isSubmitting ? (
                    "Saving Registration..."
                  ) : (
                    <>
                      Save & Continue to Payment
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