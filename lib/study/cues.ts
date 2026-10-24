/** Реплика записи: начало и конец в секундах, говорящий, текст */
export type Cue = [start: number, end: number, speaker: string, text: string];

export type UnitCues = Record<string, Cue[]>;

/** Реплики грузим по юнитам, чтобы страница не тянула все субтитры сразу */
export async function loadCues(unit: number): Promise<UnitCues> {
  switch (unit) {
    case 1:
      return (await import("./cues/unit-1.json")).default as unknown as UnitCues;
    case 2:
      return (await import("./cues/unit-2.json")).default as unknown as UnitCues;
    case 3:
      return (await import("./cues/unit-3.json")).default as unknown as UnitCues;
    case 4:
      return (await import("./cues/unit-4.json")).default as unknown as UnitCues;
    case 5:
      return (await import("./cues/unit-5.json")).default as unknown as UnitCues;
    case 6:
      return (await import("./cues/unit-6.json")).default as unknown as UnitCues;
    case 7:
      return (await import("./cues/unit-7.json")).default as unknown as UnitCues;
    case 8:
      return (await import("./cues/unit-8.json")).default as unknown as UnitCues;
    case 9:
      return (await import("./cues/unit-9.json")).default as unknown as UnitCues;
    case 10:
      return (await import("./cues/unit-10.json")).default as unknown as UnitCues;
    default:
      return {};
  }
}
