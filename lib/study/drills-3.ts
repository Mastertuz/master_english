import type { Drill } from "./types";

/** Грамматика Empower C1, юниты 9–10, и лексические упражнения по вашим ошибкам */

export const REFLEXIVE_DRILL: Drill = {
  id: "reflexive-ellipsis",
  title: "Возвратные местоимения, эллипсис и замена",
  tag: "Empower Unit 9A–9B",
  rule: [
    "Reflexive (myself, herself…) — когда действие возвращается на подлежащее или для усиления: The president himself will attend. Each other / one another — взаимное действие: They looked at each other. Не путайте: they looked at themselves = каждый на себя.",
    "Эллипсис — пропуск повторяющихся слов: She can play the guitar, and so can her brother. После to можно оставить только to: I didn't want to. Замена: I hope so / I hope not; I'm afraid so / not; So do I / Neither do I.",
  ],
  examples: [
    "She taught herself to play the piano.",
    "They've known one another for years.",
    "'Will it rain?' 'I hope not.'",
    "She can play the guitar, and so can her brother.",
  ],
  items: [
    { id: "re-1", q: "She taught ___ to play the piano.", options: ["her", "herself", "she", "hers"], answer: "herself", why: "Действие возвращается на подлежащее." },
    { id: "re-2", q: "They looked at ___ and laughed.", options: ["themselves", "each other", "theirselves", "them"], answer: "each other", why: "Взаимное действие: each other." },
    { id: "re-3", q: "The president ___ will attend the ceremony.", options: ["himself", "him", "he", "his"], answer: "himself", why: "Усиление: сам президент." },
    { id: "re-4", q: "We can't blame anyone but ___.", options: ["us", "ourselves", "our", "we"], answer: "ourselves", why: "Reflexive после but." },
    { id: "re-5", q: "They've known ___ for years.", options: ["themselves", "one another", "each others", "theirselves"], answer: "one another", why: "Взаимное: one another / each other." },
    { id: "re-6", q: "She asked me to help, but I didn't want ___.", options: ["to", "it", "that", "so"], answer: "to", why: "Эллипсис: после to опускаем инфинитив." },
    { id: "re-7", q: "'Do you think it will rain?' 'I hope ___.'", options: ["it not", "not", "no", "so not"], answer: "not", why: "I hope not — замена отрицательного придаточного." },
    { id: "re-8", q: "'Will they be late?' 'I'm afraid ___.'", options: ["so", "it", "they", "that"], answer: "so", why: "I'm afraid so — замена утвердительного придаточного." },
    { id: "re-9", q: "She can play the guitar, and ___ her brother.", options: ["so does", "so can", "does so", "can so"], answer: "so can", why: "So + вспомогательный + подлежащее." },
    { id: "re-10", q: "'I don't like jazz.' '___ I.'", options: ["Neither do", "So do", "Nor don't", "Neither don't"], answer: "Neither do", why: "Отрицательное согласие: Neither do I." },
    { id: "re-11", q: "I haven't seen the film, but my friend ___ (have).", answer: "has", why: "Эллипсис: повторяется только вспомогательный." },
    { id: "re-12", q: "'Are you coming?' 'I'd like ___, but I'm busy.'", options: ["to", "it", "so", "that"], answer: "to", why: "I'd like to — эллипсис." },
  ],
};

