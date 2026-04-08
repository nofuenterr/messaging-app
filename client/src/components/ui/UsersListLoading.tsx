import ArticleTitleContainer from './ContentWrapper/_components/_components/ArticleTitleContainer';
import ArticleWrapper from './ContentWrapper/_components/ArticleWrapper';
import ContentWrapper from './ContentWrapper/ContentWrapper';

export default function UsersListLoading({ title }: { title: string }) {
  return (
    <ContentWrapper>
      <ArticleWrapper>
        <ArticleTitleContainer title={title} />
        <div className="grid gap-4 overflow-y-auto">
          <div className="*:border-dark-400 bg-dark-500 h-15 w-full rounded-lg px-4 py-3 not-last:*:border-b"></div>
          <div className="*:border-dark-400 bg-dark-500 h-15 w-full rounded-lg px-4 py-3 not-last:*:border-b"></div>
          <div className="*:border-dark-400 bg-dark-500 h-15 w-full rounded-lg px-4 py-3 not-last:*:border-b"></div>
          <div className="*:border-dark-400 bg-dark-500 h-15 w-full rounded-lg px-4 py-3 not-last:*:border-b"></div>
          <div className="*:border-dark-400 bg-dark-500 h-15 w-full rounded-lg px-4 py-3 not-last:*:border-b"></div>
          <div className="*:border-dark-400 bg-dark-500 h-15 w-full rounded-lg px-4 py-3 not-last:*:border-b"></div>
          <div className="*:border-dark-400 bg-dark-500 h-15 w-full rounded-lg px-4 py-3 not-last:*:border-b"></div>
          <div className="*:border-dark-400 bg-dark-500 h-15 w-full rounded-lg px-4 py-3 not-last:*:border-b"></div>
        </div>
      </ArticleWrapper>
    </ContentWrapper>
  );
}
