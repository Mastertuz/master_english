export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-56 animate-pulse rounded-xl bg-ink-200/70" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-2xl bg-ink-200/50"
          />
        ))}
      </div>
    </div>
  );
}
