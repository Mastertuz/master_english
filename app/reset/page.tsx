import { ResetForm } from "@/components/auth/ResetForm";

export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-12">
      <div className="card rise w-full max-w-md p-6 sm:p-8">
        <ResetForm email={email} />
      </div>
    </main>
  );
}
