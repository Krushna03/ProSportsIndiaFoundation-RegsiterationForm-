import React, { useState } from 'react';
import { Upload, Users, Mail, Phone, MapPin, Trophy, User, Building, CheckCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

function Registeration() {

  const [formData, setFormData] = useState({
    teamRepName: '',
    emailId: '',
    phoneNo: '',
    gender: '',
    city: '',
    category: '',
    teamName: '',
    academyName: '',
    coachName: '',
    coachMobile: '',
    coachEmail: '',
    paymentFile: null,
    agreeTerms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const cities = ['Mumbai', 'Bangalore', 'Pune', 'Gurgao', 'Jaipur', 'Jalandar'];
  const genders = ["Male", "Female"];
  const categories = [
    'MK CATEGORY UNDER 9',
    'MK CATEGORY UNDER 11',
    'MK CATEGORY UNDER 13',
    'MK CATEGORY UNDER 15',
    'MK CATEGORY UNDER 17',
    'MK CATEGORY UNDER 19'
  ];

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = e.target.checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, paymentFile: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Reset after showing success
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        teamRepName: '',
        emailId: '',
        phoneNo: '',
        gender: '',
        city: '',
        category: '',
        teamName: '',
        academyName: '',
        coachName: '',
        coachMobile: '',
        coachEmail: '',
        paymentFile: null,
        agreeTerms: false
      });
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-blue-700" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
          <p className="text-gray-600">Your team registration has been submitted successfully. You will receive a confirmation email shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-40 h-40 rounded-full">
            <img src="pjc-logo-1.png" alt="logo" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Pro Junior Championship Registration
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Title */}
              <div className="lg:col-span-2">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  Pro Junior Championship 2025
                </h3>
              </div>

              {/* Full Name */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <Input
                  type="text"
                  name="teamRepName"
                  value={formData.teamRepName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter full name"
                />
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
                    name="emailId"
                    value={formData.emailId}
                    onChange={handleInputChange}
                    required
                    className="pl-10"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              {/* Phone No */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone No *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="tel"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleInputChange}
                    required
                    className="pl-10"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      handleInputChange({ target: { name: "gender", value } })
                    }
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Cities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cities *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Select
                    value={formData.city}
                    onValueChange={(value) =>
                      handleInputChange({ target: { name: "city", value } })
                    }
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Category */}
              <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Choose Category *
  </label>
  <div className="relative">
    <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    <Select
      value={formData.category}
      onValueChange={(value) =>
        handleInputChange({ target: { name: "category", value } })
      }
    >
      <SelectTrigger className="pl-10">
        <SelectValue placeholder="Select Category" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
</div>


              {/* Team Info */}
              <div className="lg:col-span-2 mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-700" /> Team Information
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name *
                </label>
                <Input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter team name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team's Academy / Club Name *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    name="academyName"
                    value={formData.academyName}
                    onChange={handleInputChange}
                    required
                    className="pl-10"
                    placeholder="Enter academy or club name"
                  />
                </div>
              </div>

              {/* Coach Info */}
              <div className="lg:col-span-2 mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-700" /> Coach Information
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coach Name *
                </label>
                <Input
                  type="text"
                  name="coachName"
                  value={formData.coachName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter coach name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coach's Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="tel"
                    name="coachMobile"
                    value={formData.coachMobile}
                    onChange={handleInputChange}
                    required
                    className="pl-10"
                    placeholder="Enter coach's mobile number"
                  />
                </div>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coach's Email ID *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    name="coachEmail"
                    value={formData.coachEmail}
                    onChange={handleInputChange}
                    required
                    className="pl-10"
                    placeholder="Enter coach's email address"
                  />
                </div>
              </div>

              {/* Upload File */}
              <div className="lg:col-span-2 mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File *
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Kindly attach a successful payment screenshot to confirm your registration.
                </p>
                <div className="relative">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      required
                      className="opacity-0 absolute inset-0 cursor-pointer"
                    />
                    {formData.paymentFile ? (
                      <p className="text-blue-700 font-medium">{formData.paymentFile.name}</p>
                    ) : (
                      <p className="text-gray-600">
                        Click to upload or drag and drop<br />
                        <span className="text-sm text-gray-500">PNG, JPG, PDF up to 10MB</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="lg:col-span-2 mt-6">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-4 h-4 text-blue-700 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    I hereby acknowledge that I have read and agree to all tournament guidelines, rules, and regulations. 
                    The information I have provided above is true and accurate to the best of my knowledge.
                  </span>
                </label>
              </div>

              {/* Submit */}
              <div className="lg:col-span-2 mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white py-4 px-8 rounded-lg font-semibold text-lg shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{
                    background: 'linear-gradient(to right, #1e3a8a, #1d4ed8)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.background = 'linear-gradient(to right, #1e40af, #2563eb)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.background = 'linear-gradient(to right, #1e3a8a, #1d4ed8)';
                    }
                  }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Registration'
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

export default Registeration;
