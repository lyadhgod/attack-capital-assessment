'use client';

import { useReducer, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { MdErrorOutline } from 'react-icons/md';

interface FormState {
  formType: 'signin' | 'signup';
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  errors: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    name?: string;
    general?: string;
  };
}

type FormAction =
  | { type: 'SET_FORM_TYPE'; payload: 'signin' | 'signup' }
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_CONFIRM_PASSWORD'; payload: string }
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_ERROR'; payload: { field: string; message: string } }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'RESET_FORM' };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FORM_TYPE':
      return {
        ...state,
        formType: action.payload,
        errors: {},
        password: '',
        confirmPassword: '',
        name: action.payload === 'signin' ? '' : state.name,
      };
    case 'SET_EMAIL':
      return { 
        ...state, 
        email: action.payload,
        errors: { ...state.errors, email: undefined }
      };
    case 'SET_PASSWORD':
      return { 
        ...state, 
        password: action.payload,
        errors: { ...state.errors, password: undefined }
      };
    case 'SET_CONFIRM_PASSWORD':
      return { 
        ...state, 
        confirmPassword: action.payload,
        errors: { ...state.errors, confirmPassword: undefined }
      };
    case 'SET_NAME':
      return { 
        ...state, 
        name: action.payload,
        errors: { ...state.errors, name: undefined }
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload.field]: action.payload.message }
      };
    case 'CLEAR_ERRORS':
      return { ...state, errors: {} };
    case 'RESET_FORM':
      return {
        ...state,
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        errors: {}
      };
    default:
      return state;
  }
}

const initialFormState: FormState = {
  formType: 'signin',
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  errors: {}
};

export default function Form() {
  const [formState, formDispatch] = useReducer(formReducer, initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, error: authError } = useAuth();

  const validateForm = (): boolean => {
    formDispatch({ type: 'CLEAR_ERRORS' });
    let isValid = true;

    // Email validation
    if (!formState.email) {
      formDispatch({ type: 'SET_ERROR', payload: { field: 'email', message: 'Email is required' } });
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      formDispatch({ type: 'SET_ERROR', payload: { field: 'email', message: 'Please enter a valid email' } });
      isValid = false;
    }

    // Password validation
    if (!formState.password) {
      formDispatch({ type: 'SET_ERROR', payload: { field: 'password', message: 'Password is required' } });
      isValid = false;
    } else if (formState.password.length < 8) {
      formDispatch({ type: 'SET_ERROR', payload: { field: 'password', message: 'Password must be at least 8 characters' } });
      isValid = false;
    }

    if (formState.formType === 'signup') {
      if (!formState.name.trim()) {
        formDispatch({ type: 'SET_ERROR', payload: { field: 'name', message: 'Name is required' } });
        isValid = false;
      }

      if (!formState.confirmPassword) {
        formDispatch({ type: 'SET_ERROR', payload: { field: 'confirmPassword', message: 'Please confirm your password' } });
        isValid = false;
      } else if (formState.password !== formState.confirmPassword) {
        formDispatch({ type: 'SET_ERROR', payload: { field: 'confirmPassword', message: 'Passwords do not match' } });
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isLoading) return;

    setIsLoading(true);
    formDispatch({ type: 'CLEAR_ERRORS' });
    
    try {
      let result;
      if (formState.formType === 'signin') {
        result = await signIn(formState.email, formState.password);
      } else {
        result = await signUp(formState.name, formState.email, formState.password);
      }
      
      // Handle authentication failure
      if (!result?.success) {
        const errorMessage = result?.error || 'Authentication failed. Please try again.';
        formDispatch({ 
          type: 'SET_ERROR', 
          payload: { field: 'general', message: errorMessage } 
        });
      }
      // If successful, form will redirect via auth context
    } catch (error) {
      console.error('Form submission error:', error);
      formDispatch({ 
        type: 'SET_ERROR', 
        payload: { 
          field: 'general', 
          message: 'An unexpected error occurred. Please try again.' 
        } 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 w-full max-w-md min-w-[384px] shadow-xl">
      <div className="card-body p-6">
        <div className="tabs tabs-boxed mb-6">
          <button 
            type="button"
            onClick={() => formDispatch({ type: 'SET_FORM_TYPE', payload: 'signin' })}
            className={`tab tab-lg flex-1 ${formState.formType === 'signin' ? 'tab-active' : ''}`}
            disabled={isLoading}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => formDispatch({ type: 'SET_FORM_TYPE', payload: 'signup' })}
            className={`tab tab-lg flex-1 ${formState.formType === 'signup' ? 'tab-active' : ''}`}
            disabled={isLoading}
          >
            Sign Up
          </button>
        </div>

        <h2 className="card-title text-2xl font-bold text-center mb-4">
          {formState.formType === 'signin' ? 'Welcome Back' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {formState.formType === 'signup' && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className={`input input-bordered w-full ${formState.errors.name ? 'input-error' : ''}`}
                value={formState.name}
                onChange={(e) => formDispatch({ type: 'SET_NAME', payload: e.target.value })}
                disabled={isLoading}
              />
              {formState.errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">{formState.errors.name}</span>
                </label>
              )}
            </div>
          )}

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="text"
              placeholder="Enter your email"
              className={`input input-bordered w-full ${formState.errors.email ? 'input-error' : ''}`}
              value={formState.email}
              onChange={(e) => formDispatch({ type: 'SET_EMAIL', payload: e.target.value })}
              disabled={isLoading}
            />
            {formState.errors.email && (
              <label className="label">
                <span className="label-text-alt text-error">{formState.errors.email}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className={`input input-bordered w-full ${formState.errors.password ? 'input-error' : ''}`}
              value={formState.password}
              onChange={(e) => formDispatch({ type: 'SET_PASSWORD', payload: e.target.value })}
              disabled={isLoading}
            />
            {formState.errors.password && (
              <label className="label">
                <span className="label-text-alt text-error">{formState.errors.password}</span>
              </label>
            )}
          </div>

          {formState.formType === 'signup' && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                className={`input input-bordered w-full ${formState.errors.confirmPassword ? 'input-error' : ''}`}
                value={formState.confirmPassword}
                onChange={(e) => formDispatch({ type: 'SET_CONFIRM_PASSWORD', payload: e.target.value })}
                disabled={isLoading}
              />
              {formState.errors.confirmPassword && (
                <label className="label">
                  <span className="label-text-alt text-error">{formState.errors.confirmPassword}</span>
                </label>
              )}
            </div>
          )}

          {(formState.errors.general || authError) && (
            <div className="alert alert-error">
              <MdErrorOutline className="flex-shrink-0" />
              <span className="text-sm">
                {formState.errors.general || authError || 'Authentication failed. Please try again.'}
              </span>
            </div>
          )}

          <div className="form-control mt-6">
            <button 
              type="submit" 
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  {formState.formType === 'signin' ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                formState.formType === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}