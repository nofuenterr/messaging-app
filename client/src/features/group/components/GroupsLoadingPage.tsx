import ArticleTitleContainer from '../../../components/ui/ContentWrapper/_components/_components/ArticleTitleContainer';
import ArticleWrapper from '../../../components/ui/ContentWrapper/_components/ArticleWrapper';
import ContentWrapper from '../../../components/ui/ContentWrapper/ContentWrapper';

export default function GroupsLoadingPage({ title }: { title: string }) {
  return (
    <ContentWrapper>
      <ArticleWrapper>
        <ArticleTitleContainer title={title} />

        <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4 overflow-y-auto">
          <div className="bg-dark-500 border-dark-400 h-80 w-full rounded-lg border"></div>
          <div className="bg-dark-500 border-dark-400 h-80 w-full rounded-lg border"></div>
          <div className="bg-dark-500 border-dark-400 h-80 w-full rounded-lg border"></div>
          <div className="bg-dark-500 border-dark-400 h-80 w-full rounded-lg border"></div>
          <div className="bg-dark-500 border-dark-400 h-80 w-full rounded-lg border"></div>
          <div className="bg-dark-500 border-dark-400 h-80 w-full rounded-lg border"></div>
          <div className="bg-dark-500 border-dark-400 h-80 w-full rounded-lg border"></div>
          <div className="bg-dark-500 border-dark-400 h-80 w-full rounded-lg border"></div>
        </div>
      </ArticleWrapper>
    </ContentWrapper>
  );
}
