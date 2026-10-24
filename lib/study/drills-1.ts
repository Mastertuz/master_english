import type { Drill } from "./types";

/** Грамматика, в которой вы ошиблись в тесте B2–C1: wish, инверсия, условные, модальные, глагол + -ing/to */

export const WISH_DRILL: Drill = {
  id: "wish-rather",
  title: "Wish, if only, would rather, it's high time",
  tag: "Ваши ошибки в тесте: №4, 7, 18",
  rule: [
    "Wish и if only говорят о том, чего нет или не было. Время «сдвигается» назад: о настоящем — Past Simple (I wish I had more time), о прошлом — Past Perfect (I wish I had studied). Для всех лиц после wish в этом значении используют were: I wish I were taller.",
    "Wish + would — раздражение поведением других или просьба изменить его: I wish you would stop interrupting. О себе и о состояниях would не используют.",
    "Would rather + глагол без to — ваш выбор (I'd rather stay). Если выбор касается другого человека, нужно Past Simple: I'd rather you didn't smoke here. Сожаление о прошлом — Past Perfect: I'd rather you had told me.",
    "It's (high / about) time + подлежащее + Past Simple: давно пора. Она относится к настоящему: It's high time you thought about your future.",
  ],
  examples: [
    "I wish I had a car. (сейчас нет)",
    "I wish I had had more time. (тогда не было)",
    "I wish he would listen. (он не слушает)",
    "I'd rather you didn't smoke in here.",
    "It's high time we left.",
  ],
  items: [
    { id: "wish-1", q: "I'd rather you ___ smoke in here.", options: ["don't", "didn't", "won't", "wouldn't"], answer: "didn't", why: "Would rather + другое лицо → Past Simple: I'd rather you didn't." },
    { id: "wish-2", q: "I wish I ___ more time to prepare yesterday.", options: ["had", "had had", "would have", "have had"], answer: "had had", why: "Сожаление о прошлом: wish + Past Perfect (had had)." },
    { id: "wish-3", q: "It's high time you ___ about your future.", options: ["are thinking", "thought", "will think", "think"], answer: "thought", why: "It's high time + Past Simple: давно пора подумать." },
    { id: "wish-4", q: "I wish he ___ stop interrupting me!", options: ["will", "would", "had", "did"], answer: "would", why: "Wish + would — раздражение чужим поведением." },
    { id: "wish-5", q: "If only I ___ taller! I can't reach the shelf.", options: ["am", "were", "had been", "would be"], answer: "were", why: "Желание о настоящем: Past Simple, после I / he / she принято were." },
    { id: "wish-6", q: "I'd rather ___ at home tonight than go out.", options: ["stay", "to stay", "staying", "stayed"], answer: "stay", why: "Would rather + инфинитив без to, когда выбор ваш." },
    { id: "wish-7", q: "I'd rather you ___ me the truth last week.", options: ["told", "had told", "tell", "would tell"], answer: "had told", why: "Сожаление о прошлом: would rather + Past Perfect." },
    { id: "wish-8", q: "I wish I ___ to the party last night. I missed all the fun.", options: ["went", "had gone", "would go", "have gone"], answer: "had gone", why: "Wish о прошлом → Past Perfect." },
    { id: "wish-9", q: "It's about time we ___ the meeting.", options: ["start", "started", "will start", "are starting"], answer: "started", why: "It's about time + Past Simple." },
    { id: "wish-10", q: "I wish I ___ (can) speak French.", answer: "could", why: "Wish + could: хотелось бы уметь (Past Simple от can)." },
    { id: "wish-11", q: "I'd rather you ___ the window; it's cold.", options: ["didn't open", "don't open", "wouldn't open", "haven't opened"], answer: "didn't open", why: "Would rather + другое лицо → Past Simple." },
    { id: "wish-12", q: "If only she ___ to me, none of this would have happened.", options: ["listened", "had listened", "would listen", "listens"], answer: "had listened", why: "If only о прошлом → Past Perfect." },
    { id: "wish-13", q: "It's high time you ___ (find) a job.", answer: "found", why: "It's high time + Past Simple." },
  ],
};

