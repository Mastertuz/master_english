import type { Pair, SpeakingStep, SpeakingTask } from "./types";

/** Слова по комнатам: одни и те же для трёх «прогулок» — меняется только глубина рассказа */
const HALL: Pair[] = [
  ["coat rack / hooks", "вешалка / крючки"],
  ["shoe rack", "полка для обуви"],
  ["doormat", "придверный коврик"],
  ["key hook", "ключница"],
  ["full-length mirror", "зеркало в полный рост"],
  ["built-in wardrobe", "встроенный шкаф"],
  ["intercom", "домофон"],
  ["draught", "сквозняк"],
];
const LIVING: Pair[] = [
  ["sofa / settee", "диван"],
  ["armchair", "кресло"],
  ["coffee table", "журнальный столик"],
  ["bookcase", "книжный шкаф"],
  ["rug", "ковёр"],
  ["blinds / curtains", "жалюзи / шторы"],
  ["radiator", "батарея"],
  ["cushions", "диванные подушки"],
  ["clutter", "беспорядок, нагромождение вещей"],
];
const KITCHEN: Pair[] = [
  ["hob", "варочная панель"],
  ["extractor hood", "вытяжка"],
  ["worktop", "рабочая поверхность"],
  ["cupboard", "шкафчик"],
  ["drawer", "выдвижной ящик"],
  ["kettle", "чайник"],
  ["dishwasher", "посудомоечная машина"],
  ["bin", "мусорное ведро"],
  ["cutlery", "столовые приборы"],
];
const BEDROOM: Pair[] = [
  ["double bed", "двуспальная кровать"],
  ["mattress", "матрас"],
  ["duvet", "одеяло"],
  ["chest of drawers", "комод"],
  ["bedside table", "прикроватная тумба"],
  ["blackout blinds", "плотные шторы (затемнение)"],
  ["alarm clock", "будильник"],
  ["wardrobe", "шкаф для одежды"],
];
const BATHROOM: Pair[] = [
  ["washbasin", "раковина"],
  ["tap", "кран"],
  ["towel rail", "полотенцесушитель"],
  ["shower screen", "душевая шторка / стенка"],
  ["washing machine", "стиральная машина"],
  ["mirror cabinet", "зеркальный шкафчик"],
  ["limescale", "известковый налёт"],
  ["tiles", "плитка"],
];
const BALCONY: Pair[] = [
  ["balcony railing", "ограждение балкона"],
  ["courtyard", "двор"],
  ["rooftops", "крыши"],
  ["potted plants", "растения в горшках"],
  ["clothes airer / dryer", "сушилка для белья"],
  ["overlook", "выходить окнами на"],
  ["a view of", "вид на"],
];

function walk(asks: [string, string, string, string, string, string]): SpeakingStep[] {
  return [
    { title: "Прихожая", ask: asks[0], words: HALL },
    { title: "Гостиная", ask: asks[1], words: LIVING },
    { title: "Кухня", ask: asks[2], words: KITCHEN },
    { title: "Спальня", ask: asks[3], words: BEDROOM },
    { title: "Ванная", ask: asks[4], words: BATHROOM },
    { title: "Балкон или вид из окна", ask: asks[5], words: BALCONY },
  ];
}