export const REGRET_DRILL: Drill = {
  id: "regret-passive",
  title: "Сожаление, критика и пассив с reporting verbs",
  tag: "Empower Unit 10A–10B",
  rule: [
    "Критика и сожаление о прошлом: should / ought to have + V3 (надо было), if only + Past Perfect, I wish + Past Perfect, regret + -ing.",
    "Пассив с reporting verbs (say, believe, think, report, expect): He is said to be rich (сейчас). He is said to have won a fortune (раньше). It is believed that the painting was stolen. Для формального и новостного стиля.",
    "Инверсия в третьем условном: Had I not been so tired, I would have stayed longer.",
  ],
  examples: [
    "You should have called me.",
    "He is said to have won over a million pounds.",
    "The painting is believed to have been stolen in 1998.",
  ],
  items: [
    { id: "rg-1", q: "You ___ have called me. I was so worried.", options: ["should", "might", "can", "would"], answer: "should", why: "Should have + V3: критика." },
    { id: "rg-2", q: "If only I ___ the job offer!", options: ["accept", "had accepted", "would accept", "accepted"], answer: "had accepted", why: "If only о прошлом — Past Perfect." },
    { id: "rg-3", q: "He is said ___ over a million pounds.", options: ["to have won", "winning", "having won", "that won"], answer: "to have won", why: "Say + перфектный инфинитив для более раннего события." },
    { id: "rg-4", q: "The painting is believed ___ stolen in 1998.", options: ["to be", "to have been", "having been", "that was"], answer: "to have been", why: "Is believed to have been + V3." },
    { id: "rg-5", q: "The company is reported ___ losing money.", options: ["to be", "to have", "being", "that"], answer: "to be", why: "Is reported to be + -ing (сейчас)." },
    { id: "rg-6", q: "She regrets ___ the opportunity when she had it.", options: ["not taking", "not to take", "to not take", "don't take"], answer: "not taking", why: "Regret + -ing: жалеть о прошлом." },
    { id: "rg-7", q: "He is thought ___ abroad.", options: ["live", "to live", "living", "lives"], answer: "to live", why: "Is thought to + инфинитив." },
    { id: "rg-8", q: "The authorities are said ___ the investigation.", options: ["to have started", "start", "starting", "that started"], answer: "to have started", why: "Are said to have + V3." },
    { id: "rg-9", q: "Had I not been so tired, I ___ stayed longer.", options: ["would have", "will have", "would", "had"], answer: "would have", why: "Инверсия: Had I not been = If I hadn't been." },
    { id: "rg-10", q: "He ___ (say) to be the richest man in town.", answer: "is said", why: "Пассив: is said to be." },
    { id: "rg-11", q: "I wish I ___ (not / say) that.", answer: "hadn't said|had not said", why: "Wish о прошлом — Past Perfect." },
    { id: "rg-12", q: "It is ___ that the minister will resign.", options: ["rumoured", "rumouring", "rumour", "to rumour"], answer: "rumoured", why: "It is + V3 + that." },
  ],
};

export const PREPOSITION_DRILL: Drill = {
  id: "prepositions",
  title: "Предлоги после слов",
  tag: "Ваша ошибка: №37",
  rule: [
    "Предлог после существительного, прилагательного и глагола надо учить вместе со словом: reputation for, depend on, good at, responsible for, allergic to, objection to, pride in, accused of, fed up with, apologise for, famous for.",
    "Правило: после предлога идёт существительное или форма на -ing: reputation for being strict, no point in arguing, good at solving.",
  ],
  examples: [
    "She has a reputation for being very strict.",
    "It depends on the weather.",
    "She takes pride in her work.",
  ],
  items: [
    { id: "pr-1", q: "She has a reputation ___ being very strict.", options: ["with", "for", "as", "of"], answer: "for", why: "Reputation for + -ing." },
    { id: "pr-2", q: "I'm afraid it depends ___ the weather.", options: ["of", "on", "from", "with"], answer: "on", why: "Depend on." },
    { id: "pr-3", q: "He's very good ___ solving problems.", options: ["in", "at", "with", "for"], answer: "at", why: "Good at + -ing." },
    { id: "pr-4", q: "I'm not responsible ___ what happened.", options: ["of", "for", "about", "on"], answer: "for", why: "Responsible for." },
    { id: "pr-5", q: "She's allergic ___ nuts.", options: ["with", "from", "to", "of"], answer: "to", why: "Allergic to." },
    { id: "pr-6", q: "We have no objection ___ the plan.", options: ["at", "to", "against", "with"], answer: "to", why: "Objection to." },
    { id: "pr-7", q: "There's no point ___ arguing.", options: ["of", "in", "for", "to"], answer: "in", why: "No point in + -ing." },
    { id: "pr-8", q: "She takes pride ___ her work.", options: ["of", "in", "for", "on"], answer: "in", why: "Take pride in." },
    { id: "pr-9", q: "He was accused ___ stealing.", options: ["for", "of", "with", "about"], answer: "of", why: "Accuse somebody of." },
    { id: "pr-10", q: "The cost of living is rising ___ an alarming rate.", options: ["at", "in", "with", "by"], answer: "at", why: "At a rate." },
    { id: "pr-11", q: "She apologised ___ being late.", answer: "for", why: "Apologise for." },
    { id: "pr-12", q: "I'm fed up ___ waiting.", answer: "with", why: "Fed up with." },
  ],
};

