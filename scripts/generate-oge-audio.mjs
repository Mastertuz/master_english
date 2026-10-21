// Озвучка вариантов ОГЭ синтезатором речи macOS (say) + ffmpeg.
// Запуск: node scripts/generate-oge-audio.mjs variant-2
// Берёт тексты из lib/oge/audio/<id>.script.json, пишет:
//   public/audio/oge/<id>/listening.mp3, speaking.mp3
//   lib/oge/audio/<id>.marks.json — таймкоды для кода варианта
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const id = process.argv[2];
if (!id) throw new Error("Укажите вариант: node scripts/generate-oge-audio.mjs variant-2");

const root = new URL("..", import.meta.url).pathname;
const script = JSON.parse(readFileSync(join(root, `lib/oge/audio/${id}.script.json`), "utf8"));
const outDir = join(root, `public/audio/oge/${id}`);
mkdirSync(outDir, { recursive: true });

const NARRATOR = "Daniel";
const RATE = "165";
const tmp = mkdtempSync(join(tmpdir(), "oge-tts-"));
let counter = 0;

function run(cmd, args) {
  const result = spawnSync(cmd, args, { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`${cmd} ${args.join(" ")}\n${result.stderr}`);
  return result.stdout;
}

function duration(file) {
  return Number(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).trim());
}

/** Одна дорожка: список wav-файлов и текущее время */
function timeline() {
  const parts = [];
  let t = 0;
  const push = (file) => {
    const start = t;
    parts.push(file);
    t += duration(file);
    return start;
  };
  return {
    get t() {
      return t;
    },
    speak(voice, text) {
      const base = join(tmp, `s${++counter}`);
      run("say", ["-v", voice, "-r", RATE, "-o", `${base}.aiff`, text]);
      run("ffmpeg", ["-y", "-loglevel", "error", "-i", `${base}.aiff`, "-ar", "22050", "-ac", "1", `${base}.wav`]);
      return push(`${base}.wav`);
    },
    narrate(text) {
      return this.speak(NARRATOR, text);
    },
    silence(seconds) {
      const file = join(tmp, `p${++counter}.wav`);
      run("ffmpeg", ["-y", "-loglevel", "error", "-f", "lavfi", "-i", "anullsrc=r=22050:cl=mono", "-t", String(seconds), "-c:a", "pcm_s16le", file]);
      return push(file);
    },
    save(name) {
      const list = join(tmp, `${name}.txt`);
      writeFileSync(list, parts.map((file) => `file '${file}'`).join("\n"));
      run("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", list, "-c:a", "libmp3lame", "-b:a", "40k", "-ar", "22050", "-ac", "1", join(outDir, `${name}.mp3`)]);
    },
  };
}

const voiceOf = (who) => script.voices[who] ?? NARRATOR;
const round = (value) => Math.round(value * 10) / 10;

/** Текст из реплик или монолог */
function playText(tl, item) {
  if (item.lines) {
    for (const line of item.lines) {
      tl.speak(voiceOf(line.who), line.text);
      tl.silence(0.5);
    }
  } else {
    tl.speak(item.voice, item.text);
  }
  tl.silence(2.5);
}

/* ─────────────── Аудирование ─────────────── */

const L = timeline();
const listening = { marks: [], part1: {}, part5: {}, part6: {} };

// Задания 1–4
const p1 = L.t;
listening.marks.push({ label: "Задания 1–4", at: 0 });
L.narrate("Tasks one to four. You will hear four short texts, marked A, B, C and D. In tasks one to four, choose the correct answer: one, two or three. You will hear the recording twice. You have thirty seconds to look through the tasks.");
L.silence(30);
L.narrate("Now we are ready to start.");
L.silence(1.5);
const part1Codes = [{ label: "Инструкция", at: p1 }];
const part1Starts = [];
script.part1.forEach((item) => {
  const at = L.t;
  part1Starts.push(at);
  part1Codes.push({ label: item.title, at });
  L.narrate(`${item.title}.`);
  L.silence(0.6);
  playText(L, item);
});
L.narrate("You have twenty seconds to complete the task.");
L.silence(20);
L.narrate("Now you will hear the texts again.");
L.silence(1.5);
script.part1.forEach((item) => {
  part1Codes.push({ label: `${item.title} · 2-й раз`, at: L.t });
  L.narrate(`${item.title}.`);
  L.silence(0.6);
  playText(L, item);
});
L.narrate("This is the end of the task. You now have twenty seconds to check your answers.");
L.silence(20);
listening.part1 = { timecodes: part1Codes, starts: part1Starts };

