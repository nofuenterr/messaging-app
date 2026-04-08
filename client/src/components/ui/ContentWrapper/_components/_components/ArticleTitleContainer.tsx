interface ArticleTitleContainerProps {
  title: string;
}

export default function ArticleTitleContainer({ title }: ArticleTitleContainerProps) {
  return (
    <div className="bg-dark-500 self-start rounded-lg px-4 py-2">
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
  );
}