export const INVERSION_DRILL: Drill = {
  id: "inversion",
  title: "Инверсия после отрицательных наречий",
  tag: "Ваши ошибки: №10, 16 · Empower Unit 3A",
  rule: [
    "Если предложение начинается с отрицательного или ограничивающего выражения (never, rarely, seldom, hardly … when, no sooner … than, not only, not until, only after / when / if, under no circumstances, little, at no time), то после него идёт порядок как в вопросе: вспомогательный глагол + подлежащее.",
    "Если вспомогательного глагола нет, добавляйте do / does / did: Not until I got home did I realise… После Hardly и No sooner используют Past Perfect: Hardly had we entered when the alarm went off. No sooner had she sat down than the phone rang.",
    "Инверсия нужна для эмфазы и формальной речи. В живой болтовне её почти не слышно, но в экзамене C1 это частая тема.",
  ],
  examples: [
    "Never have I felt so embarrassed.",
    "Not only was he late, but he also forgot the documents.",
    "Under no circumstances should you open the door.",
    "Little did he know that the police were watching.",
    "Only when you pay in advance will you get a discount.",
  ],
  items: [
    { id: "inv-1", q: "Not until I got home ___ that I'd lost my keys.", options: ["realised I", "I did realise", "did I realise", "I realised"], answer: "did I realise", why: "После Not until в начале — инверсия: did I realise." },
    { id: "inv-2", q: "Hardly ___ the building when the alarm went off.", options: ["we entered", "we had entered", "did we enter", "had we entered"], answer: "had we entered", why: "Hardly + Past Perfect с инверсией: Hardly had we entered… when…" },
    { id: "inv-3", q: "No sooner had she sat down ___ the phone rang.", options: ["when", "than", "that", "as"], answer: "than", why: "No sooner … than; Hardly … when." },
    { id: "inv-4", q: "Never in my life ___ so embarrassed.", options: ["I have felt", "have I felt", "I felt", "did I felt"], answer: "have I felt", why: "Never in my life в начале → have I felt." },
    { id: "inv-5", q: "Under no circumstances ___ the door to strangers.", options: ["you should open", "should you open", "you open", "do you opened"], answer: "should you open", why: "Under no circumstances + инверсия: should you open." },
    { id: "inv-6", q: "Not only ___ late, but he also forgot the documents.", options: ["he was", "was he", "did he be", "he had been"], answer: "was he", why: "Not only в начале: was he (be не требует do)." },
    { id: "inv-7", q: "Only after the meeting ___ what had happened.", options: ["I realised", "did I realise", "I did realise", "realised I"], answer: "did I realise", why: "Only after + инверсия: did I realise." },
    { id: "inv-8", q: "Rarely ___ such a talented student.", options: ["I have met", "have I met", "I met", "met I"], answer: "have I met", why: "Rarely в начале: have I met." },
    { id: "inv-9", q: "Little ___ that the police were watching him.", options: ["he knew", "did he know", "knew he", "he did know"], answer: "did he know", why: "Little (= совсем не) в начале: did he know." },
    { id: "inv-10", q: "Not until the lights went out ___ (I / notice) how late it was.", answer: "did I notice", why: "Not until + инверсия: did I notice." },
    { id: "inv-11", q: "Only if you pay in advance ___ a discount.", options: ["you'll get", "will you get", "you get", "get you"], answer: "will you get", why: "Only if в начале: will you get." },
    { id: "inv-12", q: "At no time ___ the company aware of the problem.", options: ["was", "did", "has", "were"], answer: "was", why: "At no time + инверсия: was the company aware." },
  ],
};

