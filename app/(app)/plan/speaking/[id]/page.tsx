import { notFound } from "next/navigation";
import { SpeakingTaskView } from "@/components/plan/SpeakingTaskView";
import { SPEAKING_TASKS } from "@/lib/study/speaking";

export default async function SpeakingTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = SPEAKING_TASKS.findIndex((task) => task.id === id);
  if (index < 0) notFound();

  const task = SPEAKING_TASKS[index];
  // Соседние задания той же группы
  const same = SPEAKING_TASKS.filter((item) => item.group === task.group);
  const position = same.findIndex((item) => item.id === task.id);

  return (
    <SpeakingTaskView
      task={task}
      prevId={same[position - 1]?.id}
      nextId={same[position + 1]?.id}
    />
  );
}
