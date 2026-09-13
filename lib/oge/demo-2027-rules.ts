/**
 * Правила к заданиям демоверсии ОГЭ 2027: на что опирается верный ответ.
 * Показываются преподавателю в самом варианте и всем — в разборе.
 */
export const demo2027Rules: Record<string, string> = {
  /* ── Аудирование, 1–4: запрашиваемая информация ── */
  "1": "Вопрос «advises on …» — о чём совет. Советы в английском звучат в повелительном наклонении (Wear…, Don’t go…, Do not forget…) или с should / had better. Верен вариант, который описывает именно эти советы, а не то, что просто упоминается рядом.",
  "2": "«Suggest buying» — что человек предлагает купить сейчас. Уже сделанное (I’ve already ordered) и отвергнутое (At first, I wanted…, but…) не подходит. Предложение выдаёт фраза-согласование: If you agree, I’ll pay.",
  "3": "Вопрос с because — ищем причину. После противительного But / However звучит главная мысль говорящего, она важнее того, что было сказано до союза: «Of course, I do! But I’ve always dreamed of…».",
  "4": "В диалоге о выборе ответ — окончательное решение, которое обычно звучит в конце (I’ll have it too). Варианты, от которых отказались, и варианты, которые просто перечислили, — ловушки.",

  /* ── Аудирование, 5: основное содержание ── */
  "5A": "Рубрика передаёт главную мысль всего высказывания, а не одной фразы. I dislike cinemas — недовольство кинотеатром как местом: шумные соседи, еда, телефоны, пинки в спинку кресла. К самим фильмам и к цене претензий нет.",
  "5B": "I choose wisely ≈ говорящий описывает, как он выбирает фильм: официальные рецензии критиков и мнение друзей с похожими вкусами. Рубрика — обобщение описанного способа.",
  "5C": "I recommend this film ≈ It is absolutely essential to watch it at least once. Рекомендацию усиливают оценочные слова: fantastic, superb, a great all-time classic.",
  "5D": "I avoid these kinds of films ≈ I never watch, You’ll never see me watching. «Kinds of films» = genres: horror, action.",
  "5E": "I find cinemas expensive ≈ I can’t make myself pay for a ticket, spend that much money on snacks. Решает деталь про деньги: нелюбовь к кино есть и у A, но о цене говорит только E.",

  /* ── Аудирование, 6–11: заполнение таблицы ── */
  "6": "Current job — нынешняя работа: Present Simple (I work there, I’m a librarian). Прошлый опыт в Present Perfect (I’ve worked as a waitress…) к строке не относится. Пишем одно слово из записи без артикля.",
  "7": "Number of … — количество, поэтому количественное числительное: twelve. По правилам заполнения числа записываются буквами; порядковое twelfth и цифры 12 не засчитываются.",
  "8": "Название языка — одно слово из записи: Chinese. Регистр при проверке не важен, а орфография важна полностью.",
  "9": "Hobby — существительное или герундий: travelling. Засчитываются британское (travelling, удвоенная l) и американское (traveling) написание.",
  "10": "В таблицу пишется слово без артикля: play the piano → piano. Инструмент, который назвал интервьюер и от которого отказались (bamboo flute), не подходит.",
  "11": "Regular — то, что делается регулярно: I jog almost every evening. Желаемое действие с would like (would like to go swimming) реальностью не является.",

  /* ── Чтение, 12: основное содержание ── */
  "12A": "К тексту подбирается вопрос о его главной мысли. Stereotype ≈ the image most people have in mind, seen by the rest of the world as… Следующее «The truth, however, is completely different» подтверждает, что речь о стереотипе.",
  "12B": "Modern profile — современный облик страны. Маркеры современности: dynamic, cosmopolitan, big businesses, new medical and scientific development, contemporary arts festivals.",
  "12C": "Luck and success ≈ win victories, bring fortune. Текст о поверьях, связанных с вереском, а не о том, что из него делали.",
  "12D": "Goods were made from ≈ used to make perfumes, ropes; heather honey, medicinal drinks, construction of houses — перечень изделий из растения-символа.",
  "12E": "Attractive place for those who love sports ≈ excellent destination for open-air activities: boating, sea-kayaking, fishing, hill climbing, skiing, hikes.",
  "12F": "National sporting event ≈ the Highland Games: традиционные атлетические состязания, которые проводятся и сегодня.",

  /* ── Чтение, 13–19: True / False / Not stated ── */
  "13": "True — текст говорит то же самое другими словами. Natural mark (природный знак) ≈ an old stone under a big tree, отмечающий официальный исток реки.",
  "14": "True — утверждение обобщает сказанное: cool and bright for the whole week, soft winds blew and the sun shone = погода была хорошей.",
  "15": "Not stated — в тексте нет информации ни «за», ни «против». Совпадение отдельных слов (Martin, rucksack) не означает, что упомянут сам факт: о том, что Том нёс рюкзак, не сказано.",
  "16": "False — текст противоречит утверждению. Слово all делает утверждение ложным, если найден хоть один противоположный пример: ночёвки в cheap hotel и Bed-and-Breakfasts.",
  "17": "Not stated — о туристах у статуи ничего не сказано. Ответ нельзя достраивать жизненным опытом: проверяется только написанное.",
  "18": "False — closed to navigation («закрыта для судоходства») противоречит busy with numerous boats and ships. Ищем описание с противоположным смыслом.",
  "19": "True — the river cut the capital in two и London sights подтверждают, что маршрут шёл через Лондон; the capital — синоним London.",

  /* ── Грамматика, 20–28 ── */
  "20": "Past Simple — завершённое действие в прошлом с указателем времени (yesterday, last week, ago, in 2010). Неправильные глаголы берут вторую форму: go – went – gone. В утвердительном предложении did не нужен.",
  "21": "Степени сравнения. Односложные и двусложные на -y: -er / the -est (big – bigger – the biggest, easy – easier – the easiest). Остальные прилагательные: more / the most (famous – more famous – the most famous). Признаки превосходной степени — артикль the и сравнение с группой: in Russia, in the world.",
  "22": "Present Simple — факты и общеизвестные истины. В 3-м лице единственного числа глагол получает -s/-es. Неопределённые местоимения everyone, everybody, someone, nobody, no one согласуются с глаголом в единственном числе: Everyone knows. Частица not перед местоимением форму глагола не меняет.",
  "23": "Past Simple — событие в прошлом с точной датой (in March 1776). Begin — неправильный глагол: begin – began – begun. Третья форма begun без have/had/be не употребляется.",
  "24": "Отрицание в Past Simple: did not (didn’t) + глагол в начальной форме без -ed: She didn’t mind. После mind следующий глагол — с -ing: mind having. Если дано NOT MIND, частица not обязательно входит в ответ.",
  "25": "Оборот there is / there are сообщает о наличии чего-то. Форма be согласуется с существительным после оборота: there was a box / there were boxes. Время — по контексту: рассказ о первоначальном здании в прошлом (had their seats).",
  "26": "Притяжательные местоимения стоят перед существительным и отвечают на вопрос «чей?»: I – my, you – your, he – his, she – her, it – its, we – our, they – their. Its пишется без апострофа; it’s = it is / it has.",
  "27": "Страдательный залог (Passive Voice): be в нужном времени + третья форма глагола. Нужен, когда подлежащее не совершает действие, а испытывает его; исполнитель вводится предлогом by. Past Simple Passive: was/were + V3 — It was designed by…",
  "28": "Условные предложения второго типа — нереальное условие в настоящем или будущем: If + Past Simple, … would + глагол. Would в части с if не ставится. Have во второй форме — had.",

  /* ── Словообразование, 29–34 ── */
  "29": "Суффикс -y образует прилагательные от существительных: sleep → sleepy, sun → sunny, rain → rainy, health → healthy. Прилагательное стоит после глаголов-связок feel, look, seem, become и в паре с другим прилагательным через and: down and sleepy.",
  "30": "Суффикс -ful образует прилагательные со значением «полный чего-то»: cheer → cheerful, help → helpful, care → careful, beauty → beautiful. Пишется с одной l. Противоположный суффикс — -less.",
  "31": "Существительные от глаголов: -ation/-tion (inform → information, educate → education), -ment (develop → development), -er/-or (teach → teacher). После this/that и притяжательных местоимений нужно существительное. Information — неисчисляемое: без -s, глагол в единственном числе.",
  "32": "Суффикс -less — «без чего-то», -ful — «с чем-то»: harmless (безвредный) ↔ harmful (вредный), careless ↔ careful. Выбор решает смысл всего фрагмента: дальше перечисляется вред, значит, «chocolate is not harmless» — «шоколад небезвреден».",
  "33": "Суффиксы -ance/-ence образуют существительные от глаголов: appear → appearance, perform → performance, differ → difference, exist → existence. После притяжательного местоимения (their) — существительное. Не путать с disappear — «исчезать».",
  "34": "Наречие образуется суффиксом -ly от прилагательного: absolute → absolutely, quick → quickly, happy → happily (y → i), terrible → terribly (-le → -ly). Наречие определяет прилагательное: absolutely safe, completely different.",
};