export const CONDITIONAL_DRILL: Drill = {
  id: "conditionals",
  title: "Условные предложения: третий тип, смешанные, инверсия",
  tag: "Ваша ошибка: №17 · Empower Unit 8B",
  rule: [
    "Третий тип — нереальное прошлое: If + Past Perfect, would have + V3. If I had known your number, I would have called you.",
    "Смешанные: прошлое → настоящее (If I had studied harder, I would have a better job now) и настоящее → прошлое (If she weren't so shy, she would have got the part).",
    "Инверсия вместо if: Had I known… (= If I had known), Should you need… (= If you should need), Were I you… (= If I were you). But for / If it hadn't been for + существительное: But for your help, I would have failed.",
    "Unless = if … not: Unless you leave now, you'll miss the train.",
  ],
  examples: [
    "If I had known, I would have called.",
    "Had I known, I'd have called.",
    "If I had studied harder, I'd have a better job now.",
    "Were I you, I would apologise.",
    "If it hadn't been for you, I'd have failed.",
  ],
  items: [
    { id: "cond-1", q: "I'd have called you if I ___ your number.", options: ["had known", "knew", "have known", "would know"], answer: "had known", why: "Третье условное: if + Past Perfect, would have + V3." },
    { id: "cond-2", q: "If I ___ harder at school, I'd have a better job now.", options: ["studied", "had studied", "would study", "study"], answer: "had studied", why: "Смешанное: прошлое условие (had studied) → настоящий результат (would have)." },
    { id: "cond-3", q: "If she weren't so shy, she ___ the part in the play last year.", options: ["would get", "would have got", "had got", "got"], answer: "would have got", why: "Постоянное качество сейчас (weren't shy) → прошлый результат: would have got." },
    { id: "cond-4", q: "___ I known about the delay, I'd have left earlier.", options: ["Have", "Had", "Would", "If"], answer: "Had", why: "Инверсия: Had I known = If I had known." },
    { id: "cond-5", q: "Should you ___ any problems, call me.", options: ["have", "had", "having", "to have"], answer: "have", why: "Should you have… = If you should have… (формально)." },
    { id: "cond-6", q: "If it ___ for your help, I would have failed.", options: ["wasn't", "weren't", "hadn't been", "wouldn't be"], answer: "hadn't been", why: "Прошлое: If it hadn't been for … (= But for …)." },
    { id: "cond-7", q: "Unless you ___ now, you'll miss the train.", options: ["leave", "don't leave", "left", "won't leave"], answer: "leave", why: "Unless уже содержит отрицание: Unless you leave = If you don't leave." },
    { id: "cond-8", q: "If I ___ you, I'd apologise.", options: ["am", "were", "had been", "would be"], answer: "were", why: "Совет в нереальном настоящем: If I were you." },
    { id: "cond-9", q: "Supposing you ___ the lottery, what would you do?", options: ["win", "won", "would win", "had win"], answer: "won", why: "Supposing = If; нереальное настоящее → Past Simple." },
    { id: "cond-10", q: "He'd be a millionaire now if he ___ that job offer in 2010.", options: ["accepted", "had accepted", "would accept", "has accepted"], answer: "had accepted", why: "Смешанное: прошлое условие → настоящий результат." },
    { id: "cond-11", q: "If I ___ (not / miss) the bus, I wouldn't have been late.", answer: "hadn't missed|had not missed", why: "Третье условное: Past Perfect в части с if." },
    { id: "cond-12", q: "But for the rain, we ___ (go) to the beach.", answer: "would have gone", why: "But for = if it hadn't been for; результат в прошлом: would have gone." },
  ],
};

