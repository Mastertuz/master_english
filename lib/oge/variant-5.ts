import marks from "./audio/variant-5.marks.json";
import script from "./audio/variant-5.script.json";
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
import { withExplanations } from "./explain";
import { variant5Explained } from "./variant-5-explained";
import type { OgeVariant } from "./types";
import { WRITING_SAMPLES } from "./writing-samples";

const audio = marks as AudioMarks;
const text = script as AudioScript;

/**
 * Вариант 5 из сборника «ОГЭ. Типовые экзаменационные варианты».
 * Задания, ключи и тексты записей — из книги; запись озвучена нейросетью, разбор — variant-5-explained.ts.
 */
const variant5Base: OgeVariant = {
  id: "variant-5",
  title: "Вариант 5",
  subtitle:
    "Типовой вариант из сборника: письменная часть (аудирование, чтение, грамматика и лексика, письмо) и устная часть. Запись озвучена нейросетевым голосом, пояснений к ответам нет",
  origin: { synthAudio: true, explained: false },
  rules: {},

  listening: {
    audioUrl: "/audio/oge/variant-5/listening.mp3",
    marks: audio.listening.marks,

    part1: {
      timecodes: audio.listening.part1.timecodes,
      intro: COMMON.listening.part1Intro,
      questions: [
        choice(
          1,
          "Text A. When students have got a problem with Science, they need to apply...",
          ["to the secretary.", "to the headteacher.", "to the IT teacher."],
          "2",
        ),
        choice(
          2,
          "Text B. Emma asks Jane to help her with the homework in...",
          ["Maths.", "Web Design.", "Literature."],
          "1",
        ),
        choice(
          3,
          "Text C. Why did Jim come to the hospital?",
          [
            "To visit his younger brother.",
            "To see the doctor.",
            "To cheer up young patients.",
          ],
          "3",
        ),
        choice(
          4,
          "Text D. Lisa can’t buy the picture because...",
          [
            "it is very expensive.",
            "it is a museum’s exhibit.",
            "it has already been sold.",
          ],
          "2",
        ),
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
          "What to do in the exam classroom",
          "Why take exams",
          "How to prepare for exams",
          "Why have breaks",
          "What to revise first",
          "How to calm down",
        ],
        answer: "23641",
        extraWhy:
          "Ни один из говорящих не рассказывает, что нужно повторять в первую очередь.",
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
        wordRow(6, "Age of the respondent (… years old)", "nineteen"),
        wordRow(7, "Current job", "hairdresser"),
        wordRow(8, "The foreign language he/she is going to learn", "Spanish"),
        wordRow(9, "Favourite food", "pasta"),
        wordRow(10, "Day off", "Wednesday"),
        wordRow(11, "Hobby", "singing;vocal"),
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
          "How much of the Earth’s territory is occupied by deserts?",
          "What is the largest desert on the planet?",
          "How do deserts influence the climate on the Earth?",
          "How do oases appear in deserts?",
          "What man-made factors can enlarge the territory of the desert?",
          "Is it possible to develop agriculture in deserts?",
          "How long can a person survive in a desert?",
        ],
        answer: "273156",
        extraWhy:
          "Ни в одном тексте не сказано, как в пустынях появляются оазисы.",
      }),
      texts: [
        {
          letter: "A",
          text: "Even if you are not very good at geography, you will easily find the Sahara or the Gobi Desert on the map. Deserts are usually associated with heat and sand, but scientists define a desert as an extremely dry area that receives very little rain. Many people think that the Sahara Desert is the biggest in the world and feel surprised to find out that it isn’t! Antarctica, with its strong winds and freezing temperatures, is at the top of the list!",
        },
        {
          letter: "B",
          text: "The desert environments are harsh which explains relatively poor flora and fauna there. Desert animals and plants have developed smart survival techniques, and people have done the same. When lost, an average tourist can usually survive only a few days in a desert, but local people have adapted to living there. They migrate as nomads or live as oasis farmers. Their knowledge of the desert helps them survive in such extreme conditions.",
        },
        {
          letter: "C",
          text: "In hot deserts, the sun heats the ground very strongly during the day. At night, the sand quickly loses heat, and temperatures can fall close to zero. Strong temperature changes create winds that affect the rainfall system on our planet. The powerful winds can also carry desert dust. It can travel across oceans and bring important minerals to other regions. For example, dust from the Sahara helps the Amazon rainforests grow.",
        },
        {
          letter: "D",
          text: "When we talk about deserts, we imagine hot and dry land, but deserts can be different. Some deserts are covered with hot sand, while others are cold and icy. Scientists divide them into hot and cold deserts depending on the climate. The main characteristic of a desert is lack of rainfall. About one-third of the land of our planet is occupied by deserts. They can be found on almost every continent of the Earth!",
        },
        {
          letter: "E",
          text: "Most deserts were formed long before people appeared on the planet. Nowadays, however, human activities can create or expand deserts. Cutting down forests, keeping overgrazing animals, and agricultural mistakes can damage the soil and turn fertile land into dry areas. This process is called desertification. In contrast, people can also make deserts greener by planting trees and building irrigation systems.",
        },
        {
          letter: "F",
          text: "Both hot and cold deserts do not support vegetation growth. The soil is dry and poor in nutrients, and temperatures are extreme. However, modern technology allows farmers to grow vegetables and fruit in some desert areas. Special irrigation systems bring water directly to plants and help save moisture. In this way, even dry land can sometimes become productive.",
        },
      ],
      strategy: NO_STRATEGY,
    },

    part13: {
      intro: COMMON.reading.part13Intro,
      title: "Treasure Hunting: Adventure or Mystery?",
      paragraphs: [
        "Treasure hunting has inspired a lot of writers and filmmakers. No wonder — who doesn’t like stories about hidden gold and pirates’ maps? In my childhood, books like Treasure Island and King Solomon’s Mines were very popular to read. There, the treasure was found, but can a lucky discovery happen in the real world?",
        "In the past, people often hid their coins and jewellery to protect them from enemies or thieves. And lots of those treasures are still missing. Theoretically speaking, anyone may be lucky enough to find something valuable just in their garden, but when thinking about amazing findings, people usually turn to Egypt. Indeed, one of the most well-known discoveries is the treasure of Tutankhamun’s tomb, found in Egypt in 1922. It contained gold, jewellery, and many valuable objects from ancient times.",
        "Unfortunately, many ancient Egyptian tombs had been robbed and ruined before archaeologists found them. The thieves did not think about the cultural value of the artefacts; they broke them and melted them for gold. Luckily, Tutankhamun’s tomb was found undamaged. Thieves had not got to it because the tomb was very well hidden — it was buried beneath the ruins of another tomb construction, which helped protect it from robbers. There were over 5,000 objects inside, including furniture, jewellery, chariots, and statues. The objects gave historians invaluable insight into the daily life, religion, and customs of ancient Egyptians — far more than any other single discovery.",
        "Tutankhamun’s mummy was enclosed within three coffins, one inside the other. The inner coffin was made of solid gold and weighed over 100 kg. Among the treasures was the famous burial mask of Tutankhamun, made of solid gold and inlaid with precious stones. It has since become a global symbol of ancient Egypt.",
        "The treasure of Tutankhamun’s tomb was discovered by Howard Carter and his team. Though they were British, the government of the UK did not transport the findings to Britain, as had happened to many other archaeological artefacts discovered earlier. By 1922, Egypt had already had a law which said that any treasures found on its territory belonged to the Egyptian state only.",
        "Now, the artefacts of Tutankhamun are housed in the Grand Egyptian Museum (GEM). GEM is a massive, modern museum near the pyramids, in Giza, Egypt. It was specially built for the most important artefacts, and the complete collection is displayed there. Of course, from time to time, some artefacts leave Egypt but only temporarily, when they are displayed at international exhibitions. These exhibitions are tightly controlled, and all the items always return to Egypt.",
      ],
      statements: [
        statement(
          13,
          "When he was a child, the narrator dreamed of being an archaeologist.",
          "3",
        ),
        statement(
          14,
          "Tutankhamun’s tomb was found more than a hundred years ago.",
          "1",
        ),
        statement(
          15,
          "According to the text, part of the treasures from Tutankhamun’s tomb had been stolen by robbers before it was found by archaeologists.",
          "2",
        ),
        statement(
          16,
          "Tutankhamun’s burial mask was found in the tomb, together with the other items.",
          "1",
        ),
        statement(
          17,
          "Tutankhamun’s treasures were found by British archaeologists.",
          "1",
        ),
        statement(
          18,
          "The British government moved Tutankhamun’s collection to the British Museum in London in 1922.",
          "2",
        ),
        statement(
          19,
          "GEM is the governmental programme that financially supports archaeological projects.",
          "2",
        ),
      ],
      strategy: NO_STRATEGY,
    },
  },

  grammar: {
    part20: {
      intro: COMMON.grammar.part20Intro,
      guideTasks: {
        pronoun: [20],
        tenses: [21, 22, 24, 25, 28],
        noun: [23],
        passive: [26],
        adjective: [27],
      },
      lines: [
        gap(
          20,
          "“I called you last weekend, James, but you didn’t answer,” Sarah said, irritated. She didn’t like it when",
          "SHE",
          "calls were ignored.",
          "her",
        ),
        gap(
          21,
          "“Sorry!” James",
          "SIT",
          "at the desk reading something on his phone.",
          "was sitting",
        ),
        gap(
          22,
          "He",
          "NOT NOTICE",
          "Sarah’s irritation: “Why did you call?” “It’s not important now. So, where were you?” Sarah asked.",
          "did not notice;didn’t notice",
        ),
        gap(
          23,
          "“At my grandparents. They live in a village of",
          "FISHERMAN",
          "and beekeepers. It’s very remote.",
          "fishermen",
        ),
        gap(
          24,
          "Sometimes, there",
          "BE",
          "no internet connection there, and mobiles do not work either.",
          "is",
        ),
        gap(
          25,
          "My grandparents",
          "KEEP",
          "bees for ten years now. I never found it interesting, but last weekend Grandpa showed me all his beehives — these small houses where bees live.",
          "have been keeping;have kept",
        ),
        gap(
          26,
          "And guess what? I",
          "INTRODUCE",
          "to the queen bee.” “To the queen bee?” Sarah sounded sceptical.",
          "was introduced",
        ),
        gap(
          27,
          "“That’s right. She’s the",
          "IMPORTANT",
          "bee in the hive. And it’s like a real kingdom! Their society and communication system are fascinating. You know what? My grandparents said I can bring some friends next weekend.",
          "most important",
        ),
        gap(
          28,
          "If you come with me, you",
          "SEE",
          "the bee kingdom with your own eyes. Would you like to?”",
          "will see;’ll see",
        ),
      ],
      strategy: NO_STRATEGY,
    },
    part29: {
      intro: COMMON.grammar.part29Intro,
      lines: [
        gap(
          29,
          "Do you know the language of animals? Of course, any pet",
          "OWN",
          "can understand whether their dog is happy or sad.",
          "owner",
        ),
        gap(
          30,
          "But wouldn’t it be great to hear what animals",
          "ACTUAL",
          "say?",
          "actually",
        ),
        gap(
          31,
          "The good news is that",
          "COMMUNICATE",
          "with animals will probably be possible very soon.",
          "communication",
        ),
        gap(
          32,
          "Scientists use technological advances in artificial intelligence (AI) to watch animals and listen to the sounds they produce. Then AI analyses the data to understand the",
          "MEAN",
          "of the sounds and movements.",
          "meaning",
        ),
        gap(
          33,
          "It may look",
          "BELIEVABLE",
          "now, but in a few years, we may have a device to translate your dog’s barking into any human language.",
          "unbelievable",
        ),
        gap(
          34,
          "Yes, your dog will be speaking English, Russian, or",
          "ITALY",
          "— whatever language you want!",
          "Italian",
        ),
      ],
      strategy: NO_STRATEGY,
    },
  },

  writing: {
    n: 35,
    intro: COMMON.writing.intro,
    email: {
      from: "Jane@mail.uk",
      to: "Russian_friend@oge.ru",
      subject: "Birthday presents",
      body: [
        "It was my birthday yesterday. I celebrated it with my family and friends. We had fun, and I got a few very nice presents…",
        "…How often do you get presents? Do you prefer getting or giving presents, why? What is the best present you’ve ever got?…",
      ],
    },
    task: [
      "Write a message to Jane and answer her 3 questions.",
      "Write 100–120 words.",
      "Remember the rules of email writing.",
    ],
    criteria: COMMON.writing.criteria,
    rules: COMMON.writing.rules,
    plan: [
      "Обращение: Dear Jane, (отдельная строка, запятая)",
      "Благодарность: Thanks for your email! I was glad to hear from you.",
      "Абзац с ответом на вопрос 1 — как часто вам дарят подарки",
      "Абзац с ответом на вопрос 2 — что вы больше любите: получать или дарить подарки, и почему",
      "Абзац с ответом на вопрос 3 — какой лучший подарок вы получали",
      "Надежда на контакты: Write back soon!",
      "Завершающая фраза: Best wishes, (отдельная строка, запятая)",
      "Подпись — только имя",
    ],
    template: COMMON.writing.template,
    sample: "",
    templateSample: "",
    samples: WRITING_SAMPLES["variant-5"],
    strategy: NO_STRATEGY,
  },

  speaking: {
    audioUrl: "/audio/oge/variant-5/speaking.mp3",

    task1: {
      ...COMMON.speaking.task1,
      text: "It’s hard to imagine professional sport without proper footwear. Today, Russia produces more than 6 million pairs of trainers every year to meet the demand. Since the first Olympic Games, sports footwear has changed significantly. Gradually, simple sandals turned into convenient sports shoes with rubber soles. They made athletes more stable on the track. They also allowed runners to move almost silently. That is why the shoes became popular not only with athletes but also with criminals! That is how the name ’sneakers’ appeared. In English, ’to sneak’ means ’to move quietly or secretly’. The first sneakers or trainers were produced in 1917 for basketball, and soon after, they became essential for other sports.",
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
        "Task 3. You are going to give a talk about your winter holidays. You will have to start in 1.5 minutes and will speak for not more than 2 minutes (10–12 sentences).",
      points: [
        "how long your winter holidays last;",
        "how your family usually celebrates New Year;",
        "whether you make New Year’s Resolutions, and why;",
        "what your attitude to winter holidays is.",
      ],
      sample: "",
      strategy: NO_STRATEGY,
    },
  },
};

/** Условия и ключи из книги плюс разбор каждого ответа */
export const variant5: OgeVariant = withExplanations(
  variant5Base,
  variant5Explained,
);
