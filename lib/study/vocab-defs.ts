import type { Pair } from "./types";

/**
 * Определения по-английски для тренировки «Слово по определению» (режим основного сайта).
 * Ключ — слово или фраза так, как они записаны в юнитах (lib/study/units-*.ts).
 */
export const DEFINITIONS: Record<string, string> = {
  "pick up a language": "to learn a language gradually, without formal study",
  "get to grips with": "to start to understand and deal with something difficult",
  "brush up on": "to improve your knowledge of something you learned before",
  "have an ear for languages": "to be naturally good at learning and hearing languages",
  "hold a conversation": "to talk with someone for some time in a reasonable way",
  "keep at it": "to continue trying hard at something difficult",
  "immerse yourself in": "to become completely involved in an activity or culture",
  rusty: "not as good as before because you haven't practised",
  "catch on": "to become popular or fashionable",
  "die out": "to disappear completely",
  "give or take": "used to say a number is approximately right",
  "bits and pieces": "small things of various kinds",
  "or words to that effect": "used when you are not giving someone's exact words",
  "mother tongue": "the first language you learned as a child",
  "make up for lost time": "to do something more quickly or often to compensate for a delay",
  "bombard with": "to attack someone with a lot of questions, noise or information",
  "go on about": "to talk about something for too long in an annoying way",
  "run down": "to criticise someone or something unfairly",
  "hold back": "to stop yourself from saying or doing something",
  "bring out the best in": "to make someone show their best qualities",
  "come across as": "to give a particular impression to other people",
  "fit in": "to feel that you belong to a group",
  "keyed up": "excited and nervous before something important",
  "be due to": "to be expected or scheduled to happen",
  "soar / plunge": "to rise very quickly / to fall very quickly",
  "whizz / crawl past": "to pass very quickly / very slowly",
  "isn't it about time you …?": "used to say someone should have done something earlier",
  "don't beat around the bush": "don't avoid the main point; say it directly",
  "there's a lot to be said for …": "used to say that something has many advantages",
  "get wound up": "to become angry or nervous",
  remote: "far away from towns and other places",
  "rugged coastline": "a rough, uneven shore with rocks and cliffs",
  "arid desert": "a very dry desert with almost no rain",
  "dense undergrowth": "thick bushes and plants growing under trees",
  "pristine beach": "a beach that is completely clean and unspoilt",
  "untouched wilderness": "wild land that people have not changed",
  "off the beaten track": "in a place where few people go",
  "a drop in the ocean": "a very small amount compared with what is needed",
  "an uphill struggle": "a difficult task that needs a lot of effort",
  "a slippery slope": "a course of action that will lead to something worse",
  "get the lie of the land": "to find out what the situation is before acting",
  "get bogged down": "to become stuck in details and unable to progress",
  "be swamped with": "to have more than you can deal with",
  "to cut a long story short": "used to give only the main points of a story",
  "in a nutshell": "in a few words; briefly",
  "little did I know": "used to say you did not realise something at the time",
  "gut feeling / instinct": "a strong feeling that you know something without clear evidence",
  "a nagging doubt": "a worry that stays in your mind",
  "a hunch": "a feeling that something is true without proof",
  "slip someone's mind": "to be forgotten by someone",
  "refresh your memory": "to remind yourself of something you knew before",
  "cast your mind back": "to try to remember something from the past",
  "vaguely remember": "to remember something only a little",
  "bear in mind": "to remember and consider something when making a decision",
  "speak your mind": "to say honestly what you think",
  "it crossed my mind": "I thought of it briefly",
  "keep an open mind": "to be ready to consider new ideas",
  "peace of mind": "a feeling of being calm and not worried",
  "with all due respect": "used before politely disagreeing with someone",
  "I beg to differ": "a polite way of saying you disagree",
  "no offence intended, but …": "used before saying something that might upset someone",
  "get blood out of a stone": "to get something from a person who is very unwilling to give it",
  "up to no good": "doing something wrong or harmful",
  "get away with murder": "to do bad things without being punished",
  "give someone the benefit of the doubt": "to believe someone is innocent because you cannot prove otherwise",
  "catch someone red-handed": "to find someone while they are doing something wrong",
  "partners in crime": "people who do something wrong together",
  "get off lightly": "to receive a much smaller punishment than expected",
  "lay down the law": "to tell people firmly what they must do",
  "look over your shoulder": "to be afraid that someone is following you",
  "make ends meet": "to have just enough money to live on",
  "be made redundant": "to lose your job because it is no longer needed",
  apprenticeship: "a job in which you learn a skill while working",
  shortlist: "a list of the best candidates chosen from a larger group",
  "if my memory serves me correctly": "if I remember correctly",
  "I'd hazard a guess": "I will guess, although I am not sure",
  "I was under the impression that …": "I believed that, perhaps mistakenly",
  "writer's block": "a period when a writer cannot think of anything to write",
  evocative: "bringing strong images or feelings to mind",
  iconic: "very famous and seen as a symbol of something",
  gritty: "showing unpleasant things in a realistic way",
  "well-composed": "arranged in a balanced and pleasing way",
  "the raw emotion": "strong feeling shown without being hidden",
  ironic: "showing the opposite of what you might expect, often with mild humour",
  devastated: "extremely shocked and upset",
  petrified: "so frightened that you cannot move",
  restless: "unable to stay still or relax",
  insecure: "not confident about yourself",
  speechless: "so surprised or shocked that you cannot speak",
  "first and foremost": "most importantly",
  "I don't want to labour the point": "I don't want to explain this too much",
  "to recap": "to repeat the main points briefly",
  "cross that bridge when I come to it": "deal with a problem only if it happens",
  "open-minded": "willing to consider new ideas",
  "warm-hearted": "kind and friendly",
  backbreaking: "extremely hard physical work",
  heartwarming: "making you feel happy and emotional",
  "mouth-watering": "looking or smelling so good that it makes you hungry",
  "jaw-dropping": "so surprising that you are amazed",
  "self-confident / self-aware": "sure of yourself / understanding your own character",
  "self-sufficient": "able to provide for yourself without help",
  "there's a good chance that …": "it is quite likely that",
  "it's sure to …": "it will certainly",
  "I can't apologise enough": "I am very sorry",
  "I was out of line": "I behaved in an unacceptable way",
  "I overreacted": "I reacted too strongly",
  "get off my back": "stop criticising or pressuring me",
  "I've had it up to here": "I can't tolerate this any longer",
  "a team-building programme": "activities that help a group work better together",
  "drop off (to sleep)": "to fall asleep",
  "toss and turn": "to move around in bed because you cannot sleep",
  "a light sleeper": "a person who wakes up easily",
  "sleep like a log": "to sleep very well",
  "full of beans": "full of energy",
  oversleep: "to sleep longer than you meant to",
  "thinning hair / deteriorating eyesight": "hair becoming less thick / sight getting worse",
  "poor circulation": "blood not moving well around the body",
  "a balanced diet": "eating a healthy mix of different foods",
  "resort to": "to use something bad because nothing else works",
  "could you see your way to …?": "a polite way of asking someone to agree to something",
  "in the region of": "approximately",
  "that's my best offer": "I will not offer more",
  "out of the question": "impossible; not allowed",
  "loud and clear": "very easily and clearly heard or understood",
  "safe and sound": "unhurt and in good condition",
  "regenerate / rejuvenate": "to make an area or person new and active again",
  renovate: "to repair and improve an old building",
  redevelop: "to build new things in an area that has been used before",
  amenities: "useful features of a place, such as parks and shops",
  "a pothole": "a hole in the surface of a road",
  "wear and tear": "damage caused by normal use",
  striking: "attracting attention because it is unusual or very good",
  imposing: "large and impressive",
  nondescript: "ordinary and not interesting",
  "over the top": "too extreme or exaggerated",
  "I smell a rat": "I suspect something is wrong or dishonest",
  "hold your horses": "wait; don't act too quickly",
  "let's not jump to conclusions": "let's not decide before we know the facts",
  "build up / build on": "to increase / to develop something using earlier success",
  "play it by ear": "to decide what to do as things happen",
  exodus: "a situation in which many people leave a place at the same time",
  "address an audience": "to speak formally to a group of people",
  "illustrate a point": "to show what you mean with an example",
  "go into detail": "to give all the facts about something",
  "out of my depth": "in a situation too difficult for you",
  "go like clockwork": "to happen exactly as planned",
  "be lost for words": "to be too surprised to speak",
  "a lucky charm": "an object that is believed to bring good luck",
  "ward off evil": "to keep bad spirits or bad luck away",
  "touch wood": "said to avoid bad luck after talking about good luck",
  "third time lucky": "said when you hope the third attempt will succeed",
  "tempt fate": "to do something risky and hope nothing goes wrong",
  "on the safe side": "to be careful, in case something goes wrong",
  "count yourself lucky": "to be grateful that things were not worse",
  "on the off chance": "in case something unlikely happens",
  "a fighting chance": "a small but real possibility of success",
  "you're in luck": "you are fortunate",
  "I'd rather you hadn't …": "I wish you had not done it",
};

