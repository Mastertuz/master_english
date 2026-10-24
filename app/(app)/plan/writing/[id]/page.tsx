import { notFound } from "next/navigation";
import { WritingTaskView } from "@/components/plan/WritingTaskView";
import { writingById } from "@/lib/study/writing";

export default async function WritingTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = writingById(id);
  if (!task) notFound();

  return <WritingTaskView task={task} />;
}
