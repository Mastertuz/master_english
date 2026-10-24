/**
 * Видео недели: конкретный доклад TED, после которого вы пишете краткое содержание
 * и отправляете его на проверку. Ссылки проверены, каждая ведёт на страницу доклада.
 */
export type WeekVideo = {
  id: string;
  title: string;
  speaker: string;
  url: string;
  /** Тема недели, к которой доклад подобран */
  why: string;
  /** Три вопроса для устного ответа после просмотра */
  questions: [string, string, string];
};

const ted = (slug: string) => `https://www.ted.com/talks/${slug}`;

export const VIDEOS: Record<number, WeekVideo> = {
  1: {
    id: "v-robinson",
    title: "Do schools kill creativity?",
    speaker: "Sir Ken Robinson",
    url: ted("sir_ken_robinson_do_schools_kill_creativity"),
    why: "Образование и творчество: близко вашей профессии, а юмор докладчика помогает понять живую речь.",
    questions: [
      "What is Robinson's main argument about schools?",
      "Do you agree that mistakes are treated as a disaster in education? Give an example from your teaching.",
      "How could you encourage creativity in your own lessons?",
    ],
  },
  2: {
    id: "v-kuhl",
    title: "The linguistic genius of babies",
    speaker: "Patricia Kuhl",
    url: ted("patricia_kuhl_the_linguistic_genius_of_babies"),
    why: "Юнит 1: как усваиваются языки.",
    questions: [
      "What happens to babies' ability to hear foreign sounds as they grow older?",
      "What did the experiment with the live teacher and the video show?",
      "What does this say about the best way to learn a language as an adult?",
    ],
  },
  3: {
    id: "v-boroditsky",
    title: "How language shapes the way we think",
    speaker: "Lera Boroditsky",
    url: ted("lera_boroditsky_how_language_shapes_the_way_we_think"),
    why: "Юнит 1: язык и мышление; хороший материал для разговоров с учениками.",
    questions: [
      "Which examples of different languages does Boroditsky give?",
      "Do you think the language you speak changes the way you think? Why?",
      "Does this idea change how you would teach vocabulary?",
    ],
  },
  4: {
    id: "v-mcgonigal",
    title: "How to make stress your friend",
    speaker: "Kelly McGonigal",
    url: ted("kelly_mcgonigal_how_to_make_stress_your_friend"),
    why: "Юнит 2: экстремальные ощущения и реакция на стресс.",
    questions: [
      "What did the study of 30,000 adults show?",
      "How can your view of stress change your body's reaction?",
      "Describe a stressful situation in your life and how you could see it differently.",
    ],
  },
  5: {
    id: "v-petit",
    title: "The journey across the high wire",
    speaker: "Philippe Petit",
    url: ted("philippe_petit_the_journey_across_the_high_wire"),
    why: "Юнит 2: рассказ о плане, риске и осуществлении; отлично для narrative tenses.",
    questions: [
      "How did Petit prepare for the walk between the towers?",
      "What does he say about fear and about doing the impossible?",
      "Retell the story as if you were a journalist describing it the next day.",
    ],
  },
  6: {
    id: "v-adichie",
    title: "The danger of a single story",
    speaker: "Chimamanda Ngozi Adichie",
    url: ted("chimamanda_ngozi_adichie_the_danger_of_a_single_story"),
    why: "Юнит 3: стереотипы и взгляд на чужие страны; связано с критикой волонтёрских поездок.",
    questions: [
      "What does Adichie mean by 'a single story'?",
      "Which of her personal examples did you find most striking?",
      "Is there a single story about your own country that you would like to change?",
    ],
  },
  7: {
    id: "v-iyer",
    title: "Where is home?",
    speaker: "Pico Iyer",
    url: ted("pico_iyer_where_is_home"),
    why: "Юнит 3: путешествия и чувство дома.",
    questions: [
      "How does Iyer define 'home'?",
      "How would you answer the question 'Where is home?' for yourself?",
      "What does travelling teach people about their own country?",
    ],
  },
  8: {
    id: "v-kahneman",
    title: "The riddle of experience vs. memory",
    speaker: "Daniel Kahneman",
    url: ted("daniel_kahneman_the_riddle_of_experience_vs_memory"),
    why: "Юнит 4: память и опыт.",
    questions: [
      "What is the difference between the experiencing self and the remembering self?",
      "What was the example of the colonoscopy (or the vacation) meant to show?",
      "How does this idea affect the way you plan holidays or lessons?",
    ],
  },
  9: {
    id: "v-loftus",
    title: "How reliable is your memory?",
    speaker: "Elizabeth Loftus",
    url: ted("elizabeth_loftus_how_reliable_is_your_memory"),
    why: "Юнит 4: ложные воспоминания и свидетельские показания.",
    questions: [
      "How can memories be changed or even created?",
      "Why is this a serious problem in court cases?",
      "Have you ever remembered something that turned out to be wrong? Describe it.",
    ],
  },
  10: {
    id: "v-stevenson",
    title: "We need to talk about an injustice",
    speaker: "Bryan Stevenson",
    url: ted("bryan_stevenson_we_need_to_talk_about_an_injustice"),
    why: "Юнит 5: справедливость, преступление и наказание.",
    questions: [
      "What problems in the justice system does Stevenson describe?",
      "Which of his four suggestions do you find the most convincing?",
      "How fair is the justice system in your country, in your opinion?",
    ],
  },
  11: {
    id: "v-pink",
    title: "The puzzle of motivation",
    speaker: "Dan Pink",
    url: ted("dan_pink_the_puzzle_of_motivation"),
    why: "Юнит 5: работа, оплата и мотивация.",
    questions: [
      "What did the candle problem experiment show?",
      "What are the three elements of motivation according to Pink?",
      "Which of them matters most in your own work, and why?",
    ],
  },
  12: {
    id: "v-treasure",
    title: "How to speak so that people want to listen",
    speaker: "Julian Treasure",
    url: ted("julian_treasure_how_to_speak_so_that_people_want_to_listen"),
    why: "Юнит 6: презентации. Это ещё и практическое пособие по голосу.",
    questions: [
      "What are the 'seven deadly sins of speaking'?",
      "Which of the four powerful tools (HAIL) could you use in your lessons?",
      "Which of your own speaking habits would you like to change?",
    ],
  },
  13: {
    id: "v-cuddy",
    title: "Your body language may shape who you are",
    speaker: "Amy Cuddy",
    url: ted("amy_cuddy_your_body_language_may_shape_who_you_are"),
    why: "Юнит 6: первое впечатление и уверенность.",
    questions: [
      "What is a 'power pose' and what does the research claim?",
      "Why does the speaker say 'fake it till you become it'?",
      "Would you try this before an important lesson or exam? Why or why not?",
    ],
  },
  14: {
    id: "v-harris",
    title: "How a handful of tech companies control billions of minds every day",
    speaker: "Tristan Harris",
    url: ted("tristan_harris_how_a_handful_of_tech_companies_control_billions_of_minds_every_day"),
    why: "Юнит 7: технологии и внимание.",
    questions: [
      "How do tech companies compete for our attention?",
      "Which of Harris's examples of how apps grab our attention did you recognise?",
      "What would you change in your own phone habits after watching?",
    ],
  },
  15: {
    id: "v-turkle",
    title: "Connected, but alone?",
    speaker: "Sherry Turkle",
    url: ted("sherry_turkle_connected_but_alone"),
    why: "Юнит 7: интернет и одиночество.",
    questions: [
      "What does Turkle mean by being 'alone together'?",
      "Which of her examples about teenagers and texting do you agree with?",
      "Do you think technology brings people closer or pushes them apart?",
    ],
  },
  16: {
    id: "v-walker",
    title: "Sleep is your superpower",
    speaker: "Matt Walker",
    url: ted("matt_walker_sleep_is_your_superpower"),
    why: "Юнит 8: сон и здоровье.",
    questions: [
      "What does Walker say lack of sleep does to the body and the brain?",
      "Which piece of evidence in the talk surprised you most?",
      "What advice would you give to a student who sleeps five hours a night?",
    ],
  },
  17: {
    id: "v-buettner",
    title: "How to live to be 100+",
    speaker: "Dan Buettner",
    url: ted("dan_buettner_how_to_live_to_be_100"),
    why: "Юнит 8: образ жизни и продолжительность жизни.",
    questions: [
      "What are the 'Blue Zones' and what do they have in common?",
      "Which of the lifestyle habits could you adopt easily?",
      "Is a long life more important than a happy life? Give reasons.",
    ],
  },
  18: {
    id: "v-aravena",
    title: "My architectural philosophy? Bring the community into the process",
    speaker: "Alejandro Aravena",
    url: ted("alejandro_aravena_my_architectural_philosophy_bring_the_community_into_the_process"),
    why: "Юнит 9: архитектура и город.",
    questions: [
      "What is unusual about Aravena's approach to housing?",
      "How does he involve the people who will live there?",
      "What building or public space in your city would you redesign, and how?",
    ],
  },
  19: {
    id: "v-dunham",
    title: "Retrofitting suburbia",
    speaker: "Ellen Dunham-Jones",
    url: ted("ellen_dunham_jones_retrofitting_suburbia"),
    why: "Юнит 9: переосмысление городского пространства.",
    questions: [
      "What does 'retrofitting' mean in this talk?",
      "Which of the examples would work in your city?",
      "What is the advantage of reusing old spaces instead of building new ones?",
    ],
  },
  20: {
    id: "v-anderson",
    title: "TED's secret to great public speaking",
    speaker: "Chris Anderson",
    url: ted("chris_anderson_ted_s_secret_to_great_public_speaking"),
    why: "Юнит 10: выступления. Разберите, как построена речь.",
    questions: [
      "What is the 'throughline' and why does it matter?",
      "What advice does Anderson give for making an idea clear and worth sharing?",
      "How could you apply these ideas when you explain grammar to students?",
    ],
  },
  21: {
    id: "v-shermer",
    title: "Why people believe weird things",
    speaker: "Michael Shermer",
    url: ted("michael_shermer_why_people_believe_weird_things"),
    why: "Юнит 10: суеверия и верования.",
    questions: [
      "Why, according to Shermer, do people believe weird things?",
      "What is 'patternicity'? Give an example from daily life.",
      "Do you have any small superstitions? Do you believe in them?",
    ],
  },
  22: {
    id: "v-cain",
    title: "The power of introverts",
    speaker: "Susan Cain",
    url: ted("susan_cain_the_power_of_introverts"),
    why: "Экзаменный режим: длинный монолог с примерами и структурой «проблема, довод, вывод».",
    questions: [
      "What does Cain say schools and workplaces get wrong about introverts?",
      "Which of her personal experiences did you find most convincing?",
      "How should teachers adapt lessons for quiet students?",
    ],
  },
  23: {
    id: "v-urban",
    title: "Inside the mind of a master procrastinator",
    speaker: "Tim Urban",
    url: ted("tim_urban_inside_the_mind_of_a_master_procrastinator"),
    why: "Экзаменный режим: юмор и скорость речи, тренировка быстрого понимания.",
    questions: [
      "Who are the 'Instant Gratification Monkey' and the 'Panic Monster'?",
      "Which kind of procrastination does Urban say is the most dangerous?",
      "What is your own strategy for dealing with deadlines?",
    ],
  },
  24: {
    id: "v-sinek",
    title: "How great leaders inspire action",
    speaker: "Simon Sinek",
    url: ted("simon_sinek_how_great_leaders_inspire_action"),
    why: "Итог: понятная структура «зачем — как — что». Сравните, насколько легче вы понимаете речь, чем 24 недели назад.",
    questions: [
      "What is the 'golden circle' and how is it organised?",
      "Which example in the talk is the most persuasive for you?",
      "What is your own 'why' as a teacher?",
    ],
  },
};

export function videoById(id: string): (WeekVideo & { week: number }) | undefined {
  for (const [week, video] of Object.entries(VIDEOS)) {
    if (video.id === id) return { ...video, week: Number(week) };
  }
  return undefined;
}
