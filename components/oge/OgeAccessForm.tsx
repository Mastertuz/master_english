import { setOgeAccessAction } from "@/app/actions/oge";
import { SubmitButton } from "@/components/ui/SubmitButton";

/** Открыть или закрыть ученику вкладку «ОГЭ» */
export function OgeAccessForm({
  userId,
  access,
}: {
  userId: string;
  access: boolean;
}) {
  return (
    <form action={setOgeAccessAction}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="access" value={access ? "0" : "1"} />
      <SubmitButton
        pendingLabel="…"
        className={access ? "btn-ghost btn-sm" : "btn-primary btn-sm"}
      >
        {access ? "Закрыть доступ к ОГЭ" : "Открыть доступ к ОГЭ"}
      </SubmitButton>
    </form>
  );
}
