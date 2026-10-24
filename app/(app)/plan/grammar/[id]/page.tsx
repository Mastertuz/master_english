import { notFound } from "next/navigation";
import { DrillRunner } from "@/components/plan/DrillRunner";
import { DRILLS } from "@/lib/study/drills";

export default async function DrillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = DRILLS.findIndex((drill) => drill.id === id);
  if (index < 0) notFound();

  return <DrillRunner drill={DRILLS[index]} nextId={DRILLS[index + 1]?.id} />;
}
