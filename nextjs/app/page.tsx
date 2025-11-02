'use client';

import { call, CallResult } from "@/actions/call";
import { ActionState, EnsureStructuredCloneable } from "@/types";
import { useActionState, useEffect } from "react";

const initialState: ActionState<EnsureStructuredCloneable<CallResult>, null> = {
  status: 'idle',
}

export default function Page() {
  const [state, formAction, pending] = useActionState(call, initialState);

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <form action={formAction}>
      <input
        type="text"
        name="to"
        placeholder="Enter phone number"
        value="+919073422105"
        disabled={pending}
        readOnly={true}
      />
      <button type="submit" disabled={pending}>
        {pending ? 'Calling...' : 'Call'}
      </button>
    </form>
  );
}
