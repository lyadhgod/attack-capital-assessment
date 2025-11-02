'use client';

import { useReducer, useTransition } from 'react';
import { useActionState } from 'react';
import { signIn, signUp } from '@/actions/auth';
import { ActionState, EnsureStructuredCloneable } from '@/types';

interface AuthResult {
  success: boolean;
  message: string;
}

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

const initialAuthState: ActionState<EnsureStructuredCloneable<AuthResult>, string> = {
  status: 'idle',
};

export default function LandingFormClient() {
  const [formState, formDispatch] = useReducer(formReducer, initialFormState);
  const [signInState, signInAction, signInPending] = useActionState(signIn, initialAuthState);
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, initialAuthState);
  const [isPending, startTransition] = useTransition();
  
  const authState = formState.formType === 'signin' ? signInState : signUpState;
  const authAction = formState.formType === 'signin' ? signInAction : signUpAction;
  const authPending = formState.formType === 'signin' ? signInPending : signUpPending;
  const isFormPending = authPending || isPending;

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

    // Sign up specific validations
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isFormPending) return;

    const formData = new FormData();
    formData.append('email', formState.email);
    formData.append('password', formState.password);
    if (formState.formType === 'signup') {
      formData.append('name', formState.name);
    }
    
    startTransition(() => {
      authAction(formData);
    });
  };

  return (
    <div className="card bg-base-100 w-full max-w-md shadow-xl">
      <div className="card-body">
        {/* Form Type Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <button 
            type="button"
            onClick={() => formDispatch({ type: 'SET_FORM_TYPE', payload: 'signin' })}
            className={`tab tab-lg flex-1 ${formState.formType === 'signin' ? 'tab-active' : ''}`}
            disabled={isFormPending}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => formDispatch({ type: 'SET_FORM_TYPE', payload: 'signup' })}
            className={`tab tab-lg flex-1 ${formState.formType === 'signup' ? 'tab-active' : ''}`}
            disabled={isFormPending}
          >
            Sign Up
          </button>
        </div>

        <h2 className="card-title text-2xl font-bold text-center mb-4">
          {formState.formType === 'signin' ? 'Welcome Back' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (Sign Up Only) */}
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
                disabled={isFormPending}
                required={formState.formType === 'signup'}
              />
              {formState.errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">{formState.errors.name}</span>
                </label>
              )}
            </div>
          )}

          {/* Email Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className={`input input-bordered w-full ${formState.errors.email ? 'input-error' : ''}`}
              value={formState.email}
              onChange={(e) => formDispatch({ type: 'SET_EMAIL', payload: e.target.value })}
              disabled={isFormPending}
              required
            />
            {formState.errors.email && (
              <label className="label">
                <span className="label-text-alt text-error">{formState.errors.email}</span>
              </label>
            )}
          </div>

          {/* Password Field */}
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
              disabled={isFormPending}
              required
            />
            {formState.errors.password && (
              <label className="label">
                <span className="label-text-alt text-error">{formState.errors.password}</span>
              </label>
            )}
          </div>

          {/* Confirm Password Field (Sign Up Only) */}
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
                disabled={isFormPending}
                required={formState.formType === 'signup'}
              />
              {formState.errors.confirmPassword && (
                <label className="label">
                  <span className="label-text-alt text-error">{formState.errors.confirmPassword}</span>
                </label>
              )}
            </div>
          )}

          {/* General Error Display */}
          {(formState.errors.general || authState.status === 'error') && (
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formState.errors.general || 'Authentication failed. Please try again.'}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="form-control mt-6">
            <button 
              type="submit" 
              className="btn btn-primary w-full"
              disabled={isFormPending}
            >
              {isFormPending ? (
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

        <div className="divider">OR</div>
        
        {/* Alternative Action */}
        <p className="text-center text-sm">
          {formState.formType === 'signin' ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => formDispatch({ 
              type: 'SET_FORM_TYPE', 
              payload: formState.formType === 'signin' ? 'signup' : 'signin' 
            })}
            className="link link-primary"
            disabled={isFormPending}
          >
            {formState.formType === 'signin' ? 'Sign up here' : 'Sign in here'}
          </button>
        </p>
      </div>
    </div>
  );
}