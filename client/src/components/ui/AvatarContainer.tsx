import { twMerge } from 'tailwind-merge';

interface AvatarContainerProps {
  avatarUrl: string;
  avatarColor?: string;
  alt?: string;
  onClick?: () => void;
  className?: string;
}

export default function AvatarContainer({
  avatarUrl,
  avatarColor = '#FFF',
  alt = '',
  onClick,
  className,
}: AvatarContainerProps) {
  return (
    <div
      className={twMerge(
        'size-12 flex-none overflow-hidden rounded-full text-transparent',
        className
      )}
      onClick={onClick}
      style={{ backgroundColor: avatarColor }}
    >
      <img className="size-full object-cover" src={avatarUrl ? avatarUrl : undefined} alt={alt} />
    </div>
  );
}
