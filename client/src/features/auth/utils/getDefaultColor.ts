import { redditColors } from '../data/redditAvatarColors';

export default function getDefaultColor(): string {
  const randomIndex = Math.floor(Math.random() * redditColors.length);
  const color = redditColors.at(randomIndex);
  return color ? color : '#FF4500';
}
