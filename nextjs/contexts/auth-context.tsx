'use client';

import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import betterAuthClient from '@/integrations/better-auth-client';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_STATE' }
  | { type: 'SET_SESSION_DATA'; payload: { user?: User; isLoading: boolean; error?: string | null } };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_STATE':
      return { user: null, isLoading: false, error: null };
    case 'SET_SESSION_DATA':
      return {
        ...state,
        isLoading: action.payload.isLoading,
        user: action.payload.user || null,
        error: action.payload.error || null,
      };
    default:
      return state;
  }
}

const initialAuthState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  const { 
    data: sessionData,
    isPending: sessionIsPending,
    error: sessionError,
    refetch: refetchSession
  } = betterAuthClient.useSession();

  useEffect(() => {
    if (sessionData?.user) {
      dispatch({
        type: 'SET_SESSION_DATA',
        payload: {
          user: {
            id: sessionData.user.id,
            name: sessionData.user.name,
            email: sessionData.user.email,
          },
          isLoading: sessionIsPending,
          error: null,
        },
      });
    } else if (sessionError) {
      dispatch({
        type: 'SET_SESSION_DATA',
        payload: {
          isLoading: sessionIsPending,
          error: sessionError.message || 'Authentication error',
        },
      });
    } else {
      dispatch({
        type: 'SET_SESSION_DATA',
        payload: {
          isLoading: sessionIsPending,
        },
      });
    }
  }, [sessionData, sessionIsPending, sessionError]);

  const signIn = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      const { data, error } = await betterAuthClient.signIn.email({ email, password });
      
      if (error) {
        const errorMessage = error.message || 'Sign in failed';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        return { success: false, error: errorMessage };
      }
      
      if (data?.user) {
        dispatch({
          type: 'SET_USER',
          payload: {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
          },
        });
      }
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during sign in';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      const { data, error } = await betterAuthClient.signUp.email({ name, email, password });
      
      if (error) {
        const errorMessage = error.message || 'Sign up failed';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        return { success: false, error: errorMessage };
      }
      
      if (data?.user) {
        dispatch({
          type: 'SET_USER',
          payload: {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
          },
        });
      }
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during sign up';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const signOut = async () => {
    try {
      await betterAuthClient.signOut();
      dispatch({ type: 'RESET_STATE' });
    } catch (err) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: err instanceof Error ? err.message : 'Sign out failed' 
      });
    }
  };

  const refetch = () => {
    refetchSession();
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user: state.user, 
        isLoading: state.isLoading, 
        error: state.error, 
        signIn, 
        signUp, 
        signOut, 
        refetch 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}