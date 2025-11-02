'use client';

import { call, CallResult } from "@/actions/call";
import { ActionState, EnsureStructuredCloneable } from "@/types";
import { useActionState, useEffect, useState } from "react";
import betterAuthClient from "@/integrations/better-auth-client";

const initialMakeCallState: ActionState<EnsureStructuredCloneable<CallResult>, null> = {
  status: 'idle',
}

export default function Page() {
  const [makeCallState, makeCallFormAction, makeCallPending] = useActionState(call, initialMakeCallState);
  const [createUserPending, setCreateUserPending] = useState(false);
  const [loginPending, setLoginPending] = useState(false);

  useEffect(() => {
    console.log('makeCallState', makeCallState);
  }, [makeCallState]);

  return (
    <main>
      <section>
        <h1>Login</h1>
        <form onSubmit={async (e) => {
          e.preventDefault();

          const form = e.target as HTMLFormElement;
          const email = (form.elements.namedItem('email') as HTMLInputElement).value;
          const password = (form.elements.namedItem('password') as HTMLInputElement).value;

          setLoginPending(true);
          try {
            const { data, error } = await betterAuthClient.signIn.email({ email, password });
            console.log('User logged in:', data, error);
          } catch (error) {
            console.error('Error logging in user:', error);
          } finally {
            setLoginPending(false);
          }
        }}>
          <input
            type="text" 
            name="email"
            placeholder="Enter email"
            disabled={loginPending}
            value="rounak.tikadar@gmail.com"
            readOnly={true}
          />
          <input
            type="password" 
            name="password"
            placeholder="Enter password"
            disabled={loginPending}
            value="password"
            readOnly={true}
          />
          <button type="submit" disabled={loginPending}>
            {loginPending ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </section>
      <section>
        <h1>Create user</h1>
        <form onSubmit={async (e) => {
          e.preventDefault();

          const form = e.target as HTMLFormElement;
          const name = (form.elements.namedItem('name') as HTMLInputElement).value;
          const email = (form.elements.namedItem('email') as HTMLInputElement).value;
          const password = (form.elements.namedItem('password') as HTMLInputElement).value;

          setCreateUserPending(true);
          try {
            const { data, error } = await betterAuthClient.signUp.email({ name, email, password });
            console.log('User created:', data, error);
          } catch (error) {
            console.error('Error creating user:', error);
          } finally {
            setCreateUserPending(false);
          }
        }}>
          <input
            type="text" 
            name="name"
            placeholder="Enter name"
            disabled={createUserPending}
            value="Rounak"
            readOnly={true}
          />
          <input
            type="text" 
            name="email"
            placeholder="Enter email"
            disabled={createUserPending}
            value="rounak.tikadar@gmail.com"
            readOnly={true}
          />
          <input
            type="password" 
            name="password"
            placeholder="Enter password"
            disabled={createUserPending}
            value="password"
            readOnly={true}
          />
          <button type="submit" disabled={createUserPending}>
            {createUserPending ? 'Creating...' : 'Create'}
          </button>
        </form>
      </section>
      <section>
        <h3>Make a Call</h3>
        <form action={makeCallFormAction}>
          <input
            type="text"
            name="to"
            placeholder="Enter phone number"
            value="+919073422105"
            disabled={makeCallPending}
            readOnly={true}
          />
          <button type="submit" disabled={makeCallPending}>
            {makeCallPending ? 'Calling...' : 'Call'}
          </button>
        </form>
      </section>
    </main>
  );
}