export const PHRASAL_DRILL: Drill = {
  id: "phrasal-idioms",
  title: "Фразовые глаголы и идиомы",
  tag: "Ваши ошибки: №13, 35",
  rule: [
    "Фразовые глаголы учите в контексте и по значению: put up with — терпеть, come up with — придумать, get over — оправиться, look into — изучать, bring up — упомянуть или воспитывать, pick up — забрать, show off — хвастаться, fall through — сорваться.",
    "Идиомы: break the ice — разрядить обстановку, call it a day — закончить на сегодня, blow one's top — взорваться от злости, snowed under — завален работой. Идиомы нельзя менять по частям.",
  ],
  examples: [
    "I can't put up with his behaviour any longer.",
    "To break the ice, he told a joke.",
    "Let's call it a day.",
  ],
  items: [
    { id: "ph-1", q: "I'm afraid I can't ___ up with his behaviour any longer.", options: ["come", "put", "keep", "take"], answer: "put", why: "Put up with — терпеть." },
    { id: "ph-2", q: "She ___ up with a brilliant idea.", options: ["came", "put", "set", "kept"], answer: "came", why: "Come up with — придумать." },
    { id: "ph-3", q: "It took me weeks to ___ over the flu.", options: ["get", "go", "put", "take"], answer: "get", why: "Get over — оправиться от." },
    { id: "ph-4", q: "The police are ___ into the case.", options: ["looking", "seeing", "going", "taking"], answer: "looking", why: "Look into — изучать, расследовать." },
    { id: "ph-5", q: "He ___ up the subject at dinner.", options: ["brought", "took", "made", "put"], answer: "brought", why: "Bring up — поднять тему." },
    { id: "ph-6", q: "To ___ the ice at the party, he told a joke.", options: ["crack", "melt", "smash", "break"], answer: "break", why: "Break the ice — разрядить обстановку." },
    { id: "ph-7", q: "We've been working for ten hours. Let's ___ it a day.", options: ["call", "name", "make", "say"], answer: "call", why: "Call it a day — закончить." },
    { id: "ph-8", q: "He was so angry that he ___ his top.", options: ["blew", "broke", "lost", "hit"], answer: "blew", why: "Blow one's top — взорваться." },
    { id: "ph-9", q: "The deal fell ___.", options: ["through", "out", "off", "away"], answer: "through", why: "Fall through — сорваться." },
    { id: "ph-10", q: "I'll ___ you up at the airport at six.", options: ["pick", "take", "bring", "get"], answer: "pick", why: "Pick up — забрать." },
    { id: "ph-11", q: "He's always showing ___ and bragging.", options: ["off", "up", "out", "over"], answer: "off", why: "Show off — хвастаться." },
    { id: "ph-12", q: "I can't come; I'm snowed ___ with work.", options: ["under", "up", "out", "in"], answer: "under", why: "Snowed under — завален." },
  ],
};

export const WORD_DRILL: Drill = {
  id: "word-choice",
  title: "Точное слово: оттенки значения",
  tag: "Ваша ошибка: №40",
  rule: [
    "На уровне C1 различие между B2 и C1 часто в точном слове: convoluted — запутанный, lucid — ясный, concise — краткий, explicit — прямо выраженный. Если слова в вариантах значат противоположное, ищите смысл всего предложения (именно поэтому…).",
    "Читайте предложение целиком: слово должно подходить по смыслу и по сочетаемости: teeming with tourists, in line with expectations, a narrow victory, a lasting solution.",
  ],
  examples: [
    "The explanation was so convoluted that nobody understood it.",
    "The city was teeming with tourists.",
    "The results were in line with our expectations.",
  ],
  items: [
    { id: "wd-1", q: "The explanation was so ___ that nobody could understand it.", options: ["concise", "convoluted", "explicit", "lucid"], answer: "convoluted", why: "Convoluted — запутанный; остальные слова значат «чёткий, ясный»." },
    { id: "wd-2", q: "She gave a ___ account of the events: clear and easy to follow.", options: ["lucid", "vague", "elaborate", "bleak"], answer: "lucid", why: "Lucid — ясный, понятный." },
    { id: "wd-3", q: "The politician's promises were ___; nobody believed them.", options: ["hollow", "vivid", "solid", "keen"], answer: "hollow", why: "Hollow promises — пустые обещания." },
    { id: "wd-4", q: "The city was ___ with tourists.", options: ["teeming", "packing", "stuffing", "loading"], answer: "teeming", why: "Teeming with — кишит." },
    { id: "wd-5", q: "Sales have ___, rising by 40% in a year.", options: ["soared", "plunged", "crawled", "slid"], answer: "soared", why: "Soar — резко вырасти." },
    { id: "wd-6", q: "He was ___ about the move: he couldn't decide.", options: ["ambivalent", "eager", "ruthless", "candid"], answer: "ambivalent", why: "Ambivalent — двойственные чувства." },
    { id: "wd-7", q: "Her ___ remarks offended everyone.", options: ["tactless", "tactful", "vague", "trivial"], answer: "tactless", why: "Tactless — бестактный." },
    { id: "wd-8", q: "It was a ___ victory; the team won by one point.", options: ["narrow", "shallow", "thin", "short"], answer: "narrow", why: "Narrow victory — минимальная победа." },
    { id: "wd-9", q: "We need a ___ solution; this one only works temporarily.", options: ["lasting", "lengthy", "lengthened", "late"], answer: "lasting", why: "Lasting solution — долговременное." },
    { id: "wd-10", q: "The results were ___ with our expectations.", options: ["in line", "in step", "in time", "on line"], answer: "in line", why: "In line with — соответствует." },
    { id: "wd-11", q: "The noise was ___; I couldn't concentrate.", options: ["deafening", "deaf", "deaden", "deafened"], answer: "deafening", why: "Deafening — оглушающий." },
    { id: "wd-12", q: "He's a ___ speaker: he can hold the audience for hours.", options: ["compelling", "compulsory", "compulsive", "complex"], answer: "compelling", why: "Compelling — захватывающий." },
  ],
};

