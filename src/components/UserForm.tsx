import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, GraduationCap, Briefcase, KeyRound, Target, ArrowRight } from 'lucide-react';
import { Submission } from '../types';

interface UserFormProps {
  onSubmit: (formData: Omit<Submission, 'id' | 'recommendation' | 'reason' | 'created_at'>) => void;
  isSubmitting: boolean;
}

export default function UserForm({ onSubmit, isSubmitting }: UserFormProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    qualification: '' as any,
    experience: '',
    profession: '',
    career_goal: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.qualification) {
      newErrors.qualification = 'Please select your highest qualification';
    }

    if (formData.experience === '') {
      newErrors.experience = 'Years of experience is required';
    } else {
      const expNum = Number(formData.experience);
      if (isNaN(expNum) || expNum < 0 || expNum > 80 || !Number.isInteger(expNum)) {
        newErrors.experience = 'Experience must be a whole number between 0 and 80';
      }
    }

    if (!formData.profession.trim()) {
      newErrors.profession = 'Current profession or status is required';
    }

    if (!formData.career_goal.trim()) {
      newErrors.career_goal = 'Career goal or aspiration is required';
    } else if (formData.career_goal.trim().length < 10) {
      newErrors.career_goal = 'Please write a specific goal (at least 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && !isSubmitting) {
      onSubmit({
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        qualification: formData.qualification,
        experience: Number(formData.experience),
        profession: formData.profession.trim(),
        career_goal: formData.career_goal.trim(),
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const update = { ...prev };
        delete update[name];
        return update;
      });
    }
  };

  return (
    <motion.form
      id="profile-user-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="full_name" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <User className="h-4 w-4 text-slate-400" />
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="full_name"
              name="full_name"
              placeholder="e.g. Omkar Patre"
              value={formData.full_name}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full rounded-xl border px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                errors.full_name
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/10'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100 bg-slate-50/30'
              }`}
            />
          </div>
          {errors.full_name && <p className="text-xs font-semibold text-red-500">{errors.full_name}</p>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <Mail className="h-4 w-4 text-slate-400" />
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="e.g. patreomkar0@gmail.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full rounded-xl border px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/10'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100 bg-slate-50/30'
              }`}
            />
          </div>
          {errors.email && <p className="text-xs font-semibold text-red-500">{errors.email}</p>}
        </div>

        {/* Highest Qualification */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="qualification" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4 text-slate-400" />
            Highest Qualification
          </label>
          <select
            id="qualification"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full rounded-xl border px-4 py-3 bg-white focus:outline-none focus:ring-2 transition-all ${
              errors.qualification
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
            }`}
          >
            <option value="">-- Choose Qualification --</option>
            <option value="High School">High School</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree">Master's Degree</option>
            <option value="PhD">PhD</option>
          </select>
          {errors.qualification && <p className="text-xs font-semibold text-red-500">{errors.qualification}</p>}
        </div>

        {/* Years of Experience */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="experience" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <KeyRound className="h-4 w-4 text-slate-400" />
            Years of Work Experience
          </label>
          <input
            type="number"
            id="experience"
            name="experience"
            placeholder="e.g. 5"
            min="0"
            max="80"
            value={formData.experience}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full rounded-xl border px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.experience
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/10'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100 bg-slate-50/30'
            }`}
          />
          {errors.experience && <p className="text-xs font-semibold text-red-500">{errors.experience}</p>}
        </div>

        {/* Current Profession */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="profession" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-slate-400" />
            Current Profession / Job Title
          </label>
          <input
            type="text"
            id="profession"
            name="profession"
            placeholder="e.g. Senior Software Engineer"
            value={formData.profession}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full rounded-xl border px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.profession
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/10'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100 bg-slate-50/30'
            }`}
          />
          {errors.profession && <p className="text-xs font-semibold text-red-500">{errors.profession}</p>}
        </div>

        {/* Career Goal */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="career_goal" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <Target className="h-4 w-4 text-slate-400" />
            Primary Career Goal
          </label>
          <textarea
            id="career_goal"
            name="career_goal"
            rows={4}
            placeholder="e.g. I want to transition into an advanced AI research director role, leading industry-scale machine learning innovations and publishing foundational architectures."
            value={formData.career_goal}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full rounded-xl border px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all resize-none ${
              errors.career_goal
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/10'
                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100 bg-slate-50/30'
            }`}
          />
          {errors.career_goal && <p className="text-xs font-semibold text-red-500">{errors.career_goal}</p>}
        </div>
      </div>

      <div className="pt-2">
        <button
          id="submit-form-button"
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-6 py-4.5 text-base font-bold text-white shadow-lg shadow-blue-500/10 transition-all duration-200 hover:bg-blue-700 active:scale-[0.99] disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? 'Calculating Pathways...' : 'Generate Recommendation'}
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </motion.form>
  );
}
