'use server';

import { redirect } from 'next/navigation';
import { ActionState, EnsureStructuredCloneable } from '@/types';

interface AuthResult {
  success: boolean;
  message: string;
}

export async function signIn(
  prevState: ActionState<EnsureStructuredCloneable<AuthResult>, string>,
  formData: FormData
): Promise<ActionState<EnsureStructuredCloneable<AuthResult>, string>> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return {
        status: 'error',
        error: 'Email and password are required',
      };
    }

    // Simulate authentication - replace with your actual auth logic
    if (email === 'demo@example.com' && password === 'password123') {
      // Set cookies or session here
      redirect('/dialer');
    } else {
      return {
        status: 'error',
        error: 'Invalid email or password',
      };
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      // This is expected for successful redirects
      throw error;
    }
    
    return {
      status: 'error',
      error: 'An error occurred during sign in',
    };
  }
}

export async function signUp(
  prevState: ActionState<EnsureStructuredCloneable<AuthResult>, string>,
  formData: FormData
): Promise<ActionState<EnsureStructuredCloneable<AuthResult>, string>> {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
      return {
        status: 'error',
        error: 'All fields are required',
      };
    }

    if (password.length < 8) {
      return {
        status: 'error',
        error: 'Password must be at least 8 characters long',
      };
    }

    // Simulate user creation - replace with your actual auth logic
    if (email === 'existing@example.com') {
      return {
        status: 'error',
        error: 'User already exists with this email',
      };
    }

    // Set cookies or session here
    redirect('/dialer');
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      // This is expected for successful redirects
      throw error;
    }
    
    return {
      status: 'error',
      error: 'An error occurred during sign up',
    };
  }
}