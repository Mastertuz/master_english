/**
 * Дополнительные образцы письма (задание 35): письма на разные позиции и с разным уровнем
 * языка. Все укладываются в 100–120 слов и оформлены по правилам: обращение, благодарность,
 * ответы на три вопроса, надежда на контакт, завершающая фраза и подпись на отдельных строках.
 */
export type WritingSample = { title: string; text: string };

export const WRITING_SAMPLES: Record<string, WritingSample[]> = {
  "demo-2027": [
    {
      title: "Маленькие города и поезд, жить в маленьком городе",
      text: "Dear Mary,\n\nThanks for your email! I was really glad to hear from you.\n\nI would recommend visiting Suzdal and Kostroma. Both towns are very old and quiet, and you can see wooden houses, monasteries and the Volga river there.\n\nAs for travelling, I think trains are the best way to see Russia. They are not expensive, and you can enjoy the landscapes through the window. You can also try tasty local food on the way.\n\nPersonally, I would prefer to live in a small town because the air is clean, there are no traffic jams and people know each other.\n\nSorry, I have to go now. Write back soon!\n\nBest wishes,\nDasha",
    },
    {
      title: "Большие города, самолёт, жить в мегаполисе",
      text: "Dear Mary,\n\nThank you for your recent email. I was very glad to hear from you again!\n\nAs for your questions, I recommend Veliky Ustyug and Sergiev Posad. Veliky Ustyug is the home of Russian Father Frost, and Sergiev Posad has a famous monastery, so both places are very interesting.\n\nThe quickest way to travel around Russia is by plane, because the country is huge. But if you have time, trains are more fun.\n\nI would rather live in a big city, because there are more universities, shops and chances to find a good job.\n\nI guess that’s all for now. Write back soon.\n\nBest wishes,\nIvan",
    },
    {
      title: "Выбор с условием: поездка на машине, жизнь рядом с природой",
      text: "Dear Mary,\n\nThanks for your email! It was great to hear from you.\n\nYou asked about small Russian towns. If I were you, I would go to Myshkin and Plyos. Myshkin has a funny Mouse Museum, and Plyos is a beautiful town on the Volga, which artists love to paint. It is also a good idea to rent a bike there.\n\nI think the best way to travel is by car, because you can stop wherever you like and see villages along the road.\n\nAs for living, a small town is better for me. I like walking by the river and I don’t like crowds.\n\nWrite back soon!\n\nBest wishes,\nOlga",
    },
    {
      title: "Короткие, простые фразы (уровень B1)",
      text: "Dear Mary,\n\nThank you for your email. I am happy to hear from you.\n\nI like small towns in Russia. I recommend Suzdal and Pskov. They are very old, and there are many churches and beautiful places. You can take a lot of photos there.\n\nI think the best way to travel is by train. It is comfortable and not very expensive. You can sleep at night and look out of the window in the morning.\n\nI want to live in a big city because I like shops, cinemas and cafés. There are many things to do there.\n\nI hope you will visit Russia one day.\n\nWrite back soon!\n\nBest wishes,\nAnton",
    },
  ],
  "variant-2": [
    {
      title: "Осенние каникулы: тихо и недорого",
      text: "Dear Alice,\n\nThanks for your email! I was really glad to hear from you.\n\nYou asked which holidays I prefer. I like autumn holidays best, because the weather is still nice and the streets are quiet. Besides, tickets and hotels are cheaper then.\n\nOn holiday my day is easy. I sleep until nine, go for a walk in the park and read a book. In the afternoon I often meet my friends and we go to the cinema.\n\nTo keep up my English, I watch short videos with subtitles and write messages to my pen friend. I always feel rested after such holidays.\n\nWrite back soon!\n\nBest wishes,\nMasha",
    },
    {
      title: "Весенние каникулы и поездка к бабушке",
      text: "Dear Alice,\n\nThank you for your recent e-mail. I was very glad to hear from you again!\n\nAs for your questions, I prefer spring holidays, because nature wakes up, it is warm and I can finally play outside. Besides, they come after a long winter.\n\nOn holiday I usually go to my grandmother’s village. I help her in the garden, ride my bike and have lunch with the whole family. In the evening we watch old films together.\n\nTo keep up my English, I listen to English podcasts and try to learn five new words every day.\n\nI guess that’s all for now. Write back soon.\n\nBest wishes,\nDenis",
    },
    {
      title: "Согласен с Алисой: зимние каникулы и поездки",
      text: "Dear Alice,\n\nThanks for your email! It was great to hear from you.\n\nI agree with you: winter holidays are the best. We have the New Year, snow and presents, and my family usually goes to the mountains. If it is snowy, I go skiing every day.\n\nWinter holidays are also the time when the whole family is together. My day on holiday is full of activities. We get up early, have breakfast and spend the whole day outside. In the evening we play board games.\n\nTo keep up my English, I read an English book for fifteen minutes a day and keep a short diary.\n\nWrite back soon!\n\nBest wishes,\nKate",
    },
    {
      title: "Летние каникулы и онлайн-курс (разнообразные конструкции)",
      text: "Dear Alice,\n\nThank you for your email. I was really glad to hear from you.\n\nAs for school holidays, I prefer the summer ones. They are much longer than the winter ones, so I can travel, swim in the sea and forget about homework for a while.\n\nMy typical holiday day starts late. I have a big breakfast, go to the beach and in the evening I meet my friends. I really enjoy this kind of holiday.\n\nTo keep up my English, I take an online course twice a week, and I also chat with foreign friends in video games.\n\nWrite back soon!\n\nBest wishes,\nNikita",
    },
  ],
  "variant-3": [
    {
      title: "Загруженный день с кружком, много домашки",
      text: "Dear Julia,\n\nThanks for your email! I was glad to hear from you.\n\nMy school days are quite busy. I get up at seven, have six lessons and then go to a music club twice a week. I come home at about five o’clock. I like my school because the teachers are friendly.\n\nHomework takes me about three hours, especially maths and history. I do it in the evening, and sometimes I finish at ten.\n\nIn my free time I like playing the guitar and reading fantasy books. At the weekend I meet my friends, and we go to the park or the cinema.\n\nWrite back soon!\n\nBest wishes,\nLena",
    },
    {
      title: "Спокойный день и спорт",
      text: "Dear Julia,\n\nThank you for your recent message. I was very glad to hear from you again!\n\nAs for your questions, my school day starts at eight and finishes at two. We usually have six lessons, and I like the long break because I can talk to my friends. I don’t like getting up early, but my friends make school fun.\n\nHomework takes me about an hour, so I have plenty of free time after that.\n\nI enjoy playing football and going cycling. At the weekend I often play computer games or watch matches with my dad.\n\nI guess that’s all for now. Write back soon.\n\nBest wishes,\nMax",
    },
    {
      title: "Школьник из маленького города: дорога и домашние дела",
      text: "Dear Julia,\n\nThanks for your email! It was great to hear from you.\n\nMy typical school day is long, because I live far from school. I take a bus at seven in the morning, have lessons until half past two and come back home at about four. I use this time to listen to audiobooks. It is a long day, but I don’t mind.\n\nI spend one and a half hours on homework. English and literature are quick, but physics takes more time.\n\nIn my free time I like drawing and listening to music. If the weather is good, I go for a walk with my dog.\n\nWrite back soon!\n\nBest wishes,\nSonya",
    },
    {
      title: "Выходные на первом месте, чёткие абзацы",
      text: "Dear Julia,\n\nThank you for your email. I was really glad to hear from you.\n\nI’m also looking forward to the weekend! On a typical school day, I get up at half past six, go to school by metro and have six or seven lessons. After school I have lunch and rest for an hour. It is a good way to relax.\n\nIt usually takes me about two hours to do my homework, but before tests it can take longer.\n\nIn my free time I love swimming, and I’m learning to cook. Last Sunday I baked a cake with my mum.\n\nWrite back soon!\n\nBest wishes,\nArtem",
    },
  ],
};
