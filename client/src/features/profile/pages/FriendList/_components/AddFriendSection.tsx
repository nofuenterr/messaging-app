import { isAxiosError } from 'axios';
import { useRef, useState, type ReactNode, type SubmitEvent } from 'react';
import { Link } from 'react-router-dom';

import { useAddFriendByUsername } from '../../../../friendship/friendship.queries';
import AllGroupsIcon from '../../../../group/components/GroupNav/_components/AllGroupsIcon';

interface AddFriendServerErrors {
  username?: string;
}

export default function AddFriendSection() {
  const [username, setUsername] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<ReactNode>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addFriend = useAddFriendByUsername();

  const serverErrors = isAxiosError(addFriend.error)
    ? (addFriend.error.response?.data?.errors as AddFriendServerErrors)
    : undefined;

  const serverMessage = isAxiosError(addFriend.error)
    ? (addFriend.error.response?.data?.message as string)
    : undefined;

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    addFriend.mutate(username, {
      onSuccess: () => {
        setSuccessMessage(
          <p className="text-success text-sm">
            Success! Your friend request to <span className="font-semibold">{username}</span> was
            sent.
          </p>
        );
        handleReset();
      },
    });
  }

  function handleReset() {
    setUsername('');
    inputRef.current?.focus();
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-1">
        <h4 className="text-xl font-semibold">Add Friend</h4>
        <p>You can add friends with their username.</p>

        <form onSubmit={handleSubmit} className="mt-3">
          <div className="grid gap-1">
            <div className="relative">
              <input
                ref={inputRef}
                autoFocus
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="You can add friends with their username."
                className="border-dark-500 bg-dark-900 w-full rounded-lg border px-3 py-2"
                name="username"
                autoComplete="off"
                spellCheck={false}
                maxLength={30}
              />
              <button
                disabled={!username}
                type="submit"
                className="disabled:bg-info-soft disabled:text-light-700 bg-info hover:bg-info-hover absolute inset-be-[calc((1/2*100%)-0.75rem)] right-3 h-6 cursor-pointer rounded-md px-1.5 text-[0.75rem] disabled:cursor-not-allowed"
              >
                Send Friend Request
              </button>
            </div>
            {!serverMessage && !serverErrors?.username && successMessage}
            {serverMessage && <p className="text-danger text-sm">{serverMessage}</p>}
            {serverErrors?.username && (
              <p className="text-danger text-sm">{serverErrors.username}</p>
            )}
          </div>
        </form>
      </div>

      <hr className="text-dark-500" />

      <div className="grid gap-1">
        <h4 className="text-xl font-semibold">Other Places to Make Friends</h4>
        <p>
          Don&apos;t have a username on hand? Check out our list of public groups that includes
          everything from gaming to cooking, music, anime and more.
        </p>
        <Link
          to={'/groups'}
          className="group bg-dark-900 border-dark-500 hover:bg-dark-700 mt-3 flex items-center gap-4 justify-self-start rounded-lg border px-3 py-2"
        >
          <AllGroupsIcon />

          <p className="text-lg font-medium">Explore Groups</p>

          <svg
            className="*:fill-light-700 group-hover:*:fill-light-900 ml-12 size-4"
            viewBox="-5.5 0 26 26"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M488.404 1207.36l-10.767-9.76a2.11 2.11 0 00-3.008 0 2.117 2.117 0 000 3l9.256 8.4-9.256 8.4a2.117 2.117 0 000 3c.83.84 2.177.84 3.008 0l10.767-9.76c.45-.45.648-1.05.611-1.64a2.115 2.115 0 00-.611-1.64"
              transform="translate(-474 -1196)"
              stroke="none"
              strokeWidth={1}
              fillRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
