import { useState, useEffect } from 'react';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function UserForm({ editingUser, onSubmit, onCancelEdit }) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const isEditing = Boolean(editingUser);

  // Populate form when editing user changes
  useEffect(() => {
    if (editingUser) {
      setFormData({ name: editingUser.name, email: editingUser.email });
      setErrors({});
      setSubmitError('');
      setSubmitSuccess('');
    } else {
      setFormData({ name: '', email: '' });
      setErrors({});
      setSubmitError('');
    }
  }, [editingUser]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    // Always prevent default — no HTML form submission
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      await onSubmit({ name: formData.name.trim(), email: formData.email.trim() });
      setSubmitSuccess(isEditing ? 'User updated successfully!' : 'User added successfully!');
      if (!isEditing) {
        setFormData({ name: '', email: '' });
      }
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', email: '' });
    setErrors({});
    setSubmitError('');
    setSubmitSuccess('');
    onCancelEdit();
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: isEditing ? '#f0f7ff' : '#f0fdf4' }}
        >
          {isEditing ? (
            <svg className="w-4 h-4" style={{ color: '#004e9f' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" style={{ color: '#34A853' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </div>
        <div>
          <h2 className="text-slate-800 font-semibold text-sm">
            {isEditing ? 'Edit User' : 'Add User'}
          </h2>
          <p className="text-slate-400 text-xs">
            {isEditing ? `Editing: ${editingUser.name}` : 'Fill in the details below'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-4">

        {/* Success message */}
        {submitSuccess && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-emerald-700 text-sm">{submitSuccess}</p>
          </div>
        )}

        {/* Error message */}
        {submitError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
            <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 text-sm">{submitError}</p>
          </div>
        )}

        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-slate-700 text-sm font-medium mb-1.5">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Jane Smith"
            autoComplete="name"
            disabled={isSubmitting}
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all duration-150 outline-none
              ${errors.name
                ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200'
                : 'border-slate-200 bg-white focus:ring-2 focus:border-blue-300'
              }
              disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed`}
            style={!errors.name ? { '--tw-ring-color': '#bfdbfe' } : {}}
          />
          {errors.name && (
            <p className="mt-1.5 text-red-500 text-xs flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-slate-700 text-sm font-medium mb-1.5">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. jane@example.com"
            autoComplete="email"
            disabled={isSubmitting}
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all duration-150 outline-none
              ${errors.email
                ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200'
                : 'border-slate-200 bg-white focus:ring-2 focus:border-blue-300'
              }
              disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed`}
          />
          {errors.email && (
            <p className="mt-1.5 text-red-500 text-xs flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.email}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5 pt-1">
          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: isEditing ? '#004e9f' : '#34A853' }}
          >
            {isSubmitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                {isEditing ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              <>
                {isEditing ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
                {isEditing ? 'Update User' : 'Add User'}
              </>
            )}
          </button>

          {/* Cancel Edit button — only shown when editing */}
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
