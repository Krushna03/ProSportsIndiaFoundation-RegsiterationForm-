import React, { useState } from 'react';
import { Users, Mail, Phone, MapPin, Trophy, User, CheckCircle, Calendar, CalendarIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calender } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Updated category eligibility based on PJC 2025 requirements
const categoryEligibility = [
  { label: "Under 11 (U11)", cutoff: new Date("2015-01-01") },
  { label: "Under 13 (U13)", cutoff: new Date("2013-01-01") },
  { label: "Under 15 (U15)", cutoff: new Date("2011-01-01") },
  { label: "Under 17 (U17)", cutoff: new Date("2009-01-01") },
];

export default function Registeration() {
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    teamRepName: '',
    emailId: '',
    phoneNo: '',
    gender: '',
    city: '',
    category: '',
    teamName: '',
    academyLocation: '',
    coachName: '',
    coachMobile: '',
    coachEmail: '',
    paymentFile: null,
    agreeTerms: false,
    rulesAccepted: false,
    termsAccepted: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [modal, setModal] = useState({ open: false, type: null });
  const [eligibleCategories, setEligibleCategories] = useState([]);

  const checkEligibility = (dob) => {
    if (!dob) return [];
    
    return categoryEligibility
      .filter(cat => dob >= cat.cutoff)
      .map(cat => cat.label);
  };

  const handleDateChange = (date) => {
    setDateOfBirth(date);
    setIsCalendarOpen(false);
    
    if (date) {
      const categories = checkEligibility(date);
      setEligibleCategories(categories);
      
      // Reset category if it's not in the eligible list
      setFormData(prev => ({
        ...prev,
        category: categories.includes(prev.category) ? prev.category : ""
      }));
    } else {
      setEligibleCategories([]);
      setFormData(prev => ({ ...prev, category: "" }));
    }
  };

  const openModal = (type) => {
    setModal({ open: true, type });
  };

  const closeModal = () => {
    setModal({ open: false, type: null });
  };

  const cities = ['Mumbai', 'Bangalore', 'Pune', 'Gurgao', 'Jaipur', 'Jalandar'];
  const genders = ["Male", "Female"];

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
        academyLocation: '',
        coachName: '',
        coachMobile: '',
        coachEmail: '',
        paymentFile: null,
        agreeTerms: false,
        rulesAccepted: false,
        termsAccepted: false
      });
      setDateOfBirth(null);
      setEligibleCategories([]);
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

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
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

              {/* DOB with Calendar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateOfBirth ? format(dateOfBirth, "PPP") : "Pick your date of birth"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calender
                      mode="single"
                      selected={dateOfBirth}
                      onSelect={handleDateChange}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      captionLayout="dropdown-buttons"
                      fromYear={2000}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Category Dropdown - Only show when eligible categories exist */}
              {eligibleCategories.length > 0 && (
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
                        <SelectValue placeholder="Select your category" />
                      </SelectTrigger>
                      <SelectContent>
                        {eligibleCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Academy Info */}
              <div className="lg:col-span-2 mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-700" /> Academy Information
                </h3>
              </div>

              <div className='-mt-3'>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academy Name *
                </label>
                <Input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter academy name"
                />
              </div>

              <div className='sm:-mt-3'>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academy Location *
                </label>
                <Input
                  type="text"
                  name="academyLocation"
                  value={formData.academyLocation}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter academy location"
                />
              </div>

              {/* Coach Info */}
              <div className="lg:col-span-2 mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-700" /> Coach Information
                </h3>
              </div>

              <div className='-mt-3'>
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

              <div className='sm:-mt-3'>
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

              {/* Terms */}
              <div className="lg:col-span-2 mt-6">
                {/* Rules & Regulations */}
                <div className="flex items-start space-x-3 mb-3">
                    <input
                    id="rulesAccepted"
                    type="checkbox"
                    name="rulesAccepted"
                    checked={formData.rulesAccepted}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-4 h-4 sm:w-4 sm:h-4 text-gray-700 border-gray-300 rounded focus:ring-gray-500"
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

                {/* Terms & Conditions */}
                <div className="flex items-start space-x-3 mb-3">
                  <input
                    id="termsAccepted"
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-4 h-4 sm:w-4 sm:h-4 text-gray-700 border-gray-300 rounded focus:ring-gray-500"
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
                      <div className="overflow-y-auto pr-2" style={{ maxHeight: "calc(90vh - 100px)" }}>
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
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-4 h-4 sm:w-6 sm:h-6 text-blue-700 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="sm:text-base text-gray-700 leading-relaxed">
                    I hereby acknowledge that I have read and agree to all tournament guidelines, rules, and regulations. The information I have provided above is true and accurate to the best of my knowledge.
                  </span>
                </div>
              </div>

              {/* Submit */}
              <div className="lg:col-span-2 mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || (dateOfBirth && eligibleCategories.length === 0)}
                  className="w-full text-white py-3 px-8 rounded-lg font-semibold text-lg shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{
                    background: 'linear-gradient(to right, #1e3a8a, #1d4ed8)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting && !(dateOfBirth && eligibleCategories.length === 0)) {
                      e.currentTarget.style.background = 'linear-gradient(to right, #1e40af, #2563eb)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting && !(dateOfBirth && eligibleCategories.length === 0)) {
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

const rulesText = `
Player Count:

Under 9: Mixed Categories. Matches will have 6 players per team with 3 rolling substitutes.
Boys U 11, U 13, U 15 & U 17: Matches will have 6 players per team with 3 rolling substitutes.
Girls U13, U15 & U17: Matches will have 6 players per team with 3 rolling substitutes.
Substitute: Substitutes must be listed before the match. They can only enter from the halfway line with the referee's approval after the substituted player exits the field.
Player Equipment: All players must wear appropriate football attire; including jerseys, shorts, shin guards (fully covered by socks), socks, and cleats. Players without proper equipment will not be permitted to play.
Referee Authority: The referee's decisions are final. Any form of dissent towards the referee's decisions may lead to further disciplinary actions; including carding or match suspension.
Assistant Referees: Assistant referees will support the main referee in decision-making and ensuring fair play during matches.
Match Duration:

Under 9: Each match will be 13 minutes in total, split into two halves of 6 minutes with a 1-minute break.
Under 11, Under 13, Under 15, Under 17 (Boys & Girls): Each match will last 18 minutes in total, with two halves of 8 minutes and a 2-minute halftime break.
Knockout Matches (Quarterfinals, Semifinals, and Finals): Each knockout match will last 30 minutes in total, with two halves of 10 minutes and a 5-minute break.
Kickoff and Play Restart: The team that wins the coin toss can either choose possession or the side they want to defend. Kickoff will occur from the halfway line at the beginning of each half and after a goal is scored.
Ball In and Out of Play: The ball is out of play when it crosses the goal or touchlines or when the referee stops play.
Scoring: A goal is counted when the entire ball crosses the goal line. The team with the most goals at the end of the match will be declared the winner.
No Offside Rule: There will be no offside rule enforced during the matches.
Kick-ins: Throw-ins will be replaced by kick-ins from the touchline.
Goalkeeper Restrictions: Goalkeepers are not allowed to take the volleys.
Free Kicks: Both direct and indirect free kicks are allowed at the referee's discretion.
Fouls and Misconduct:

Yellow Card: A yellow card results in the player being sidelined for 2 minutes.
Red Card: A red card results in the player being sent off for the remainder of the match and suspended for the next game.
Walkover Rule: If a team does not show up for a match, a 15-minute grace period will be allowed. After this time, the opposing team will be awarded a 3-0 walkover.
Fair Play and Conduct: All participants are expected to uphold the values of sportsmanship, respect, and fair play at all times. Referees and officials will ensure smooth conduct, and their decisions are final.
Tournament Structure Adjustments: If a category has fewer than 8 teams, the organizing committee reserves the right to disqualify the category or alter the tournament structure, such as changing the format or merging age groups. Teams in canceled categories will have the option to upgrade to a higher eligible category or receive a refund.
`;

const termsText = `
Eligibility Criteria:

Under 9: Born on or after January 1, 2016.
Under 11: Born on or after January 1, 2014.
Under 13: Born on or after January 1, 2012.
Under 15: Born on or after January 1, 2010.
Under 17: Born on or after January 1, 2008.
Identity Verification: Players must provide an Aadhar Card and Birth Certificate for age verification. Any attempt at age fraud will result in immediate disqualification and penalties for both the player and the team.
Registration & Entry Fees: Teams must complete registration before participation. All entry fees are non-refundable once payment is made, regardless of circumstances, including player injuries, team withdrawals, or cancellations due to unforeseen events.
Objection to Player Eligibility: Coaches or managers wishing to challenge a player's eligibility must submit an objection fee of ₹5000. If the objection is upheld, the fee will be refunded.
Liability for Personal Belongings and Injuries: The organizing committee is not responsible for the loss of personal belongings (e.g., jewelry, accessories). Additionally, the committee is not liable for injuries sustained during the tournament. While on-site medical support will be provided, any hospitalization or extended care costs will be a complete responsibility of the player.
Code of Conduct: All participants (players, coaches, and spectators) must maintain sportsmanlike behavior throughout the tournament. Any form of misconduct, such as verbal abuse or physical altercations, will lead to disciplinary action, including suspension or disqualification.
Media Consent: By participating in the tournament, players and their guardians consent to the use of photographs, videos, and other media for promotional purposes by the organizing committee.
Authority to Amend Rules: The organizing committee reserves the right to amend or update any rules, regulations, or terms at any time. Participants will be notified promptly of any changes.
Cancellation of Categories: If fewer than 8 teams register in a category, the organizing committee may cancel the category. In this case, participants can either upgrade to a higher category if eligible; or request for a refund.

Additional Terms & Conditions

Natural Calamities and Force Majeure
In the event of unforeseen circumstances such as extreme weather, natural disasters, health emergencies, government restrictions, strikes, or civil disturbances; the organizing committee reserves the right to reschedule, postpone or cancel the affected matches or the tournament as a whole.
In case of cancellation due to such events, registration fees may be refunded partially or fully at the committee's discretion, based on incurred costs. Refund policies related to these situations will be communicated promptly to the registered teams.

Match Delays and Rescheduling
Matches may be delayed or rescheduled due to uncontrollable circumstances, such as adverse weather, unsafe field conditions, technical issues, or government restrictions.
Teams are expected to cooperate with any rescheduling adjustments; non-participation due to rescheduling will be considered a forfeit.
If a delay exceeds one hour, the match may be postponed to a different date, subject to the organizing committee's approval and field availability.`