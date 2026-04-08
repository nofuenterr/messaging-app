export function getBorderRadius(
  isUser: boolean,
  isChainedAbove: boolean, // same user message directly above, no breaks
  isChainedBelow: boolean // same user message directly below, no breaks
): string {
  if (isUser) {
    if (isChainedAbove && isChainedBelow) return '32px 4px 4px 32px';
    if (isChainedAbove) return '32px 4px 32px 32px'; // last in chain
    if (isChainedBelow) return '32px 32px 4px 32px'; // first in chain
  } else {
    if (isChainedAbove && isChainedBelow) return '4px 32px 32px 4px';
    if (isChainedAbove) return '4px 32px 32px 32px';
    if (isChainedBelow) return '32px 32px 32px 4px';
  }
  return '32px'; // standalone
}