// Задание 5
const p5 = L.t;
listening.marks.push({ label: "Задание 5", at: p5 });
L.narrate("Task five. You are preparing a thematic radio programme with statements of five different people, marked A, B, C, D and E. Match each statement with the heading from the list, one to six. Use each heading only once. There is one extra heading. You will hear the recording twice. You have twenty seconds to look through the task.");
L.silence(20);
L.narrate("Now we are ready to start.");
L.silence(1.5);
const part5Codes = [{ label: "Инструкция", at: p5 }];
const presenterAt = L.t;
part5Codes.push({ label: "Ведущий", at: presenterAt });
L.speak(voiceOf("Presenter"), script.part5.presenter);
L.silence(1.5);
const part5Starts = [];
script.part5.speakers.forEach((item) => {
  const at = L.t;
  part5Starts.push(at);
  part5Codes.push({ label: item.title, at });
  L.narrate(`${item.title}.`);
  L.silence(0.5);
  playText(L, item);
});
L.narrate("You have twenty seconds to complete the task.");
L.silence(20);
L.narrate("Now you will hear the texts again.");
L.silence(1.5);
script.part5.speakers.forEach((item) => {
  part5Codes.push({ label: `${item.title.replace("Speaker ", "")} · 2-й раз`, at: L.t });
  L.narrate(`${item.title}.`);
  L.silence(0.5);
  playText(L, item);
});
L.narrate("This is the end of the task. You now have twenty seconds to check your answers.");
L.silence(20);
listening.part5 = { timecodes: part5Codes, presenterAt, starts: part5Starts };

// Задания 6–11
const p6 = L.t;
listening.marks.push({ label: "Задания 6–11", at: p6 });
L.narrate("Tasks six to eleven. You are helping your friend, a young radio journalist, to analyse an interview he has prepared for a radio programme. Listen to the recording and fill in the table. You may write no more than one word, without articles, from the text you hear. Write numbers in words. You will hear the recording twice. You have thirty seconds to look through the tasks.");
L.silence(30);
L.narrate("Now we are ready to start.");
L.silence(1.5);
const interview = () => {
  for (const line of script.part6) {
    L.speak(voiceOf(line.who), line.text);
    L.silence(0.5);
  }
  L.silence(1.5);
};
const interviewAt = L.t;
interview();
L.narrate("You have twenty seconds to complete the task.");
L.silence(20);
L.narrate("Now you will hear the text again.");
L.silence(1.5);
const secondAt = L.t;
interview();
L.narrate("This is the end of the task. You now have twenty seconds to check your answers.");
L.silence(20);
const endAt = L.t;
L.narrate("This is the end of the listening test.");
listening.part6 = {
  timecodes: [
    { label: "Инструкция", at: p6 },
    { label: "Интервью", at: interviewAt },
    { label: "Интервью · 2-й раз", at: secondAt },
    { label: "Конец записи", at: endAt },
  ],
  transcriptAt: interviewAt,
};
L.save("listening");

/* ─────────────── Устная часть: телефонный опрос ─────────────── */

const S = timeline();
const assistant = voiceOf("Assistant");
const questions = [];
script.speaking.questions.forEach((question, index) => {
  const start = S.t;
  if (index === 0) {
    S.speak(assistant, script.speaking.intro);
    S.silence(0.5);
  }
  S.speak(assistant, question);
  questions.push({ start, end: S.t + 0.2 });
  S.silence(40);
});
const outroStart = S.t;
S.speak(assistant, script.speaking.outro);
const speaking = { questions, outro: { start: outroStart, end: S.t + 0.2 } };
S.save("speaking");

/* ─────────────── Таймкоды ─────────────── */

const roundDeep = (value) => {
  if (typeof value === "number") return round(value);
  if (Array.isArray(value)) return value.map(roundDeep);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, roundDeep(item)]));
  return value;
};

writeFileSync(
  join(root, `lib/oge/audio/${id}.marks.json`),
  JSON.stringify(roundDeep({ listening, speaking }), null, 2) + "\n",
);
rmSync(tmp, { recursive: true, force: true });
console.log(`${id}: готово, запись ${round(L.t / 60)} мин, опрос ${round(S.t / 60)} мин`);
