export function getReplyLabel(
  currentUserId: number,
  authorId: number,
  repliedAuthorId: number,
  authorName: string,
  repliedAuthorName: string
): string {
  const isSelfReply = authorId === repliedAuthorId;
  const currentUserIsAuthor = currentUserId === authorId;
  const currentUserIsReplied = currentUserId === repliedAuthorId;

  if (isSelfReply) {
    return currentUserIsAuthor ? 'You replied to yourself' : `${authorName} replied to themselves`;
  }
  if (currentUserIsAuthor) return `You replied to ${repliedAuthorName}`;
  if (currentUserIsReplied) return `${authorName} replied to you`;
  return `${authorName} replied to ${repliedAuthorName}`;
}
