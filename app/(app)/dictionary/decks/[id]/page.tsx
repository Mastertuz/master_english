import { notFound } from "next/navigation";
import { DeckView } from "@/components/dictionary/DeckView";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { deckById, deckWordKey } from "@/lib/word-decks";

export default async function DeckPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deck = deckById(id);
  if (!deck) notFound();

  const user = await requireUser();
  const keys = deck.items.map((item) => deckWordKey(item.english));
  const words = await prisma.word.findMany({
    where: { userId: user.id, english: { in: keys } },
    select: { english: true },
  });

  return <DeckView deck={deck} added={words.map((word) => word.english)} />;
}
