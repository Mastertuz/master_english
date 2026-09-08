import { ForgotForm } from "@/components/auth/ForgotForm";

export default function ForgotPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-12">
      <div className="card rise w-full max-w-md p-6 sm:p-8">
        <ForgotForm />
      </div>
    </main>
  );
}
