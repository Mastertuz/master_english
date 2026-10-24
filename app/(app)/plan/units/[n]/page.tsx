import { notFound } from "next/navigation";
import { UnitView } from "@/components/plan/UnitView";
import { loadCues } from "@/lib/study/cues";
import { unitByNumber } from "@/lib/study/units";

export default async function UnitPage({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const unit = unitByNumber(Number(n));
  if (!unit) notFound();

  return <UnitView unit={unit} cues={await loadCues(unit.n)} />;
}