/**
 * Слова недели 1: из вашего теста B2–C1 (ошибки №13, 35, 37, 40 и их соседи).
 * Формат: английский вариант, русский перевод, определение, пример.
 */
export const WEEK_ONE_WORDS: { en: string; ru: string; def: string; example: string }[] = [
  { en: "put up with", ru: "мириться с, терпеть", def: "to accept something annoying without complaining", example: "I can't put up with the noise any longer." },
  { en: "come up with", ru: "придумать", def: "to think of an idea or a plan", example: "She came up with a brilliant idea." },
  { en: "get over", ru: "оправиться от", def: "to recover from an illness or a disappointment", example: "It took me weeks to get over the flu." },
  { en: "look into", ru: "изучить, расследовать", def: "to investigate something", example: "The police are looking into the case." },
  { en: "bring up", ru: "упомянуть, воспитывать", def: "to mention a subject, or to raise a child", example: "He brought up the subject at dinner." },
  { en: "break the ice", ru: "разрядить обстановку", def: "to make people feel more relaxed in a social situation", example: "To break the ice, he told a joke." },
  { en: "call it a day", ru: "закончить на сегодня", def: "to stop working for the day", example: "We've done enough; let's call it a day." },
  { en: "snowed under", ru: "завален (работой)", def: "having more work than you can deal with", example: "I'm snowed under with work this week." },
  { en: "fall through", ru: "сорваться (о планах)", def: "to fail to happen", example: "The deal fell through at the last minute." },
  { en: "show off", ru: "хвастаться", def: "to try to impress people with what you have or can do", example: "He's always showing off in front of his friends." },
  { en: "convoluted", ru: "запутанный", def: "extremely complicated and difficult to follow", example: "The explanation was so convoluted that nobody understood it." },
  { en: "lucid", ru: "ясный, понятный", def: "clearly expressed and easy to understand", example: "She gave a lucid account of what happened." },
  { en: "hollow", ru: "пустой, неискренний", def: "without real meaning or value", example: "The politician's promises sounded hollow." },
  { en: "teeming with", ru: "кишащий", def: "full of people or animals moving around", example: "The city was teeming with tourists." },
  { en: "ambivalent", ru: "испытывающий двойственные чувства", def: "having mixed feelings about something", example: "He felt ambivalent about moving abroad." },
  { en: "tactless", ru: "бестактный", def: "saying things that upset people because you don't think", example: "Her tactless remarks offended everyone." },
  { en: "reputation for", ru: "репутация (в чём-то)", def: "the opinion people have about someone's qualities", example: "She has a reputation for being very strict." },
  { en: "deny doing something", ru: "отрицать, что сделал", def: "to say you did not do something", example: "He denied taking the money." },
];

export type WordCard = {
  /** Устойчивый идентификатор слова в плане */
  id: string;
  en: string;
  ru: string;
  example: string;
  definition: string;
  unit: number;
};

export function cleanEnglish(text: string): string {
  return text
    .replace(/\s*…\s*/g, " ")
    .replace(/\s*\?\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

export type { Pair };

const TRAILING_PREPOSITION = /\s+(?:от|с|со|к|ко|на|в|во|о|об|по|за|из|у|про|для|над|при)$/;

/**
 * Тренажёр основного сайта принимает ответ, если он совпал с одним из вариантов через запятую.
 * Поэтому к переводу добавляем естественные сокращения: без скобок и без предлога на конце
 * («оправиться от» → «оправиться»).
 */
export function acceptVariants(russian: string): string {
  const variants: string[] = [];
  for (const part of russian.split(/[,;]/)) {
    const base = part.replace(/\s+/g, " ").trim();
    if (!base) continue;
    const withoutBrackets = base.replace(/\s*\([^)]*\)/g, "").trim();
    for (const option of [base, withoutBrackets, withoutBrackets.replace(TRAILING_PREPOSITION, "")]) {
      if (option && !variants.includes(option)) variants.push(option);
    }
  }
  return variants.join(", ");
}
