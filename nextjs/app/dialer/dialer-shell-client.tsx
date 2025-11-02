'use client';

import { useReducer, useRef } from 'react';
import { useActionState } from 'react';
import { call, CallResult } from '@/actions/call';
import { ActionState, EnsureStructuredCloneable } from '@/types';

const PHONE_DIGITS = 10; // For US phone numbers (excluding country code)

interface PhoneDialerState {
  digits: string[];
  countryCode: string;
}

type PhoneDialerAction =
  | { type: 'SET_DIGIT'; payload: { index: number; value: string } }
  | { type: 'SET_COUNTRY_CODE'; payload: string }
  | { type: 'CLEAR_DIGITS' }
  | { type: 'SET_ALL_DIGITS'; payload: string[] };

function phoneDialerReducer(state: PhoneDialerState, action: PhoneDialerAction): PhoneDialerState {
  switch (action.type) {
    case 'SET_DIGIT':
      const newDigits = [...state.digits];
      newDigits[action.payload.index] = action.payload.value;
      return { ...state, digits: newDigits };
    case 'SET_COUNTRY_CODE':
      return { ...state, countryCode: action.payload };
    case 'CLEAR_DIGITS':
      return { ...state, digits: new Array(PHONE_DIGITS).fill('') };
    case 'SET_ALL_DIGITS':
      return { ...state, digits: action.payload };
    default:
      return state;
  }
}

const initialDialerState: PhoneDialerState = {
  digits: new Array(PHONE_DIGITS).fill(''),
  countryCode: '+1',
};

const initialMakeCallState: ActionState<EnsureStructuredCloneable<CallResult>, null> = {
  status: 'idle',
};

export default function DialerShellClient() {
  const [state, dispatch] = useReducer(phoneDialerReducer, initialDialerState);
  const [makeCallState, makeCallFormAction, makeCallPending] = useActionState(call, initialMakeCallState);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(new Array(PHONE_DIGITS).fill(null));

  const handleDigitChange = (index: number, value: string) => {
    // Only allow single digits
    const digit = value.replace(/\D/g, '').slice(-1);
    
    dispatch({ type: 'SET_DIGIT', payload: { index, value: digit } });

    // Auto-focus next input
    if (digit && index < PHONE_DIGITS - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !state.digits[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < PHONE_DIGITS - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    
    if (pastedData.length >= PHONE_DIGITS) {
      const newDigits = pastedData.slice(0, PHONE_DIGITS).split('');
      const paddedDigits = [...newDigits, ...new Array(Math.max(0, PHONE_DIGITS - newDigits.length)).fill('')];
      dispatch({ type: 'SET_ALL_DIGITS', payload: paddedDigits });
      // Focus the last filled input or the next empty one
      const focusIndex = Math.min(newDigits.length, PHONE_DIGITS - 1);
      setTimeout(() => inputRefs.current[focusIndex]?.focus(), 0);
    }
  };

  const clearNumber = () => {
    dispatch({ type: 'CLEAR_DIGITS' });
    inputRefs.current[0]?.focus();
  };

  const formatPhoneNumber = () => {
    const phoneDigits = state.digits.join('').replace(/\D/g, '');
    if (phoneDigits.length === 10) {
      return `${state.countryCode}${phoneDigits}`;
    }
    return '';
  };

  const isValidPhoneNumber = state.digits.every((digit: string) => digit !== '') && state.digits.join('').replace(/\D/g, '').length === PHONE_DIGITS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhoneNumber || makeCallPending) return;

    const formData = new FormData();
    formData.append('to', formatPhoneNumber());
    makeCallFormAction(formData);
  };

  const dialPadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  const handleDialPadClick = (value: string) => {
    if (value === '*' || value === '#') return; // Ignore special characters for now
    
    const emptyIndex = state.digits.findIndex((digit: string) => digit === '');
    if (emptyIndex !== -1) {
      handleDigitChange(emptyIndex, value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Country Code Selector */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Country Code</span>
        </label>
        <select 
          className="select select-bordered w-full"
          value={state.countryCode}
          onChange={(e) => dispatch({ type: 'SET_COUNTRY_CODE', payload: e.target.value })}
          disabled={makeCallPending}
        >
          <option value="+1">🇺🇸 United States (+1)</option>
          <option value="+91">🇮🇳 India (+91)</option>
          <option value="+44">🇬🇧 United Kingdom (+44)</option>
          <option value="+49">🇩🇪 Germany (+49)</option>
          <option value="+33">🇫🇷 France (+33)</option>
          <option value="+86">🇨🇳 China (+86)</option>
        </select>
      </div>

      {/* Phone Number Input Grid */}
      <div className="space-y-4">
        <label className="label">
          <span className="label-text font-medium">Phone Number</span>
          <button
            type="button"
            onClick={clearNumber}
            className="label-text-alt text-error hover:underline"
            disabled={makeCallPending}
          >
            Clear
          </button>
        </label>
        
        <div className="grid grid-cols-5 gap-2">
          {state.digits.map((digit: string, index: number) => (
            <input
              key={index}
              ref={el => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="input input-bordered text-center text-xl font-mono h-14 w-full"
              placeholder="0"
              disabled={makeCallPending}
            />
          ))}
        </div>

        {/* Formatted Phone Number Display */}
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-primary">
            {formatPhoneNumber() || `${state.countryCode} (___) ___-____`}
          </div>
        </div>
      </div>

      {/* Dial Pad */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-center">Dial Pad</h4>
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {dialPadNumbers.flat().map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => handleDialPadClick(number)}
              className="btn btn-outline btn-lg text-xl font-mono h-16 w-16"
              disabled={makeCallPending}
            >
              {number}
            </button>
          ))}
        </div>
      </div>

      {/* Call Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={!isValidPhoneNumber || makeCallPending}
          className="btn btn-primary btn-lg w-full text-xl"
        >
          {makeCallPending ? (
            <>
              <span className="loading loading-spinner"></span>
              Calling...
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Start Call
            </>
          )}
        </button>
      </div>

      {!isValidPhoneNumber && state.digits.some((d: string) => d !== '') && (
        <div className="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>Please enter a complete {PHONE_DIGITS}-digit phone number</span>
        </div>
      )}

      {/* Call Status Display */}
      {makeCallPending && (
        <div className="text-center p-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-primary mt-2 font-medium">Connecting and analyzing call...</p>
        </div>
      )}

      {makeCallState.status === 'success' && makeCallState.data && (
        <div className={`alert ${makeCallState.data.human ? 'alert-success' : 'alert-warning'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={makeCallState.data.human ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"} />
          </svg>
          <span>
            {makeCallState.data.human 
              ? 'Human detected! Call successful.' 
              : 'Machine detected. Call terminated.'}
          </span>
        </div>
      )}

      {makeCallState.status === 'error' && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Call failed. Please try again.</span>
        </div>
      )}
    </form>
  );
}