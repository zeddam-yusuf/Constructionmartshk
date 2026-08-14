import React, { useState } from 'react';
import { saveSubmission } from '../services/supabase';
import { useProfile, ProfilePrompt } from '../services/profile';
import jobSymbolImg from '../src/assets/images/job_symbol_1785094488725.jpg';
import { 
  User, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Phone, 
  Mail, 
  Edit2, 
  Save, 
  XCircle,
  Award,
  GraduationCap,
  Calendar,
  CheckCircle,
  FileText,
  TrendingUp,
  Link2
} from 'lucide-react';

export function JobProfile() {
  const { user, saveProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [specialty, setSpecialty] = useState('');
  const [experience, setExperience] = useState(user?.experience || '');
  const [location, setLocation] = useState(user?.city || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [expectedSalary, setExpectedSalary] = useState(user?.charges || '');
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState('');
  const [bio, setBio] = useState('');
  const [availability, setAvailability] = useState('');

  const [tempData, setTempData] = useState<any>(null);

  const startEdit = () => {
    setTempData({
      name,
      specialty,
      experience,
      location,
      phone,
      email,
      expectedSalary,
      education,
      skills,
      bio,
      availability
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    if (tempData) {
      setName(tempData.name);
      setSpecialty(tempData.specialty);
      setExperience(tempData.experience);
      setLocation(tempData.location);
      setPhone(tempData.phone);
      setEmail(tempData.email);
      setExpectedSalary(tempData.expectedSalary);
      setEducation(tempData.education);
      setSkills(tempData.skills);
      setBio(tempData.bio);
      setAvailability(tempData.availability);
    }
    setIsEditing(false);
  };

  const saveEdit = async () => {
    setIsEditing(false);
    await saveProfile({ name, phone, email, city: location, experience, charges: expectedSalary, category: user?.category || 'Civil Engineer', gstNumber: user?.gstNumber });
    const updatedProfile = {
      id: `job-profile-rahul`,
      fullName: name,
      email: email,
      mobile: phone,
      role: 'JOB',
      category: 'Civil Engineer',
      specialty: specialty,
      experience: experience,
      city: location,
      bio: bio,
      charges: expectedSalary,
      education: education,
      skills: skills,
      availability: availability,
      status: 'Updated Profile',
      updated_at: new Date().toISOString()
    };
    await saveSubmission('registration', updatedProfile);
    alert('🎉 Job Seeker profile changes saved and synchronized live with Supabase!');
  };

  return (
    <div id="job-profile-container" className="space-y-6">
      <ProfilePrompt
        name={name}
        phone={phone}
        city={location}
        company={user?.companyName}
        email={email}
        onEdit={() => { startEdit(); }}
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Professional Job Seeker Profile</h2>
          <p className="text-xs text-gray-500 mt-1">Configure your recruitment profile, site experience, expectations, and skills.</p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={cancelEdit}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <XCircle size={14} /> Cancel
              </button>
              <button 
                onClick={saveEdit}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors shadow-sm shadow-orange-100"
              >
                <Save size={14} /> Save Profile
              </button>
            </>
          ) : (
            <button 
              onClick={startEdit}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors shadow-sm shadow-orange-100"
            >
              <Edit2 size={14} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card View */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-orange-400 bg-orange-950/80 border border-orange-500/20 px-2.5 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                <Briefcase size={10} /> Certified Professional
              </span>
              <span className="bg-green-950 text-green-400 border border-green-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Active Search
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500/50 shadow-md shrink-0">
                <img src={jobSymbolImg} alt="Job Seeker Symbol" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-lg font-bold">{name}</h4>
                <p className="text-xs text-slate-400 font-medium">{specialty}</p>
              </div>
            </div>

            {/* Compensation & Experience Details */}
            <div className="mt-6 p-4 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-xs text-slate-400 flex items-center gap-1"><DollarSign size={13} className="text-orange-500" /> Expected Pay:</span>
                <span className="text-xs font-black text-white">{expectedSalary}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar size={13} className="text-orange-500" /> Availability:</span>
                <span className="text-xs font-black text-orange-400">{availability}</span>
              </div>
            </div>

            <div className="mt-5 space-y-2.5 pt-1">
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400"><Award size={12} className="text-orange-500" /> Experience:</span>
                <span className="font-bold text-white">{experience}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400"><GraduationCap size={12} className="text-orange-500" /> Credentials:</span>
                <span className="font-bold truncate max-w-[140px]" title={education}>{education}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400"><MapPin size={12} className="text-orange-500" /> Target Area:</span>
                <span className="font-bold">{location}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 mt-6 space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Phone size={13} className="text-orange-500" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300 overflow-hidden text-ellipsis">
              <Mail size={13} className="text-orange-500" />
              <span className="truncate">{email}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Detail Editor / Viewer */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-6">
          {isEditing ? (
            /* Editing State Form */
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 text-sm pb-2 border-b border-gray-100">Configure Professional CV parameters</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Professional Specialty / Role</label>
                  <input 
                    type="text" 
                    value={specialty} 
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Years of Experience</label>
                  <input 
                    type="text" 
                    value={experience} 
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Work Location</label>
                  <input 
                    type="text" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Expected Fee / Salary</label>
                  <input 
                    type="text" 
                    value={expectedSalary} 
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Availability Status</label>
                  <input 
                    type="text" 
                    value={availability} 
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Education / Certification</label>
                  <input 
                    type="text" 
                    value={education} 
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Core Skills (Comma separated)</label>
                  <input 
                    type="text" 
                    value={skills} 
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Professional bio / Past project highlights</label>
                <textarea 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:outline-none resize-none"
                />
              </div>
            </div>
          ) : (
            /* Viewer State details */
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-800 text-sm pb-2 border-b border-gray-100 flex items-center gap-2">
                  <FileText size={16} className="text-orange-500" />
                  Professional Profile Summary
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-2.5">{bio}</p>
              </div>

              {/* Skills Tags */}
              <div>
                <h4 className="text-xs font-bold text-gray-800 mb-2">Technical Skills & Areas of Expertise</h4>
                <div className="flex flex-wrap gap-1.5">
                  {skills.split(',').map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-orange-50 text-orange-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-orange-100"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Background Verification & Training */}
              <div className="bg-orange-50/40 p-4 rounded-xl border border-orange-100 flex items-start gap-3">
                <Award size={20} className="text-orange-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
                    ConSmart Verified Resume Badge
                    <span className="bg-green-600 text-white text-[8px] font-bold px-1.5 py-0.2 rounded uppercase">Verified</span>
                  </h4>
                  <p className="text-[11px] text-orange-900 leading-relaxed">
                    Identity, qualification certificates, and background references have been vetted by ConSmart placements. This candidate is qualified to lead high-volume site operations directly.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5"><GraduationCap size={14} className="text-orange-500" /> Highest Qualification</h4>
                  <p className="text-xs text-gray-500">{education}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5"><Link2 size={14} className="text-orange-500" /> Contact Recommendation</h4>
                  <p className="text-xs text-gray-500">
                    Direct hiring can be initiated via messaging. High suitability rating verified by past civil contractors.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
