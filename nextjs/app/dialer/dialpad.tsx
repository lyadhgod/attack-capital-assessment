'use client';

import { useReducer } from 'react';
import { useActionState } from 'react';
import { call, CallProvider, CallResult } from '@/actions/call';
import { ActionState, EnsureStructuredCloneable } from '@/types';
import { MdErrorOutline, MdOutlineDeleteForever } from 'react-icons/md';
import { FaDeleteLeft } from 'react-icons/fa6';
import { IoCallOutline } from 'react-icons/io5';
import { FaRegGrinTongueWink } from 'react-icons/fa';

const PHONE_DIGITS = 10; // For US phone numbers (excluding country code)

interface PhoneDialerState {
  phoneNumber: string;
  countryCode: string;
  provider: CallProvider;
}

type PhoneDialerAction =
  | { type: 'SET_PHONE_NUMBER'; payload: string }
  | { type: 'SET_COUNTRY_CODE'; payload: string }
  | { type: 'SET_PROVIDER'; payload: CallProvider }
  | { type: 'CLEAR_PHONE_NUMBER' };

function phoneDialerReducer(state: PhoneDialerState, action: PhoneDialerAction): PhoneDialerState {
  switch (action.type) {
    case 'SET_PHONE_NUMBER':
      return { ...state, phoneNumber: action.payload };
    case 'SET_COUNTRY_CODE':
      return { ...state, countryCode: action.payload };
    case 'SET_PROVIDER':
      return { ...state, provider: action.payload };
    case 'CLEAR_PHONE_NUMBER':
      return { ...state, phoneNumber: '' };
    default:
      return state;
  }
}

const initialDialerState: PhoneDialerState = {
  phoneNumber: '',
  countryCode: '+1',
  provider: 'twilio',
};

const initialMakeCallState: ActionState<EnsureStructuredCloneable<CallResult>, null> = {
  status: 'idle',
};

export default function Dialpad() {
  const [state, dispatch] = useReducer(phoneDialerReducer, initialDialerState);
  const [makeCallState, makeCallFormAction, makeCallPending] = useActionState(call, initialMakeCallState);
  
  const formatPhoneNumber = () => {
    if (state.phoneNumber.length === 10) {
      return `${state.countryCode}${state.phoneNumber}`;
    }
    return '';
  };

  const formatDisplayNumber = () => {
    if (state.phoneNumber.length === 0) {
      return `${state.countryCode} (___) ___-____`;
    }
    
    const digits = state.phoneNumber.padEnd(10, '_');
    return `${state.countryCode} (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const isValidPhoneNumber = state.phoneNumber.length === PHONE_DIGITS;

  const handleSubmit = (formData: FormData) => {
    if (!isValidPhoneNumber || makeCallPending) return;
    
    makeCallFormAction(formData);
  };

  const dialPadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  const handleDialPadClick = (value: string) => {
    if (value === '*') {
      // Clear the entire input field
      dispatch({ type: 'CLEAR_PHONE_NUMBER' });
      return;
    }
    
    if (value === '#') {
      // Remove one digit from the end
      const newNumber = state.phoneNumber.slice(0, -1);
      dispatch({ type: 'SET_PHONE_NUMBER', payload: newNumber });
      return;
    }
    
    // Add digit if there's space
    if (state.phoneNumber.length < PHONE_DIGITS) {
      const newNumber = state.phoneNumber + value;
      dispatch({ type: 'SET_PHONE_NUMBER', payload: newNumber });
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Hidden input for phone number */}
      <input type="hidden" name="to" value={formatPhoneNumber()} />
      {/* Hidden input for provider */}
      <input type="hidden" name="provider" value={state.provider} />
      
      

      {/* Phone Number Display */}
      <div className="text-center">
        <div className="text-2xl font-mono font-bold text-accent">
          {formatDisplayNumber()}
        </div>
      </div>

      {/* Country Code Selector */}
      <div className="form-control max-w-xs mx-auto">
        <select 
          className="select select-bordered w-full"
          value={state.countryCode}
          onChange={(e) => dispatch({ type: 'SET_COUNTRY_CODE', payload: e.target.value })}
          disabled={makeCallPending}
        >
          <option value="+1">🇺🇸 United States (+1)</option>
          <option value="+91">🇮🇳 India (+91)</option>
        </select>
      </div>

      {/* Dial Pad */}
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto place-items-center">
          {dialPadNumbers.flat().map((number) => {
            let buttonContent: string | React.ReactNode = number;
            let buttonTitle = 'Press to dial ' + number;
            let buttonClass = 'btn btn-outline btn-lg text-xl font-mono h-16 w-16 flex justify-center items-center';
            switch (number) {
              case '*':
                buttonContent = <MdOutlineDeleteForever />
                buttonTitle = 'Clear all digits';
                buttonClass = `${buttonClass} btn-circle`;
                break;
              case '#':
                buttonContent = <FaDeleteLeft />
                buttonTitle = 'Delete last digit';
                buttonClass = `${buttonClass} btn-circle`;
                break;
            }
            
            return (
              <button
                key={number}
                type="button"
                onClick={() => handleDialPadClick(number)}
                className={buttonClass}
                disabled={makeCallPending}
                title={buttonTitle}
              >
                {buttonContent}
              </button>
            );
          })}
        </div>
      </div>

      <div className="divider"></div>

      {/* Provider Selector */}
      <div className="form-control max-w-xs mx-auto">
        <select 
          className="select select-bordered w-full"
          value={state.provider}
          onChange={(e) => dispatch({ type: 'SET_PROVIDER', payload: e.target.value as CallProvider })}
          disabled={makeCallPending}
        >
          <option value="twilio">Twilio</option>
        </select>
      </div>

      {/* Call Button */}
      <div className="pt-4 max-w-xs mx-auto">
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
            <><IoCallOutline />Call</>
          )}
        </button>
      </div>

      {/* Call Status Display */}
      {makeCallState.status === 'success' && makeCallState.data && (
        <div className={`alert ${makeCallState.data.human ? 'alert-success' : 'alert-warning'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={makeCallState.data.human ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"} />
          </svg>
          <span>
            {makeCallState.data.human 
              ? <><FaRegGrinTongueWink /> Human detected! Call successful.</>
              : <><IoCallOutline /> Machine detected. Call terminated.</>}
          </span>
        </div>
      )}

      {makeCallState.status === 'error' && (
        <div className="alert alert-error">
          <MdErrorOutline />
          <span>Call failed. Please try again.</span>
        </div>
      )}
    </form>
  );
}