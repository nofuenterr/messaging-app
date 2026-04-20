import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { isAxiosError } from 'axios';
import { unstable_PasswordToggleField as PasswordToggleField } from 'radix-ui';
import { useState, type SubmitEvent } from 'react';
import { Link } from 'react-router-dom';

import ScrollArea from '../../../components/ui/ScrollArea';
import { useLogin } from '../auth.queries';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();

  const errorMessage = isAxiosError(login.error) ? login.error.response?.data?.message : null;

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    login.mutate({ username, password });
  };

  return (
    <main className="h-[80dvh] max-h-120 min-h-0 w-full max-w-120 min-w-80 flex-1 place-self-center overflow-hidden rounded-xl">
      <ScrollArea rootClassName="rounded-xl overflow-hidden h-full">
        <div className="bg-dark-500 flex min-h-0 flex-1 flex-col content-start items-center overflow-y-auto rounded-b-xl px-8 text-center">
          <h1 className="my-10 text-3xl font-semibold">Welcome back!</h1>

          <form onSubmit={handleSubmit} className="grid w-full gap-6">
            <fieldset className="grid w-full gap-4">
              <input
                required
                type="text"
                name="username"
                placeholder="Username"
                maxLength={30}
                className="bg-input-bg text-placeholder rounded-full px-4 py-2 focus:outline-none"
                onChange={(e) => setUsername(e.target.value)}
              />

              <PasswordToggleField.Root>
                <div className="relative">
                  <PasswordToggleField.Input
                    required
                    name="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
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
            </fieldset>

            {errorMessage && <p className="text-danger text-start text-sm">{errorMessage}</p>}

            <button
              className="bg-info disabled:bg-info-soft disabled:text-light-600 hover:bg-info-hover cursor-pointer rounded-lg px-4 py-2 font-medium"
              type="submit"
              disabled={login.isPending || !(username && password)}
            >
              {login.isPending ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="border-b-light-700 my-8 mt-auto border-b-2 py-4">
            Don&apos;t have an account?{' '}
            <Link to={'/auth/signup'} className="text-info hover:text-info-hover font-semibold">
              Sign up
            </Link>
          </div>
        </div>
      </ScrollArea>
    </main>
  );
}
