import marks from "./audio/variant-3.marks.json";
import script from "./audio/variant-3.script.json";
import {
  choice,
  COMMON,
  dialogueText,
  gap,
  matching,
  NO_STRATEGY,
  statement,
  timedTranscripts,
  wordRow,
  type AudioMarks,
  type AudioScript,
} from "./book";
import type { OgeVariant } from "./types";

const audio = marks as AudioMarks;
const text = script as AudioScript;

/**
 * Вариант 3 из сборника «ОГЭ. Типовые экзаменационные варианты».
 * Задания, ключи и тексты записей — из книги; запись озвучена нейросетью.
 */
export const variant3: OgeVariant = {
  id: "variant-3",
  title: "Вариант 3",
  subtitle:
    "Типовой вариант из сборника: письменная часть (аудирование, чтение, грамматика и лексика, письмо) и устная часть. Запись озвучена нейросетевым голосом, пояснений к ответам нет",
  origin: { synthAudio: true, explained: false },
  rules: {},

  listening: {
    audioUrl: "/audio/oge/variant-3/listening.mp3",
    marks: audio.listening.marks,

    part1: {
      timecodes: audio.listening.part1.timecodes,
      intro: COMMON.listening.part1Intro,
      questions: [
        choice(1, "Text A. What do you need to win the first prize?", [
          "To know how to write fiction stories.",
          "To know the history of the bookshop.",
          "To have a card of a loyal customer.",
        ], "2"),
        choice(2, "Text B. What colour is Mia’s dog?", ["Black.", "Grey.", "Golden."], "1"),
        choice(3, "Text C. Why did the puppy get unwell? The puppy...", [
          "was bored and neglected.",
          "had eaten something wrong.",
          "was bitten by an insect.",
        ], "3"),
        choice(4, "Text D. What foreign language does Ann speak?", ["Spanish.", "Italian.", "French."], "3"),
      ],
      transcripts: timedTranscripts(text.part1, audio.listening.part1.starts),
      strategy: NO_STRATEGY,
    },

    part5: {
      ...matching({
        n: 5,
        intro: COMMON.listening.part5Intro,
        letters: ["A", "B", "C", "D", "E"],
        options: [
          "School rules",
          "After-school activities",
          "School friends",
          "School traditions",
          "School parties",
          "School vacations",
        ],
        answer: "46312",
        extraWhy: "Ни один из говорящих не рассказывает о школьных вечеринках.",
      }),
      timecodes: audio.listening.part5.timecodes,
      transcripts: [
        {
          title: "Ведущий",
          at: audio.listening.part5.presenterAt,
          text: `Presenter: ${text.part5.presenter}`,
        },
        ...timedTranscripts(text.part5.speakers, audio.listening.part5.starts),
      ],
      strategy: NO_STRATEGY,
    },

    part6: {
      timecodes: audio.listening.part6.timecodes,
      transcriptAt: audio.listening.part6.transcriptAt,
      intro: COMMON.listening.part6Intro,
      rows: [
        wordRow(6, "Country of birth", "Scotland"),
        wordRow(7, "Favourite season", "spring"),
        wordRow(8, "Current job", "gardener"),
        wordRow(9, "Age of the respondent (… years old)", "seventy"),
        wordRow(10, "Hobby", "fishing"),
        wordRow(11, "Favourite food", "pie;pies"),
      ],
      transcript: dialogueText(text.part6),
      strategy: NO_STRATEGY,
    },
  },

  reading: {
    part12: {
      ...matching({
        n: 12,
        intro: COMMON.reading.part12Intro,
        letters: ["A", "B", "C", "D", "E", "F"],
        options: [
          "Where do penguins naturally live?",
          "What makes penguins so special in the world of birds?",
          "How long does it take a baby penguin to grow into an adult bird?",
          "What is a penguin’s basic diet?",
          "What animals are penguins’ natural enemies?",
          "Are penguins endangered birds that need protection?",
          "Can a penguin be a good pet that is easy to keep?",
        ],
        answer: "257146",
        extraWhy: "Ни в одном тексте не сказано, за какое время птенец становится взрослым пингвином.",
      }),
      texts: [
        {
          letter: "A",
          text: "No matter where you live — in Europe, Asia, or Australia — you are likely to see these birds in a local zoo. Penguins are among the most unusual birds on the Earth because they cannot fly, yet they are excellent swimmers. Their bodies are perfectly adapted for cold water, and their wings work like strong flippers. It looks as if they just fly underwater! Penguins usually lay only one egg. While other birds prefer to raise their babies in a nice and warm environment, penguin chicks hatch into an icy world.",
        },
        {
          letter: "B",
          text: "Penguins live in colonies and protect each other. Life in the ocean can be dangerous, especially when they leave the safety of their colonies in search of food. In the water, they may be hunted by leopard seals, sharks, and killer whales. On the ice, eggs and chicks are sometimes attacked by large birds such as skuas. For safety, penguins usually travel and hunt together.",
        },
        {
          letter: "C",
          text: "Although penguins look cute and friendly in films and zoos, they do not enjoy people’s company very much. As they naturally live in colonies, they suffer when they are alone. It’s very difficult to keep penguins in captivity, as they need large pools, cold temperatures, and plenty of fresh fish every day. That is why, in many countries, people are not allowed to own penguins. These birds are protected by law.",
        },
        {
          letter: "D",
          text: "Penguins spend most of their lives close to the ocean, where they can easily find food and safe nesting areas. Different species live in different climates, from the icy shores of Antarctica to the warmer coasts of Africa and South America. Some penguins even survive near the equator on the Galapagos Islands. In nature, penguins are found only in the Southern Hemisphere.",
        },
        {
          letter: "E",
          text: "The ocean provides penguins with nearly everything they need to survive. They are skilled hunters that dive deep underwater in search of fish, squid, and krill. Depending on the species and the region, their habitual food may change slightly during the year. Their strong bodies and ability to swim fast help them catch prey quickly. This enables penguins to survive mainly on seafood.",
        },
        {
          letter: "F",
          text: "Today, scientists are worried about the future of many penguin species. Pollution, climate change, melting ice, and overfishing are destroying penguins’ habitats and reducing their food supplies. As a result, many penguins are now considered endangered and need human protection. Environmental groups are trying to protect breeding areas and create safe natural reserves for these birds.",
        },
      ],
      strategy: NO_STRATEGY,
    },

    part13: {
      intro: COMMON.reading.part13Intro,
      title: "School Project",
      paragraphs: [
        "It was a lunch break. Mila was sitting on a bench in the school yard, aimlessly scrolling on her phone. She looked worried. Her lunchbox was still closed, with the food untouched.",
        "“Hey, Mila, aren’t you hungry? Need help with your sandwich?” her classmate Dani turned up from nowhere, happily chewing something. Then his face changed, “Hey, Mila, what’s wrong? You look so worried.”",
        "“It’s all about the project... remember? It’s due tomorrow, but I haven’t written a line! I haven’t got a single idea, nothing comes up...”",
        "Dani looked puzzled, trying to comprehend her words and then laughed. “Oh, I got it! All the fuss is about the project on extraordinary scientists, isn’t it? I’ve done it — easy job!”",
        "“Easy for you! You are a fan of physics and you can choose any physicist to write about. Any of them is extraordinary! But what shall I do?” Mila sounded almost like crying.",
        "“Easy-easy... I know that you don’t like physics. Why don’t you write about someone from some other field of study? The field you like?”",
        "“I like biology. But I can’t write about a biologist or ecologist or a wildlife researcher. They don’t count as scientists. All scientists are physicists!” Mila’s voice trembled but Dani shook his head in disagreement.",
        "“Wrong. Biology is a science. And I think I know who you should write about. I recently encountered one name online. Ivan Michurin. Just type the name in and see the results.”",
        "“Michurin? I’ve never heard the name.” Mila did a quick search, “Oh, yeah, I’ve found — Ivan Michurin? Was he a chemist?”",
        "“Not exactly,” Dani replied. “He was a geneticist and worked mostly with plants.”",
        "“This sounds more like biology,” Mila said, thinking. “They write that Michurin is best known for his work in plant breeding. Look, he created more than 300 new varieties of fruit plants. His apples, pears, cherries and berries were stronger and more productive than the original plants. He even created varieties that could live in the northern regions of Russia and survive through harsh Russian winters. Amazing... It’s freezing cold there, isn’t it?”",
        "“Absolutely!” Dani was happy to see Mila’s enthusiasm. “Michurin worked a lot on plant hybridization — crossing different species to get better results. He improved the quality, taste, and resistance of plants.”",
        "“It sounds exciting! I’ll probably consider a career in biology or genetics myself. What would you say? Where did Michurin study, by the way?” Mila was genuinely interested in the issue, and Dani was glad that it was he who triggered the process.",
        "“Michurin didn’t go to any university,” he replied, “He studied and researched all by himself. People considered him strange and didn’t believe in his ideas. But the results convinced all the sceptics after all.”",
      ],
      statements: [
        statement(13, "Mila and Dani usually had sandwiches for school lunch.", "3"),
        statement(14, "Dani hasn’t completed his project work yet.", "2"),
        statement(15, "Mila prefers biology to physics.", "1"),
        statement(16, "Mila knew nothing about Michurin’s contribution to science before Dani mentioned that.", "1"),
        statement(17, "According to Mila’s information, Michurin managed to create better versions of the original plants.", "1"),
        statement(18, "According to the text, no one except for Michurin has ever used the method of hybridization.", "3"),
        statement(19, "Dani said that Michurin studied biology and genetics at university.", "2"),
      ],
      strategy: NO_STRATEGY,
    },
  },

  grammar: {
    part20: {
      intro: COMMON.grammar.part20Intro,
      guideTasks: {
        pronoun: [20],
        noun: [22],
        numeral: [24],
        tenses: [21, 23, 26, 27, 28],
        reported: [25],
      },
      lines: [
        gap(20, "“Are you saying you really believe they exist?” There were a few books about aliens on Tina’s desk, and Neil was holding one of", "THEY", ".", "them"),
        gap(21, "“Put it back!” Tina didn’t like Neil’s remark. He was Tina’s cousin and", "STAY", "with her family that weekend while his parents were on holiday.", "was staying;stayed"),
        gap(22, "“Easy, easy... I didn’t mean any offence. I also was into alien", "STORY", "when I was your age.", "stories"),
        gap(23, "One day, I even", "DRAW", "nine little green aliens on the wall in my bedroom.", "drew"),
        gap(24, "I did it right before my", "NINE", "birthday.", "ninth"),
        gap(25, "And a day before my birthday, I told my parents that the aliens", "COME", "to my party and asked for a special cake, with green creatures on the top, just to make them feel welcome,” Neil smiled at his memories, and Tina smiled too. “They exist. There must be other planets like ours somewhere out there.”", "would come"),
        gap(26, "“Well...” Neil was carefully choosing the words. He", "NOT WANT", "to hurt Tina’s feelings again.", "did not want;didn’t want"),
        gap(27, "“Scientists have been looking for signs of life for a long time. But they", "NOT FIND", "anything yet.”", "have not found;haven’t found"),
        gap(28, "“Which doesn’t prove aliens do not exist!” Tina continued to insist. “They may be invisible! Maybe they", "LOOK", "at us right now, but we can’t see them.”", "are looking;’re looking"),
      ],
      strategy: NO_STRATEGY,
    },
    part29: {
      intro: COMMON.grammar.part29Intro,
      lines: [
        gap(29, "Have you ever been to Kamchatka? The peninsula is one of the most", "USUAL", "places in Russia.", "unusual"),
        gap(30, "The", "POPULATE", "of the region is small, and nature is pure and undisturbed there.", "population"),
        gap(31, "Kamchatka is known for its volcanoes, some of which are still active and", "DANGER", ".", "dangerous"),
        gap(32, "Tourists who visit Kamchatka can enjoy hiking and climbing. The routes may be difficult but very exciting. The beauty of the region attracts people who are looking for real adventure. Experienced guides help each", "VISIT", "feel comfortable and safe.", "visitor"),
        gap(33, "They make their trips not only enjoyable but", "EDUCATION", ", too.", "educational"),
        gap(34, "The guides", "PROUD", "highlight the fact that the region is home to the Kamchatka brown bear — the largest brown bear in the world.", "proudly"),
      ],
      strategy: NO_STRATEGY,
    },
  },

  writing: {
    n: 35,
    intro: COMMON.writing.intro,
    email: {
      from: "Julia@mail.uk",
      to: "Russian_friend@oge.ru",
      subject: "Free time",
      body: [
        "I’m looking forward to the coming weekend. Last week was very busy: lots of homework and a Science project I had to finish…",
        "…What is your typical school day like? How much time does it take you to do your homework? What do you like to do in your free time?…",
      ],
    },
    task: [
      "Write a message to Julia and answer her 3 questions.",
      "Write 100–120 words.",
      "Remember the rules of email writing.",
    ],
    criteria: COMMON.writing.criteria,
    rules: COMMON.writing.rules,
    plan: [
      "Обращение: Dear Julia, (отдельная строка, запятая)",
      "Благодарность: Thanks for your email! I was glad to hear from you.",
      "Абзац с ответом на вопрос 1 — какой у вас обычный школьный день",
      "Абзац с ответом на вопрос 2 — сколько времени занимает домашнее задание",
      "Абзац с ответом на вопрос 3 — что вы любите делать в свободное время",
      "Надежда на контакты: Write back soon!",
      "Завершающая фраза: Best wishes, (отдельная строка, запятая)",
      "Подпись — только имя",
    ],
    template: COMMON.writing.template,
    sample: "",
    templateSample: "",
    strategy: NO_STRATEGY,
  },

  speaking: {
    audioUrl: "/audio/oge/variant-3/speaking.mp3",

    task1: {
      ...COMMON.speaking.task1,
      text: "The word glamping is made with the words glamorous and camping and means comfortable camping. It appeared in dictionaries in 2016. Lots of people enjoy spending their holidays in nature, but they don’t always want to give up the comfort of a hotel. With glamping, it’s possible to have both. During the day, there are plenty of fun activities to make any holidaymaker feel like a brave explorer. They can go horse riding, sailing or climbing, but in the evening, they come back to their cosy cottage with a warm shower, good food, and Wi-Fi. Is glamping popular in Russia? Of course, it is. About 400 glamping sites near beautiful lakes and mountains have appeared lately.",
      hardWords: [],
      strategy: NO_STRATEGY,
    },

    task2: {
      ...COMMON.speaking.task2,
      introText: `Electronic assistant: ${text.speaking.intro}`,
      outroText: `Electronic assistant: ${text.speaking.outro}`,
      questions: text.speaking.questions.map((question, index) => ({
        text: question,
        start: audio.speaking.questions[index].start,
        end: audio.speaking.questions[index].end,
        sample: "",
      })),
      outro: audio.speaking.outro,
      strategy: NO_STRATEGY,
    },

    task3: {
      ...COMMON.speaking.task3,
      instruction:
        "Task 3. You are going to give a talk about your hometown. You will have to start in 1.5 minutes and speak for not more than 2 minutes (10–12 sentences).",
      points: [
        "what your hometown is famous for;",
        "which season your hometown looks most beautiful in;",
        "what place in your hometown you like most, and why;",
        "what your attitude to your hometown is.",
      ],
      sample: "",
      strategy: NO_STRATEGY,
    },
  },
};
