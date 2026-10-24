import { WritingHub } from "@/components/plan/WritingHub";
import { allWriting } from "@/lib/study/writing";

export default function WritingPage() {
  return <WritingHub tasks={allWriting()} />;
}