export const FLAT_TASKS: SpeakingTask[] = [
  {
    id: "flat-1",
    group: "flat",
    title: "Прогулка по квартире · 1. Что где лежит",
    mode: "steps",
    level: "B2+",
    prepSec: 30,
    minutes: 4,
    brief:
      "Встаньте у входной двери и мысленно (или на самом деле) пройдите по квартире комнату за комнатой. В каждой назовите, что там есть и где именно стоит. Цель этого круга — точные слова и предлоги места, без пауз. Говорите о том, что видите, а не о том, что придумали.",
    task:
      "Imagine you are showing a new tenant round your flat. Walk through each room and describe what there is and where everything is.",
    steps: walk([
      "Stand at the front door. What can you see straight ahead, to your left and to your right?",
      "Now move into the living room. Describe the furniture and where each piece stands.",
      "Go into the kitchen. Where do you keep things? What is next to what?",
      "Now the bedroom. What is by the bed, above it, under it?",
      "Walk into the bathroom. What does the new tenant need to know about it?",
      "Finish on the balcony or at the window. What can you see from there?",
    ]),
    phrases: [
      ["as you come in, you'll see…", "входя, вы увидите…"],
      ["straight ahead / on your left", "прямо перед вами / слева"],
      ["tucked away in the corner", "задвинут в угол"],
      ["right next to / just above", "прямо рядом с / чуть выше"],
      ["is built into the wall", "встроен в стену"],
      ["is crammed with", "забит до отказа"],
      ["overlooks the courtyard", "выходит окнами во двор"],
      ["the whole place is…", "вся квартира…"],
    ],
    grammar: ["There is / there are + place", "prepositions: next to, opposite, behind, above, underneath, in the corner of"],
    sample:
      "Right, let me show you round. As you come in, you'll find yourself in a narrow hall. Straight ahead is the living room, and on your left there's a built-in wardrobe — that's where the coats and shoes go. There's a mirror just opposite the door, and a little hook for the keys next to it. The living room is the largest room. There's a sofa against the far wall, with an armchair beside it, and a coffee table in the middle. The bookcase is tucked away in the corner by the window, and the TV stands opposite the sofa. Through the arch on the right you get to the kitchen. The hob is in the middle, with the extractor hood above it, and the fridge is in the corner. The kettle is on the worktop, next to the sink, and the cutlery is in the top drawer. Along the corridor there's the bedroom, with a double bed, a chest of drawers and a bedside table on either side. Opposite is the bathroom: washbasin on the left, shower at the end, and the washing machine underneath the shelf. Finally, the balcony overlooks the courtyard, so you can see the rooftops and the trees.",
    checks: [
      "Вы использовали разные предлоги, а не только «in» и «on»",
      "В каждой комнате назвали не меньше пяти предметов",
    ],
  },
  {
    id: "flat-2",
    group: "flat",
    title: "Прогулка по квартире · 2. Мнение и сравнения",
    mode: "steps",
    level: "B2+",
    prepSec: 45,
    minutes: 5,
    brief:
      "Тот же маршрут, но теперь вы не перечисляете, а оцениваете: что вам нравится, что не устраивает, что лучше или хуже, чем в других квартирах. Добавляйте прилагательные уровня C1 (cramped, airy, dated, spacious) и сравнения не просто «bigger», а «nowhere near as big as…».",
    task:
      "Walk through your flat again. This time, say what you like and dislike about each room, and compare it with other places you know.",
    steps: walk([
      "The hall: is it practical? What would you change?",
      "The living room: is it a place you actually relax in? Why or why not?",
      "The kitchen: compare it with the kitchen of a friend or a relative.",
      "The bedroom: does it help you sleep well? Explain.",
      "The bathroom: what's the best and the worst thing about it?",
      "The view or the balcony: how does it affect your mood?",
    ]),
    phrases: [
      ["it's on the small side", "маловата"],
      ["cramped / airy / spacious", "тесный / светлый, воздушный / просторный"],
      ["a bit dated / tired-looking", "немного устаревший / потрёпанный"],
      ["nowhere near as … as", "совсем не такой … как"],
      ["by far the …-est", "безусловно самый…"],
      ["what I like most about it is…", "что мне нравится больше всего — это…"],
      ["the downside is that…", "минус в том, что…"],
      ["it makes up for it by…", "это компенсируется тем, что…"],
    ],
    grammar: ["comparison: much / slightly / nowhere near as … as", "the more …, the more …", "cleft: What I like most is …"],
    sample:
      "I'll start with the hall, which is by far the weakest point of the flat. It's on the small side, and when two people come in at the same time it feels cramped. What I like about it, though, is the built-in wardrobe — nothing is lying around. The living room is a different story. It's much brighter than my old flat, and the big window makes it feel airy. The downside is that the radiator is right behind the sofa, so in winter it's almost too warm. The kitchen is nowhere near as modern as my brother's, but I wouldn't swap it: the worktop is long enough to cook properly, and it has everything within reach. The bedroom faces the courtyard, which means it's quiet at night — the quieter it is, the better I sleep. The bathroom is slightly dated, with old tiles, but it makes up for that with a really powerful shower. And finally the balcony: it's tiny, but looking at the rooftops in the evening is the best way I know to switch off.",
    checks: [
      "Вы сказали хотя бы три «минуса» и не просто хвалили",
      "Были сравнения с другим жильём",
    ],
  },
  {
    id: "flat-3",
    group: "flat",
    title: "Прогулка по квартире · 3. Истории и «если бы»",
    mode: "steps",
    level: "C1",
    prepSec: 60,
    minutes: 6,
    brief:
      "Третий круг самый сложный: в каждой комнате расскажите короткую историю (как вещь появилась, что здесь случилось) и добавьте сожаление или желание. Эта прогулка тренирует ваши слабые места из теста: wish, would rather, it's high time, третье условное и инверсию.",
    task:
      "Walk through your flat one more time. In every room, tell a short story connected with it and say what you wish were different.",
    steps: walk([
      "The hall: tell a story about a time you locked yourself out or forgot your keys. What would you do differently?",
      "The living room: how did you choose the furniture? Is there anything you regret buying?",
      "The kitchen: describe a cooking disaster. If you had known, what would you have done?",
      "The bedroom: what do you wish you could change here? What would you rather have?",
      "The bathroom: what is it high time you repaired or replaced?",
      "The balcony: what would you do with it if you had unlimited money?",
    ]),
    phrases: [
      ["I wish the … were bigger", "жаль, что … не больше"],
      ["if only I'd known…", "если бы только я знал…"],
      ["I'd rather you didn't …", "я бы предпочёл, чтобы вы не …"],
      ["it's high time I replaced…", "давно пора заменить…"],
      ["had I known, I'd have …", "знай я, я бы…"],
      ["not only is it …, but it also …", "это не только …, но и …"],
      ["little did I know…", "я и не подозревал…"],
      ["looking back, I should have …", "оглядываясь назад, мне стоило …"],
    ],
    grammar: [
      "wish + Past Simple (now) / Past Perfect (past)",
      "would rather + Past Simple (another person)",
      "It's (high) time + Past Simple",
      "Had I known, I would have … (inverted third conditional)",
    ],
    sample:
      "Let's start with the hall, because that's where I locked myself out last winter. I'd come back from the shop, put the bags down and — no keys. Had I thought to leave a spare with a neighbour, I'd have saved two hours in the cold. I wish I had one of those key hooks by the door. The living room: I bought the sofa online, and I wish I'd tried it first. Little did I know it would be so hard. If only I'd gone to a shop! It's high time I replaced it. In the kitchen, I once left a pan on the hob and answered the phone. Not only did the smoke alarm go off, but the neighbours came knocking. Had I turned the gas down, none of that would have happened. In the bedroom, I'd rather the windows faced the park, but they don't, so I just wish the courtyard were a bit quieter. The bathroom: it's high time I fixed the tap. And the balcony — with unlimited money, I'd glass it in and turn it into a winter garden, and I'd spend every evening there.",
    checks: [
      "Хотя бы три раза использовали wish или would rather",
      "Хотя бы одно предложение с Had I… (инверсия)",
      "Прошедшее время для событий и Past Perfect для того, что было раньше",
    ],
  },
  {
    id: "flat-furnish",
    group: "flat",
    title: "Пустая комната: обставьте её",
    mode: "record",
    level: "B2+",
    prepSec: 45,
    minutes: 3,
    brief:
      "Представьте пустую комнату 4 на 5 метров и бюджет. Расскажите, как вы её обставите: что куда поставите и почему. Это гипотетические предложения: would, could, if I had.",
    task:
      "You have just been given an empty room (four metres by five) and a modest budget. Explain how you would furnish it and why.",
    phrases: [
      ["I'd start by …", "я бы начал с …"],
      ["I'd place … against the wall", "я бы поставил … у стены"],
      ["to make the most of the space", "чтобы использовать место по максимуму"],
      ["that way, …", "так…"],
      ["if the budget allowed, I'd …", "если бы бюджет позволял, я бы…"],
      ["rather than …", "вместо того чтобы …"],
      ["I'd steer clear of …", "я бы не стал покупать …"],
    ],
    grammar: ["second conditional: If I had …, I'd …", "would + infinitive"],
    sample:
      "I'd start by thinking about what the room is for. If it's a living room, I'd put the sofa against the longest wall, so that you can see the whole room as you come in. I'd keep the centre fairly clear, with a rug and a low coffee table, rather than filling it with furniture. To make the most of the space, I'd go for shelves instead of a bulky cupboard, and I'd put them on the narrow wall by the window. If the budget allowed, I'd buy one good lamp for reading rather than three cheap ones, because lighting makes more difference than people think. I'd steer clear of dark colours: with only four metres of width, they'd make it feel like a cave. And I'd leave a corner free for a plant, just to make the place feel alive.",
  },
  {
    id: "flat-dream",
    group: "flat",
    title: "Дом мечты",
    mode: "record",
    level: "C1",
    prepSec: 60,
    minutes: 3,
    brief: "Опишите дом, в котором вы хотели бы жить, и скажите, почему именно он. Упор на wish, would rather и условные предложения.",
    task: "Describe the home of your dreams: where it is, what it looks like inside, and why it would suit you.",
    phrases: [
      ["I'd give anything to live in …", "я бы многое отдал, чтобы жить в …"],
      ["it would have to be …", "он обязательно должен быть …"],
      ["I'm not fussy about … as long as …", "я не придираюсь к …, пока …"],
      ["I'd rather live … than …", "я бы лучше жил …, чем …"],
      ["I wish I could …", "жаль, что я не могу …"],
      ["if money were no object", "если бы деньги не были проблемой"],
    ],
    grammar: ["wish + could", "I'd rather live …", "If money were no object, I would …"],
    sample:
      "If money were no object, I'd live in a house at the edge of a small town, close enough to a city to get there in an hour, but far enough to hear nothing at night. It would have to be a place with a lot of light — big windows in the kitchen and the study. I'm not fussy about the number of bedrooms, as long as there's one room just for books and for my work. I'd rather have a small house and a big garden than the other way round. I wish I could say I'd find it soon, but realistically, it's something I'm saving for. If I got it, the first thing I'd do is plant fruit trees, and in ten years I'd be eating my own apples.",
  },
  {
    id: "flat-move",
    group: "flat",
    title: "Переезд: объясните грузчикам",
    mode: "record",
    level: "B2+",
    prepSec: 30,
    minutes: 3,
    brief: "Вы переезжаете в новую квартиру. Объясните грузчикам, что куда ставить: точные указания и вежливые просьбы.",
    task: "You are moving into a new flat. Tell the removal men where to put the boxes and each piece of furniture. Be clear and polite.",
    phrases: [
      ["could you possibly …?", "не могли бы вы …?"],
      ["that one goes …", "это — вот сюда …"],
      ["mind the step / mind the door frame", "осторожно, ступенька / дверной проём"],
      ["leave it by the wall for now", "пока оставьте у стены"],
      ["marked 'fragile'", "с пометкой «хрупкое»"],
      ["we'll have to turn it on its side", "придётся поставить набок"],
    ],
    sample:
      "Morning! Thanks for coming. Could you possibly start with the sofa? It goes in the living room, against the long wall — there, under the window. Mind the door frame, it's a bit narrow, and you'll have to turn it on its side. The boxes marked 'fragile' go in the kitchen, please, on the worktop, not on the floor. Leave the wardrobe by the wall in the hall for now; I'll sort out the bedroom this afternoon. The bed goes in the room on the left, with the headboard against the window wall. If you could carry the washing machine to the bathroom first, that'd be great, because the plumber is coming at noon. And please, mind the step by the balcony door — I've already tripped over it twice.",
  },
  {
    id: "flat-street",
    group: "flat",
    title: "Прогулка по улице и маршрут",
    mode: "record",
    level: "B2+",
    prepSec: 30,
    minutes: 3,
    brief: "Выйдите мысленно из дома и объясните иностранцу, как дойти до ближайшей станции метро или центра. Затем опишите улицу.",
    task: "A tourist stops you outside your building. Explain how to get to the nearest metro station, then describe your street.",
    phrases: [
      ["you can't miss it", "вы его не пропустите"],
      ["carry on until you reach…", "идите прямо, пока не дойдёте до…"],
      ["take the second turning on the left", "второй поворот налево"],
      ["it's about a five-minute walk", "минут пять пешком"],
      ["opposite the pharmacy", "напротив аптеки"],
      ["at the traffic lights", "у светофора"],
    ],
    sample:
      "Right, you're standing outside my building. Go down the street to the end, then turn left at the traffic lights. Carry on until you reach a small square with a fountain; the metro is on the far side, opposite the pharmacy. You can't miss it. It's about a ten-minute walk. As for the street itself, it's quite a lively one: there's a bakery at the corner, and in the morning you can smell fresh bread all the way down to the bus stop. It's lined with old trees, so in summer it's quite shady. The only downside is the traffic at rush hour, but at night it's very quiet.",
  },
  {
    id: "flat-changes",
    group: "flat",
    title: "Как изменился ваш дом за десять лет",
    mode: "record",
    level: "C1",
    prepSec: 45,
    minutes: 3,
    brief: "Расскажите, чем ваше жильё (или двор, район) отличается от того, каким было десять лет назад. Тренируем Present Perfect и used to / would.",
    task: "Talk about how the place where you live has changed in the last ten years. What has stayed the same?",
    phrases: [
      ["it's changed beyond recognition", "изменился до неузнаваемости"],
      ["there used to be …", "раньше тут был …"],
      ["…has gone up / has been replaced by …", "… вырос / был заменён на …"],
      ["I've noticed that …", "я заметил, что …"],
      ["for better or for worse", "к лучшему или к худшему"],
      ["some things never change", "некоторые вещи не меняются"],
    ],
    grammar: ["used to / would for past habits", "Present Perfect for change up to now"],
    sample:
      "My neighbourhood has changed beyond recognition. Ten years ago there used to be an empty lot next to our building, and we'd play football there until it got dark. Now it's been replaced by a block of flats and an underground car park. Prices have gone up, too — I've noticed that people who grew up here can hardly afford to stay. On the plus side, the area has become much greener: they've planted trees along the street and built a proper cycle lane. For better or for worse, the old shops have mostly closed, though one thing hasn't changed: the baker at the corner still opens at six, and still knows what I want before I ask.",
  },
];
