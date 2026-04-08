export default function Error({ message = 'An error has occured' }: { message?: string }) {
  return (
    <main className="place-self-center">
      <h1 className="text-2xl font-semibold text-balance">{message}</h1>
    </main>
  );
}
