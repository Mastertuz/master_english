import Link from "next/link";
import { notFound } from "next/navigation";
import { StrategyCard } from "@/components/oge/Razbor";
import { TrainingBlock } from "@/components/oge/Training";
import { OGE_VARIANTS, requireOgeUser } from "@/lib/oge";
import {
  getTrainingGroup,
  TRAINING_GROUPS,
  trainingStrategy,
  trainingView,
} from "@/lib/oge/training";

export default async function OgeTrainingPage({
  params,
}: {
  params: Promise<{ group: string }>;
}) {
  await requireOgeUser();
  const { group: id } = await params;

  const group = getTrainingGroup(id);
  if (!group) notFound();

  const strategy = OGE_VARIANTS[0] ? trainingStrategy(OGE_VARIANTS[0], group) : null;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/oge" prefetch className="text-[13.5px] text-brand-600 hover:text-brand-700">
          ← ОГЭ
        </Link>
        <h1 className="page-title mt-1">
          Тренировка · задания {group.tasks}
        </h1>
        <p className="mt-1 text-[14.5px] text-ink-500">
          {group.section} · {group.title}. {group.description}. Ответы проверяются
          сразу, после проверки откроются верные ответы и разбор.
        </p>
      </div>

      {/* Переход между группами без возврата на страницу ОГЭ */}
      <nav className="flex flex-wrap gap-1.5">
        {TRAINING_GROUPS.map((item) => (
          <Link
            key={item.id}
            href={`/oge/training/${item.id}`}
            prefetch
            className={`chip ${
              item.id === group.id
                ? "bg-brand-600 text-white"
                : "bg-ink-100 text-ink-700 hover:bg-ink-200"
            }`}
          >
            {item.tasks}
          </Link>
        ))}
      </nav>

      {strategy ? (
        <details className="card p-5">
          <summary className="cursor-pointer text-[15px] font-semibold text-ink-900">
            💡 Как выполнять задания {group.tasks}
          </summary>
          <div className="mt-4">
            <StrategyCard strategy={strategy} />
          </div>
        </details>
      ) : null}

      <div className="space-y-5">
        {OGE_VARIANTS.map((variant) => (
          <TrainingBlock
            key={variant.id}
            variantId={variant.id}
            variantTitle={variant.title}
            groupId={group.id}
            tasks={group.tasks}
            points={group.points}
            view={trainingView(variant, group)}
          />
        ))}
      </div>
    </div>
  );
}
