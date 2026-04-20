import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { isAxiosError } from 'axios';
import { unstable_PasswordToggleField as PasswordToggleField } from 'radix-ui';
import type { SubmitEvent } from 'react';
import { Link } from 'react-router-dom';

import ScrollArea from '../../../components/ui/ScrollArea';
import { useSignup } from '../auth.queries';
import getDefaultColor from '../utils/getDefaultColor';

interface SignupServerErrors {
  username?: string;
  password?: string;
  avatar_color?: string;
}

export default function Signup() {
  const register = useSignup();

  const serverErrors = isAxiosError(register.error)
    ? (register.error.response?.data?.errors as SignupServerErrors)
    : undefined;

  const usernameAlreadyTakenError = isAxiosError(register.error)
    ? register.error.response?.data?.message
    : undefined;

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const avatar_color = getDefaultColor();

    register.mutate({ username, password, avatar_color });
  };

  return (
    <main className="h-[80dvh] max-h-120 min-h-0 w-full max-w-120 min-w-80 flex-1 place-self-center overflow-hidden rounded-xl">
      <ScrollArea rootClassName="rounded-xl overflow-hidden h-full">
        <div className="bg-dark-500 flex min-h-0 flex-1 flex-col content-start items-center overflow-y-auto rounded-b-xl px-8 text-center">
          <h1 className="my-10 text-3xl font-semibold text-balance">Get started!</h1>

          <form onSubmit={handleSubmit} className="grid w-full gap-6">
            <fieldset className="grid w-full gap-4">
              <div className="grid gap-1">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  maxLength={30}
                  className="bg-input-bg text-placeholder rounded-full px-4 py-2 focus:outline-none"
                />
                {serverErrors?.username && (
                  <p className="text-danger text-start text-sm">{serverErrors.username}</p>
                )}
                {usernameAlreadyTakenError && (
                  <p className="text-danger text-start text-sm">{usernameAlreadyTakenError}</p>
                )}
              </div>

              <div className="grid gap-1">
                <PasswordToggleField.Root>
                  <div className="relative">
                    <PasswordToggleField.Input
                      name="password"
                      placeholder="Password"
                      className="bg-input-bg text-placeholder w-full rounded-full px-4 py-2 focus:outline-none"
                    />

                    <PasswordToggleField.Toggle className="absolute inset-y-3 right-4 box-border aspect-square h-4.5 cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2">
                      <PasswordToggleField.Icon
                        visible={<EyeOpenIcon />}
                        hidden={<EyeClosedIcon />}
                      />
                    </PasswordToggleField.Toggle>
                  </div>
                </PasswordToggleField.Root>
                {serverErrors?.password && (
                  <p className="text-danger text-start text-sm">{serverErrors.password}</p>
                )}
              </div>
            </fieldset>

            <button
              className="bg-info disabled:bg-info-soft disabled:text-light-600 hover:bg-info-hover cursor-pointer rounded-lg px-4 py-2 font-medium"
              type="submit"
              disabled={register.isPending}
            >
              {register.isPending ? 'Signing up...' : 'Register'}
            </button>
          </form>

          <div className="border-b-light-700 my-8 mt-auto border-b-2 py-4">
            Already have an account?{' '}
            <Link to={'/auth/login'} className="text-info hover:text-info-hover font-semibold">
              Login
            </Link>
          </div>
        </div>
      </ScrollArea>
    </main>
  );
}
