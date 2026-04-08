import XIcon from '../icons/XIcon';

import IconButton from './IconButton';

export default function DialogCloseButton() {
  return (
    <IconButton
      ariaLabel="Close"
      className="hover:*:stroke-light-900 hover:bg-dark-400 hover:border-dark-300 absolute top-3 right-3 border border-transparent bg-transparent p-3"
    >
      <XIcon className="stroke-light-500" />
    </IconButton>
  );
}