export const LINKING_DRILL: Drill = {
  id: "linking",
  title: "Связки для письма и речи",
  tag: "Empower Unit 2D, 5D, 9D",
  rule: [
    "Контраст и уступка: although / even though + предложение; despite / in spite of + существительное или -ing (или the fact that); however, nevertheless, even so — в начале нового предложения; whereas / while — противопоставление внутри предложения.",
    "Причина и результат: therefore, consequently, as a result, so. Добавление: furthermore, moreover, what is more, in addition. Условие: otherwise, provided that. Цель: in order to, so as to.",
  ],
  examples: [
    "In spite of the heavy rain, the match went ahead.",
    "He's very rich. Nevertheless, he's not happy.",
    "The first option is cheap, whereas the second is expensive.",
  ],
  items: [
    { id: "ln-1", q: "___ the heavy rain, the match went ahead.", options: ["Although", "In spite of", "However", "Despite of"], answer: "In spite of", why: "In spite of + существительное; despite без of." },
    { id: "ln-2", q: "He's very rich. ___, he's not happy.", options: ["Nevertheless", "Because", "Whereas", "Even"], answer: "Nevertheless", why: "Nevertheless — наречие-уступка." },
    { id: "ln-3", q: "She studied hard; ___, she passed.", options: ["consequently", "despite", "although", "whereas"], answer: "consequently", why: "Consequently — следовательно." },
    { id: "ln-4", q: "___ being tired, she kept working.", options: ["Although", "Despite", "However", "Even though"], answer: "Despite", why: "Despite + -ing." },
    { id: "ln-5", q: "The first option is cheap, ___ the second is expensive.", options: ["whereas", "despite", "however", "therefore"], answer: "whereas", why: "Whereas — противопоставление." },
    { id: "ln-6", q: "___ the fact that he was ill, he came to work.", options: ["Despite", "Although", "Even", "However"], answer: "Despite", why: "Despite the fact that …" },
    { id: "ln-7", q: "The film was long. ___, it was never boring.", options: ["Furthermore", "Even so", "Therefore", "Since"], answer: "Even so", why: "Even so — несмотря на это." },
    { id: "ln-8", q: "He lost his keys; ___, he couldn't get in.", options: ["as a result", "even though", "whereas", "in spite"], answer: "as a result", why: "As a result — в результате." },
    { id: "ln-9", q: "___ to its price, the car is good value.", options: ["Compared", "Comparing", "Comparison", "Compare"], answer: "Compared", why: "Compared to — по сравнению с." },
    { id: "ln-10", q: "She's a talented singer and, ___, an excellent dancer.", options: ["what is more", "in contrast", "nevertheless", "otherwise"], answer: "what is more", why: "What is more — к тому же." },
    { id: "ln-11", q: "You must book early; ___, you won't get a seat.", answer: "otherwise", why: "Otherwise — иначе." },
    { id: "ln-12", q: "He worked hard in ___ to pass the exam.", answer: "order", why: "In order to — чтобы." },
  ],
};