export const MODALS_DRILL: Drill = {
  id: "modals-past",
  title: "Модальные глаголы: догадки и выводы о прошлом",
  tag: "Ваша ошибка: №38 · Empower Unit 7A",
  rule: [
    "Выводы о прошлом: must have + V3 (почти уверен, что было), can't / couldn't have + V3 (почти уверен, что не было), may / might / could have + V3 (возможно, было).",
    "Критика и сожаление: should / ought to have + V3 (надо было, но не сделал). Needn't have + V3 — сделал, а можно было не делать. Не путайте с mustn't have: так не говорят.",
    "Ожидание: should have arrived = уже должен был приехать. Если сомневаемся в будущем: likely to, bound to, sure to, probably.",
  ],
  examples: [
    "He didn't turn up. He can't have got the message.",
    "The lights are off. They must have gone to bed.",
    "You needn't have bought flowers.",
    "I should have taken an umbrella.",
    "She might have missed the train.",
  ],
  items: [
    { id: "mod-1", q: "He didn't turn up. He ___ the message.", options: ["shouldn't get", "needn't have got", "mustn't have got", "can't have got"], answer: "can't have got", why: "Логический вывод: почти уверен, что сообщение не получил." },
    { id: "mod-2", q: "The lights are off. They ___ gone to bed.", options: ["must have", "should have", "can have", "ought"], answer: "must have", why: "Вывод о прошлом: must have + V3." },
    { id: "mod-3", q: "She ___ left yet — her coat is still here.", options: ["mustn't have", "can't have", "needn't have", "shouldn't have"], answer: "can't have", why: "Пальто здесь, значит, она не могла уйти." },
    { id: "mod-4", q: "I ___ have taken an umbrella; it's pouring.", options: ["should", "must", "can", "would"], answer: "should", why: "Сожаление: should have + V3." },
    { id: "mod-5", q: "You ___ bought flowers; I didn't expect anything.", options: ["needn't have", "mustn't have", "can't have", "shouldn't"], answer: "needn't have", why: "Needn't have + V3: купили, хотя не нужно было." },
    { id: "mod-6", q: "Nobody answered the door. They ___ been out.", options: ["may have", "should have", "can have", "needn't have"], answer: "may have", why: "Возможность: may have been." },
    { id: "mod-7", q: "It ___ have been Tom you saw; he's in Spain.", options: ["can't", "mustn't", "shouldn't", "needn't"], answer: "can't", why: "Невозможность: can't have been." },
    { id: "mod-8", q: "By now they ___ arrived, so call them.", options: ["should have", "ought", "must", "can"], answer: "should have", why: "Ожидание: уже должны были приехать." },
    { id: "mod-9", q: "I'm sure she ___ well in the exam.", options: ["might do", "must have done", "can have done", "should do"], answer: "must have done", why: "I'm sure → must have + V3." },
    { id: "mod-10", q: "Where's my wallet? I'm afraid I ___ left it in the taxi.", options: ["might have", "mustn't have", "needn't have", "can't"], answer: "might have", why: "Возможное прошлое: might have." },
    { id: "mod-11", q: "She looked surprised, so she ___ (not / expect) us.", answer: "can't have expected|couldn't have expected", why: "Вывод: почти точно не ожидала." },
    { id: "mod-12", q: "He ___ (should / arrive) an hour ago.", answer: "should have arrived", why: "Ожидание в прошлом: should have + V3." },
  ],
};

export const PATTERN_DRILL: Drill = {
  id: "verb-patterns",
  title: "Глагол + -ing или to",
  tag: "Ваша ошибка: №31 · Empower Unit 8A",
  rule: [
    "После deny, admit, avoid, suggest, enjoy, finish, mind, risk, can't help, it's no use идёт -ing. После decide, hope, promise, manage, refuse, afford, plan, want, would like — to + инфинитив.",
    "Глаголы с разным смыслом: remember / forget + to (о том, что надо сделать) и + -ing (о том, что уже было); stop + -ing (прекратить), stop + to (остановиться, чтобы…); regret + to tell (сожалею, что сообщаю), regret + -ing (жалею о прошлом); try + to (попробовать, сделать усилие), try + -ing (проверить способ).",
    "После предлога всегда -ing: look forward to seeing, be used to getting up. Отрицание перед инфинитивом: promise not to be.",
  ],
  examples: [
    "He denied taking the money.",
    "I regret to inform you that…",
    "I remember locking the door.",
    "Don't forget to turn off the lights.",
    "I'm looking forward to seeing you.",
  ],
  items: [
    { id: "vp-1", q: "He denied ___ the money.", options: ["take", "taking", "to take", "having to take"], answer: "taking", why: "После deny — форма на -ing." },
    { id: "vp-2", q: "I regret ___ you that the flight is cancelled.", options: ["telling", "to tell", "tell", "to telling"], answer: "to tell", why: "Regret + to: сожалею, что сообщаю." },
    { id: "vp-3", q: "She suggested ___ a taxi.", options: ["to take", "taking", "us taking", "us to take"], answer: "taking", why: "Suggest + -ing." },
    { id: "vp-4", q: "I remember ___ the door, so I don't know why it was open.", options: ["to lock", "locking", "lock", "having to lock"], answer: "locking", why: "Remember + -ing: помню, что запирал." },
    { id: "vp-5", q: "Don't forget ___ the lights when you leave.", options: ["turning off", "to turn off", "turn off", "to turning off"], answer: "to turn off", why: "Forget + to: не забудьте сделать." },
    { id: "vp-6", q: "Walking home, I stopped ___ a postcard.", options: ["to buy", "buying", "buy", "bought"], answer: "to buy", why: "Stop + to: остановился, чтобы купить." },
    { id: "vp-7", q: "I can't help ___ when I hear that joke.", options: ["to laugh", "laughing", "laugh", "to laughing"], answer: "laughing", why: "Can't help + -ing." },
    { id: "vp-8", q: "We're looking forward ___ you.", options: ["to see", "to seeing", "seeing", "see"], answer: "to seeing", why: "To здесь предлог, поэтому -ing." },
    { id: "vp-9", q: "She's used ___ up early.", options: ["to get", "to getting", "getting", "get"], answer: "to getting", why: "Be used to + -ing: привыкла." },
    { id: "vp-10", q: "He promised ___ late again.", options: ["not being", "not to be", "don't be", "to not being"], answer: "not to be", why: "Promise + (not) to." },
    { id: "vp-11", q: "It's no use ___ about it.", options: ["to worry", "worrying", "worry", "to worrying"], answer: "worrying", why: "It's no use + -ing." },
    { id: "vp-12", q: "I tried ___ (open) the window, but it was stuck.", answer: "to open", why: "Try + to: пытался, но не получилось." },
    { id: "vp-13", q: "She admitted ___ (break) the vase.", answer: "breaking|having broken", why: "Admit + -ing." },
  ],
};

