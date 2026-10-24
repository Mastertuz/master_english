import { notFound } from "next/navigation";
import { VideoTaskView } from "@/components/plan/VideoTaskView";
import { videoById } from "@/lib/study/videos";

export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const video = videoById(id);
  if (!video) notFound();

  return <VideoTaskView video={video} week={video.week} />;
}