export const PERFECT_DRILL: Drill = {
  id: "perfect-aspect",
  title: "Перфектные времена",
  tag: "Empower Unit 1B",
  rule: [
    "Перфектные формы связывают два момента времени: Present Perfect — «до сейчас», Past Perfect — «до момента в прошлом», Future Perfect — «до момента в будущем». Продолжительная форма (been + -ing) подчёркивает длительность или то, что процесс шёл.",
    "Present Perfect используют с for / since / how long / this is the first time. С конкретным прошедшим временем (yesterday, last year) — только Past Simple.",
    "By the time / by + момент: Future Perfect (will have done), с длительностью — Future Perfect Continuous (will have been doing).",
  ],
  examples: [
    "By next June I will have been studying English for ten years.",
    "She had been waiting for two hours when he called.",
    "This is the first time I have eaten sushi.",
  ],
  items: [
    { id: "pf-1", q: "By the time you arrive, we ___ dinner.", options: ["will finish", "will have finished", "are finishing", "finish"], answer: "will have finished", why: "By the time + будущее: Future Perfect." },
    { id: "pf-2", q: "I ___ English for ten years by next June.", options: ["will study", "will have been studying", "am studying", "have studied"], answer: "will have been studying", why: "Длительность до момента в будущем: Future Perfect Continuous." },
    { id: "pf-3", q: "She ___ for two hours when he finally called.", options: ["waits", "had been waiting", "has been waiting", "will wait"], answer: "had been waiting", why: "Длительность до момента в прошлом." },
    { id: "pf-4", q: "I'm tired because I ___ all day.", options: ["work", "have been working", "had worked", "will work"], answer: "have been working", why: "Причина нынешнего состояния: Present Perfect Continuous." },
    { id: "pf-5", q: "Since computers ___ along, we talk about wireless internet.", options: ["came", "had come", "have come", "come"], answer: "have come", why: "Since + Present Perfect." },
    { id: "pf-6", q: "This is the first time I ___ sushi.", options: ["have eaten", "ate", "had eaten", "am eating"], answer: "have eaten", why: "This is the first time + Present Perfect." },
    { id: "pf-7", q: "When I arrived, the film ___.", options: ["already started", "had already started", "has already started", "was already starting"], answer: "had already started", why: "Раньше момента в прошлом: Past Perfect." },
    { id: "pf-8", q: "By 2050, scientists ___ a cure.", options: ["will find", "will have found", "find", "are finding"], answer: "will have found", why: "By + будущая дата: Future Perfect." },
    { id: "pf-9", q: "He said he ___ the report before the meeting.", options: ["had finished", "has finished", "finishes", "will finish"], answer: "had finished", why: "Косвенная речь: Present Perfect → Past Perfect." },
    { id: "pf-10", q: "How long ___ (you / know) her?", answer: "have you known", why: "How long + Present Perfect; know не используется в Continuous." },
    { id: "pf-11", q: "I ___ (live) here since 2015.", answer: "have lived|have been living", why: "Since + Present Perfect." },
    { id: "pf-12", q: "By the time we got to the station, the train ___ (already / leave).", answer: "had already left", why: "Событие раньше другого в прошлом: Past Perfect." },
  ],
};
