import type { DeckSource } from "./types";

/** Темы повседневной жизни: от A2 до C1 */
export const TOPIC_DECKS_C: DeckSource[] = [
  {
    id: "topic-jobs",
    title: "Профессии",
    group: "topic",
    level: "A1–B2",
    icon: "👩‍🚒",
    description: "Кто чем занимается: от учителя и повара до адвоката и хирурга.",
    lines: `
accountant | бухгалтер | n | My mother is an accountant.
architect | архитектор | n | The architect designed our school.
baker | пекарь | n | The baker gets up at four.
barber | парикмахер (мужской) | n | My barber is very good.
builder | строитель | n | The builders are fixing the roof.
carpenter | плотник, столяр | n | A carpenter made this table.
cashier | кассир | n | Pay the cashier.
chef | шеф-повар | n | He's a famous chef.
cleaner | уборщик, уборщица | n | The cleaner comes on Fridays.
dentist | стоматолог | n | I hate going to the dentist.
electrician | электрик | n | Call an electrician.
engineer | инженер | n | He's a software engineer.
estate agent | риелтор | n | The estate agent showed us the flat.
farmer | фермер | n | The farmer grows wheat.
firefighter | пожарный | n | Firefighters saved the cat.
flight attendant | бортпроводник | n | She's a flight attendant.
hairdresser | парикмахер | n | My hairdresser cut my hair too short.
interpreter | устный переводчик | n | We need an interpreter.
librarian | библиотекарь | n | The librarian helped me find the book.
mechanic | механик | n | The mechanic repaired my car.
miner | шахтёр | n | Miners work underground.
pharmacist | фармацевт | n | Ask the pharmacist.
plumber | сантехник | n | The plumber fixed the tap.
police officer | полицейский | n | A police officer stopped us.
postman | почтальон | n | The postman brought a letter.
receptionist | администратор, секретарь на ресепшене | n | Ask the receptionist for the key.
scientist | учёный | n | Scientists study the planet.
security guard | охранник | n | The security guard opened the gate.
shop assistant | продавец | n | The shop assistant was helpful.
surgeon | хирург | n | The surgeon saved his life.
tailor | портной | n | The tailor made me a suit.
translator | письменный переводчик | n | She's a translator of novels.
vet | ветеринар | n | Take the dog to the vet.
`,
  },
  {
    id: "topic-cooking",
    title: "Кухня и приготовление еды",
    group: "topic",
    level: "A2–B2",
    icon: "🍳",
    description: "Как готовить: действия, посуда, вкусы и рецепты.",
    lines: `
grill | жарить на гриле | v | We grilled some fish.
roast | запекать | v | Roast the chicken for an hour.
steam | готовить на пару | v | Steam the vegetables.
simmer | варить на медленном огне | v | Simmer the soup gently.
slice | нарезать ломтиками | v | Slice the bread.
peel | чистить (кожуру) | v | Peel the potatoes.
grate | тереть на тёрке | v | Grate the cheese.
stir | размешивать | v | Stir the soup.
mix | смешивать | v | Mix the eggs and flour.
whisk | взбивать | v | Whisk the cream.
pour | наливать, лить | v | Pour the milk into a bowl.
sprinkle | посыпать | v | Sprinkle some salt on top.
melt | растапливать | v | Melt the butter.
season | приправлять | v | Season the meat with pepper.
squeeze | выжимать | v | Squeeze a lemon.
ingredient | ингредиент | n | Mix all the ingredients.
recipe | рецепт | n | It's my grandmother's recipe.
frying pan | сковорода | n | Heat the frying pan.
saucepan | кастрюля, ковш | n | Put the milk in a saucepan.
kettle | чайник (для кипячения) | n | Put the kettle on.
oven | духовка | n | Take the pie out of the oven.
bowl | миска | n | Put the salad in a bowl.
cutlery | столовые приборы | n | The cutlery is in the drawer.
tin opener | консервный нож | n | I can't find the tin opener.
flour | мука | n | Add two cups of flour.
dough | тесто | n | Leave the dough to rise.
spice | специя, пряность | n | Indian food has a lot of spices.
tender | нежный, мягкий | adj | The meat is very tender.
bitter | горький | adj | The coffee is bitter.
sour | кислый | adj | Lemons are sour.
bland | пресный, безвкусный | adj | The soup was bland.
crispy | хрустящий | adj | I love crispy bacon.
leftovers | остатки еды | n | We ate the leftovers.
portion | порция | n | The portions are huge.
`,
  },
  {
    id: "topic-diet-health",
    title: "Здоровый образ жизни и питание",
    group: "topic",
    level: "B1–C1",
    icon: "🥗",
    description: "Питание, сон, привычки и самочувствие.",
    lines: `
balanced diet | сбалансированное питание | col | A balanced diet keeps you healthy.
nutrition | питание | n | Good nutrition is essential.
nutritious | питательный | adj | Nuts are nutritious.
nutrient | питательное вещество | n | Vegetables are full of nutrients.
protein | белок | n | Eggs are rich in protein.
carbohydrates | углеводы | n | Bread contains carbohydrates.
fat | жир | n | Cut down on fat.
fibre | клетчатка | n | Eat more fibre.
calorie | калория | n | How many calories are in an apple?
junk food | вредная еда | n | Avoid junk food.
processed food | обработанные продукты | n | Processed food contains a lot of salt.
portion size | размер порции | col | Watch your portion size.
obesity | ожирение | n | Obesity is a growing problem.
overweight | с лишним весом | adj | He's slightly overweight.
lose weight | похудеть | col | I want to lose weight.
put on weight | набрать вес | col | She has put on weight.
appetite | аппетит | n | I have no appetite.
craving | сильное желание (съесть что-то) | n | I have a craving for chocolate.
binge | переедать, объедаться | v | Don't binge on sweets.
skip meals | пропускать приёмы пищи | col | It's unhealthy to skip meals.
dehydrated | обезвоженный | adj | Drink water or you'll get dehydrated.
sedentary | сидячий, малоподвижный | adj | He leads a sedentary lifestyle.
wellbeing | благополучие, хорошее самочувствие | n | Sleep is vital for your wellbeing.
get enough sleep | высыпаться | col | Teenagers don't get enough sleep.
insomnia | бессонница | n | She suffers from insomnia.
nap | дремота, короткий сон | n | I took a nap after lunch.
intolerance | непереносимость | n | He has a lactose intolerance.
vegan | веган, веганский | n | My sister is a vegan.
moderation | умеренность | n | Eat everything in moderation.
addiction | зависимость | n | Sugar addiction is real.
quit | бросить (привычку) | v | He quit smoking.
in good shape | в хорошей форме | col | She's in good shape.
life expectancy | продолжительность жизни | n | Life expectancy is rising.
immune system | иммунная система | n | Vitamins support the immune system.
`,
  },
  {
    id: "topic-appearance",
    title: "Внешность",
    group: "topic",
    level: "A2–B2",
    icon: "🪞",
    description: "Как описать лицо, волосы, фигуру и стиль человека.",
    lines: `
good-looking | привлекательный | adj | He's very good-looking.
handsome | красивый (о мужчине) | adj | He's a handsome man.
pretty | хорошенькая, симпатичная | adj | She's a pretty girl.
gorgeous | великолепный, потрясающий | adj | You look gorgeous!
ugly | некрасивый | adj | What an ugly building!
skinny | тощий | adj | He's too skinny.
plump | пухлый, полный | adj | The baby has plump cheeks.
overweight | полный, с лишним весом | adj | The doctor said he was overweight.
muscular | мускулистый | adj | He has muscular arms.
well-built | крепкого телосложения | adj | He's tall and well-built.
medium height | средний рост | col | She's of medium height.
curly | кудрявый | adj | She has curly hair.
wavy | волнистый | adj | His hair is wavy.
straight | прямой | adj | I have straight hair.
bald | лысый | adj | My uncle is bald.
fair | светлый (о волосах, коже) | adj | She has fair skin.
dark-haired | темноволосый | adj | He's a dark-haired boy.
ginger | рыжий | adj | He has ginger hair.
fringe | чёлка | n | I want a fringe.
ponytail | конский хвост (причёска) | n | She wears a ponytail.
plait | коса | n | She has two plaits.
beard | борода | n | He's growing a beard.
moustache | усы | n | My grandad has a moustache.
freckles | веснушки | n | She has freckles on her nose.
wrinkle | морщина | n | He has wrinkles around his eyes.
dimple | ямочка | n | She has dimples when she smiles.
scar | шрам | n | He has a scar on his chin.
eyebrow | бровь | n | She raised her eyebrows.
eyelashes | ресницы | n | She has long eyelashes.
cheek | щека | n | He kissed her on the cheek.
chin | подбородок | n | He has a strong chin.
forehead | лоб | n | She has a high forehead.
complexion | цвет лица | n | She has a pale complexion.
tanned | загорелый | adj | You look tanned.
pale | бледный | adj | You look pale. Are you OK?
elegant | элегантный | adj | She's always elegant.
scruffy | неряшливый | adj | He looks scruffy.
well-dressed | хорошо одетый | adj | He's always well-dressed.
take after | быть похожим на (родственника) | pv | She takes after her mother.
`,
  },
  {
    id: "topic-character-advanced",
    title: "Характер: точные описания",
    group: "topic",
    level: "B2–C1",
    icon: "🧩",
    description: "Черты характера вместо простых kind и bad: от considerate до stubborn.",
    lines: `
affectionate | ласковый, любящий | adj | She's an affectionate child.
aloof | отчуждённый, холодный | adj | He seemed aloof at first.
altruistic | альтруистичный | adj | Her motives were altruistic.
arrogant | высокомерный | adj | He's rich and arrogant.
assertive | уверенный, умеющий отстоять себя | adj | Be more assertive at work.
bossy | любящий командовать | adj | My older sister is bossy.
charismatic | харизматичный | adj | He's a charismatic leader.
conceited | самовлюблённый | adj | He's so conceited!
conscientious | добросовестный | adj | She's a conscientious worker.
considerate | внимательный к другим | adj | It was considerate of you to call.
cunning | хитрый | adj | He's as cunning as a fox.
down-to-earth | приземлённый, практичный | adj | She's friendly and down-to-earth.
easy-going | лёгкий в общении, спокойный | adj | Our boss is easy-going.
empathetic | умеющий сопереживать | adj | A doctor should be empathetic.
extrovert | экстраверт | n | He's a real extrovert.
introvert | интроверт | n | Introverts need time alone.
gullible | доверчивый, легковерный | adj | Don't be so gullible.
headstrong | упрямый, своевольный | adj | She was a headstrong teenager.
hypocritical | лицемерный | adj | It's hypocritical to say that.
impulsive | импульсивный | adj | He made an impulsive decision.
indecisive | нерешительный | adj | I'm hopelessly indecisive.
insecure | неуверенный в себе | adj | She feels insecure about her looks.
level-headed | рассудительный | adj | We need a level-headed person.
modest | скромный | adj | He's modest about his success.
moody | переменчивого настроения, угрюмый | adj | Teenagers are often moody.
narrow-minded | ограниченный, недалёкий | adj | Don't be narrow-minded.
nosy | любопытный, сующий нос | adj | Our neighbours are nosy.
obedient | послушный | adj | It's an obedient dog.
open-minded | непредвзятый, открытый новому | adj | Travel makes you open-minded.
outspoken | прямой, откровенный | adj | He's an outspoken critic.
pushy | напористый, назойливый | adj | The salesman was too pushy.
reserved | сдержанный | adj | English people are said to be reserved.
resourceful | находчивый | adj | She's resourceful in a crisis.
selfless | бескорыстный | adj | Nurses do selfless work.
shallow | поверхностный | adj | He's a shallow person.
sincere | искренний | adj | It was a sincere apology.
tactful | тактичный | adj | She gave a tactful answer.
thick-skinned | толстокожий, нечувствительный | adj | Politicians must be thick-skinned.
vain | тщеславный | adj | He's vain about his hair.
witty | остроумный | adj | She's witty and clever.
`,
  },
  {
    id: "topic-relationships",
    title: "Дружба, любовь и отношения",
    group: "topic",
    level: "B1–C1",
    icon: "💞",
    description: "Знакомства, ссоры и примирения, доверие и поддержка.",
    lines: `
acquaintance | знакомый | n | He's an acquaintance, not a friend.
best friend | лучший друг | n | We've been best friends since school.
close-knit | сплочённый | adj | We're a close-knit family.
get on well with | ладить с | pv | I get on well with my sister.
fall out with | поссориться с | pv | She fell out with her best friend.
make up | помириться | pv | They argued but soon made up.
get to know | познакомиться поближе | col | I'd like to get to know you.
have a lot in common | иметь много общего | col | We have a lot in common.
hit it off | сразу поладить | idiom | We hit it off immediately.
drift apart | отдалиться друг от друга | pv | After school we drifted apart.
keep in touch | поддерживать связь | col | Let's keep in touch.
ask out | пригласить на свидание | pv | He finally asked her out.
date | свидание | n | They went on a date.
go out with | встречаться с | pv | She's going out with Tom.
fall in love | влюбиться | col | They fell in love at university.
love at first sight | любовь с первого взгляда | idiom | It was love at first sight.
crush | увлечение, влюблённость | n | She has a crush on him.
flirt | флиртовать | v | He flirts with everyone.
propose | делать предложение (брака) | v | He proposed on the beach.
engaged | помолвленный | adj | They got engaged last week.
fiancé | жених | n | This is my fiancé.
wedding | свадьба | n | The wedding is in June.
bride | невеста | n | The bride wore white.
groom | жених (на свадьбе) | n | The groom was nervous.
newlyweds | молодожёны | n | The newlyweds went to Italy.
split up | разойтись | pv | His parents split up.
divorce | развод | n | They're getting a divorce.
betray | предавать | v | Don't betray your friends.
loyal | верный, преданный | adj | She's a loyal friend.
cheat on | изменять (партнёру) | pv | He cheated on his girlfriend.
argue | спорить, ссориться | v | They argue about money.
affection | привязанность, нежность | n | She shows great affection.
bond | связь, узы | n | There's a strong bond between them.
intimate | близкий, интимный | adj | We had an intimate conversation.
soulmate | родственная душа | n | She believes he's her soulmate.
`,
  },
  {
    id: "topic-upbringing",
    title: "Детство и воспитание",
    group: "topic",
    level: "B1–C1",
    icon: "🧸",
    description: "Родители и дети, взросление, правила и поколения.",
    lines: `
childhood | детство | n | I had a happy childhood.
infant | младенец | n | Infants sleep a lot.
toddler | малыш (1–3 года) | n | The toddler is learning to walk.
teenager | подросток | n | Teenagers need freedom.
adolescence | подростковый возраст | n | Adolescence can be difficult.
adult | взрослый | n | Tickets for adults cost £10.
bring up children | воспитывать детей | col | It's hard to bring up children alone.
upbringing | воспитание | n | She had a strict upbringing.
raise a child | растить ребёнка | col | It takes a village to raise a child.
parenting | родительство, воспитание | n | They read books on parenting.
babysitter | няня (на несколько часов) | n | We need a babysitter tonight.
orphan | сирота | n | He was an orphan.
foster parents | приёмные родители (временные) | n | She lived with foster parents.
only child | единственный ребёнок | col | I'm an only child.
sibling | брат или сестра | n | Do you have any siblings?
sibling rivalry | соперничество между братьями и сёстрами | col | Sibling rivalry is normal.
spoil | баловать | v | Don't spoil your children.
spoilt | избалованный | adj | He's a spoilt child.
strict | строгий | adj | My parents are strict.
lenient | снисходительный | adj | The teacher is too lenient.
overprotective | чрезмерно опекающий | adj | Her mother is overprotective.
discipline | дисциплина | n | Children need discipline.
punish | наказывать | v | He was punished for lying.
reward | награждать, поощрять | v | Reward good behaviour.
praise | хвалить | v | Parents should praise their children.
tell off | отчитать, отругать | pv | The teacher told me off.
naughty | непослушный | adj | He's a naughty boy.
well-behaved | воспитанный | adj | The children are well-behaved.
rebel | бунтовать | v | Teenagers often rebel.
peer | сверстник | n | Children learn from their peers.
peer pressure | давление сверстников | n | He smoked because of peer pressure.
role model | пример для подражания | n | My father is my role model.
generation gap | разрыв поколений | col | There's a generation gap between us.
pocket money | карманные деньги | n | I get pocket money every week.
household chores | домашние обязанности | col | Children should do household chores.
nostalgia | ностальгия | n | He remembers school with nostalgia.
formative years | годы становления личности | col | She spent her formative years in Spain.
`,
  },
  {
    id: "topic-holidays",
    title: "Праздники и традиции",
    group: "topic",
    level: "A2–B2",
    icon: "🎉",
    description: "Дни рождения, Новый год, подарки, обычаи и гости.",
    lines: `
celebrate | праздновать | v | How do you celebrate New Year?
celebration | празднование | n | It was a big celebration.
birthday | день рождения | n | Happy birthday!
anniversary | годовщина | n | It's our wedding anniversary.
Christmas | Рождество | n | We spend Christmas at home.
Christmas Eve | канун Рождества | n | Shops close early on Christmas Eve.
Easter | Пасха | n | We paint eggs at Easter.
New Year's Eve | канун Нового года | n | We stay up late on New Year's Eve.
public holiday | государственный праздник | n | Monday is a public holiday.
festival | фестиваль, праздник | n | The film festival starts today.
carnival | карнавал | n | The carnival in Rio is famous.
parade | парад | n | We watched the parade.
fireworks | фейерверк | n | The fireworks were amazing.
decorate | украшать | v | We decorated the tree.
candle | свеча | n | Blow out the candles.
gift | подарок | n | Thank you for the gift.
wrap | заворачивать (подарок) | v | Wrap the present.
greeting card | поздравительная открытка | n | I sent her a greeting card.
congratulate | поздравлять | v | We congratulated him on his success.
guest | гость | n | We invited twenty guests.
host | хозяин, принимающий гостей | n | Our host was very kind.
throw a party | устроить вечеринку | col | They threw a party for her.
toast | тост (за кого-либо) | n | Let's drink a toast to Anna.
feast | пир, праздничный обед | n | We had a great feast.
custom | обычай | n | It's an old local custom.
ceremony | церемония | n | The ceremony was beautiful.
fancy dress | маскарадный костюм | n | Everyone came in fancy dress.
take place | проходить, состояться | col | The event takes place in May.
exchange gifts | обмениваться подарками | col | We exchange gifts at Christmas.
get together | собираться вместе | pv | The whole family gets together.
folk | народный | adj | They played folk music.
ancestor | предок | n | We remember our ancestors.
superstition | суеверие | n | It's just a superstition.
pass down | передавать из поколения в поколение | pv | The tradition is passed down.
mark | отмечать (событие) | v | The concert marked the anniversary.
`,
  },
  {
    id: "topic-geography",
    title: "География и ландшафт",
    group: "topic",
    level: "A2–B2",
    icon: "🗺️",
    description: "Моря и горы, реки и равнины, стороны света и карта мира.",
    lines: `
continent | континент | n | Africa is a continent.
ocean | океан | n | The Pacific is the largest ocean.
coast | побережье | n | The town is on the coast.
shore | берег (моря, озера) | n | They walked along the shore.
bay | бухта, залив | n | The ship entered the bay.
peninsula | полуостров | n | Kamchatka is a peninsula.
cliff | утёс, скала | n | Don't go near the cliff.
mountain range | горная цепь | n | The Alps are a mountain range.
peak | пик, вершина | n | The peak is covered in snow.
valley | долина | n | A river runs through the valley.
plain | равнина | n | Cows graze on the plain.
desert | пустыня | n | It never rains in this desert.
rainforest | тропический лес | n | The rainforest is full of life.
jungle | джунгли | n | Tigers live in the jungle.
cave | пещера | n | Bats live in the cave.
waterfall | водопад | n | The waterfall is 50 metres high.
stream | ручей | n | A stream runs behind the house.
pond | пруд | n | Ducks swim in the pond.
swamp | болото | n | Crocodiles live in swamps.
glacier | ледник | n | The glacier is melting.
volcano | вулкан | n | The volcano is active.
equator | экватор | n | The equator crosses Kenya.
hemisphere | полушарие | n | Australia is in the southern hemisphere.
border | граница | n | We crossed the border.
region | регион, область | n | It's a wine region.
capital | столица | n | Madrid is the capital of Spain.
population | население | n | The population is ten million.
landscape | пейзаж, ландшафт | n | The landscape is stunning.
scenery | пейзаж, живописный вид | n | We enjoyed the scenery.
horizon | горизонт | n | The sun sank below the horizon.
remote area | отдалённая местность | col | They live in a remote area.
densely populated | густонаселённый | col | The city is densely populated.
landlocked | не имеющий выхода к морю | adj | Switzerland is landlocked.
fertile | плодородный | adj | The soil is fertile.
`,
  },
  {
    id: "topic-disasters",
    title: "Стихийные бедствия и чрезвычайные ситуации",
    group: "topic",
    level: "B1–C1",
    icon: "🌋",
    description: "Землетрясения, наводнения, пожары, спасение и помощь пострадавшим.",
    lines: `
natural disaster | стихийное бедствие | n | The area suffered a natural disaster.
earthquake | землетрясение | n | The earthquake destroyed the town.
hurricane | ураган | n | The hurricane hit the coast.
tornado | торнадо | n | A tornado tore off the roof.
tsunami | цунами | n | A tsunami followed the earthquake.
avalanche | снежная лавина | n | Skiers were caught in an avalanche.
landslide | оползень | n | The landslide blocked the road.
volcanic eruption | извержение вулкана | n | The volcanic eruption lasted a week.
erupt | извергаться | v | The volcano erupted at night.
lava | лава | n | Lava flowed down the mountain.
famine | голод | n | Thousands died in the famine.
epidemic | эпидемия | n | There's a flu epidemic.
pandemic | пандемия | n | The pandemic changed our lives.
casualty | пострадавший, жертва | n | There were many casualties.
victim | жертва | n | They helped the flood victims.
survivor | выживший | n | Rescuers found two survivors.
survive | выжить | v | Only three people survived.
injured | раненый, пострадавший | adj | Ten people were injured.
rescue | спасать | v | Firefighters rescued the family.
rescue team | спасательная команда | n | The rescue team arrived quickly.
evacuate | эвакуировать | v | The town was evacuated.
shelter | укрытие, приют | n | They found shelter in a school.
emergency | чрезвычайная ситуация | n | In an emergency, call 112.
emergency services | экстренные службы | n | The emergency services came at once.
ambulance | скорая помощь | n | Call an ambulance!
first aid | первая помощь | n | He gave her first aid.
fire extinguisher | огнетушитель | n | There's a fire extinguisher by the door.
alarm | сигнал тревоги | n | The fire alarm went off.
devastating | разрушительный | adj | The storm had devastating effects.
devastate | опустошать, разрушать | v | The hurricane devastated the island.
wreckage | обломки | n | They searched the wreckage.
rubble | завалы, щебень | n | People were trapped under the rubble.
aftermath | последствия | n | Many left in the aftermath of the war.
humanitarian aid | гуманитарная помощь | n | The country needs humanitarian aid.
death toll | число погибших | col | The death toll has risen.
collapse | обрушиться | v | The building collapsed.
drown | утонуть | v | Two people drowned.
`,
  },
  {
    id: "topic-plants-garden",
    title: "Растения, сад и сельское хозяйство",
    group: "topic",
    level: "A2–B2",
    icon: "🌻",
    description: "Деревья и цветы, работа в саду, ферма и урожай.",
    lines: `
plant | растение, сажать | n | Water the plants.
seed | семя | n | Plant the seeds in spring.
root | корень | n | The tree has deep roots.
stem | стебель | n | The stem is thin.
leaf | лист | n | The leaves turn yellow.
branch | ветка | n | A bird sat on the branch.
trunk | ствол | n | The trunk is very thick.
bark | кора | n | The bark of a birch is white.
bud | почка, бутон | n | Buds appear in spring.
blossom | цвет, цветение | n | The cherry blossom is beautiful.
petal | лепесток | n | The rose lost its petals.
thorn | шип | n | Roses have thorns.
oak | дуб | n | There's an old oak in the park.
birch | берёза | n | Birches grow in Russia.
pine | сосна | n | The forest is full of pines.
maple | клён | n | Maple leaves turn red.
daisy | маргаритка, ромашка | n | She picked a daisy.
lily | лилия | n | He gave her a white lily.
tulip | тюльпан | n | Tulips come from Turkey.
sunflower | подсолнух | n | Sunflowers follow the sun.
weed | сорняк | n | Pull out the weeds.
lawn | газон | n | Keep off the lawn.
mow the lawn | стричь газон | col | Dad mows the lawn every week.
hedge | живая изгородь | n | He cut the hedge.
fence | забор | n | We painted the fence.
greenhouse | теплица | n | Tomatoes grow in the greenhouse.
soil | почва | n | The soil is rich here.
dig | копать | v | Dig a hole here.
water | поливать | v | Don't forget to water the flowers.
spade | лопата | n | Dig with a spade.
rake | грабли | n | I need a rake for the leaves.
crop | урожай, культура | n | Wheat is the main crop.
harvest | собирать урожай | v | They harvest grapes in autumn.
orchard | фруктовый сад | n | There are apple trees in the orchard.
cattle | крупный рогатый скот | n | The farm has fifty cattle.
livestock | домашний скот | n | Livestock needs a lot of water.
fertiliser | удобрение | n | Farmers use fertiliser.
wither | вянуть, увядать | v | The flowers withered without water.
`,
  },
  {
    id: "topic-cars-driving",
    title: "Машина и вождение",
    group: "topic",
    level: "B1–B2",
    icon: "🚗",
    description: "Части автомобиля, правила, поломки и движение на дороге.",
    lines: `
driving licence | водительские права | n | I got my driving licence at 18.
driving test | экзамен по вождению | n | She passed her driving test.
steering wheel | руль | n | Hold the steering wheel.
seat belt | ремень безопасности | n | Fasten your seat belt.
brake | тормоз | n | Check the brakes.
accelerator | педаль газа | n | Press the accelerator gently.
clutch | сцепление | n | Press the clutch to change gear.
gear | передача | n | Change into second gear.
engine | двигатель | n | The engine won't start.
bonnet | капот | n | Open the bonnet.
boot | багажник | n | Put the bags in the boot.
windscreen | лобовое стекло | n | The windscreen is dirty.
windscreen wipers | дворники | n | Turn on the windscreen wipers.
headlights | фары | n | Turn on your headlights.
bumper | бампер | n | The bumper is damaged.
tyre | шина | n | The tyre is flat.
flat tyre | спущенное колесо | col | We had a flat tyre.
spare wheel | запасное колесо | n | There's no spare wheel.
mirror | зеркало | n | Check your mirrors.
horn | гудок | n | Don't use your horn here.
petrol | бензин | n | We've run out of petrol.
petrol station | заправка | n | Stop at the petrol station.
fill up | заправить полный бак | pv | Let's fill up before the trip.
park | парковать | v | You can't park here.
parking ticket | штраф за парковку | n | I got a parking ticket.
speed limit | ограничение скорости | n | The speed limit is 60.
overtake | обгонять | v | Don't overtake here.
reverse | сдавать назад | v | He reversed into a tree.
roundabout | круговой перекрёсток | n | Turn left at the roundabout.
crossroads | перекрёсток | n | Go straight at the crossroads.
zebra crossing | пешеходный переход | n | Cross at the zebra crossing.
lane | полоса движения | n | Stay in your lane.
motorway | автомагистраль | n | The motorway was empty.
crash | авария, врезаться | n | He was hurt in a car crash.
give someone a lift | подвезти | col | Can you give me a lift?
hitchhike | путешествовать автостопом | v | They hitchhiked across Europe.
`,
  },
  {
    id: "topic-diy-tools",
    title: "Инструменты, ремонт и быт",
    group: "topic",
    level: "B1–C1",
    icon: "🔧",
    description: "Что сломалось и чем чинить: инструменты, действия, бытовые проблемы.",
    lines: `
tool | инструмент | n | I need some tools.
hammer | молоток | n | Hit it with a hammer.
nail | гвоздь | n | Hang the picture on a nail.
screw | шуруп, винт | n | Tighten the screw.
screwdriver | отвёртка | n | Pass me the screwdriver.
drill | дрель | n | Use a drill to make a hole.
saw | пила | n | Cut the wood with a saw.
pliers | плоскогубцы | n | Hold it with the pliers.
spanner | гаечный ключ | n | I need a spanner.
ladder | стремянка, лестница | n | Climb the ladder.
paintbrush | малярная кисть | n | Wash the paintbrush.
glue | клей | n | Stick it with glue.
tape | клейкая лента | n | I need some tape.
rope | верёвка | n | Tie it with a rope.
bolt | болт, задвижка | n | Bolt the door at night.
wire | провод, проволока | n | The wire is broken.
socket | розетка | n | There's a socket behind the sofa.
plug | вилка, штепсель | n | Pull out the plug.
switch | выключатель | n | Where's the light switch?
light bulb | лампочка | n | Change the light bulb.
power cut | отключение электричества | n | We had a power cut.
pipe | труба | n | The pipe is leaking.
tap | кран | n | Turn off the tap.
leak | протекать, утечка | v | The roof leaks.
blocked | засорённый | adj | The sink is blocked.
overflow | переливаться через край | v | The bath overflowed.
crack | трещина | n | There's a crack in the wall.
mould | плесень | n | There's mould in the bathroom.
rust | ржавчина | n | The car is covered in rust.
fix | чинить | v | Can you fix my bike?
assemble | собирать (мебель) | v | It took hours to assemble the desk.
dismantle | разбирать | v | They dismantled the tent.
tighten | затягивать, закручивать | v | Tighten the bolts.
loosen | ослаблять | v | Loosen the screw.
renovate | ремонтировать, обновлять | v | We're renovating the kitchen.
wallpaper | обои | n | We chose blue wallpaper.
tile | плитка | n | The tiles are broken.
do up | отремонтировать (дом) | pv | They did up an old cottage.
out of order | не работает, сломан | col | The lift is out of order.
wear and tear | естественный износ | col | It's normal wear and tear.
`,
  },
  {
    id: "topic-materials-shapes",
    title: "Материалы, формы и описание предметов",
    group: "topic",
    level: "A2–C1",
    icon: "📐",
    description: "Из чего сделано, какой формы и какое на ощупь: полезно для описания картинок и вещей.",
    lines: `
wood | дерево, древесина | n | The table is made of wood.
wooden | деревянный | adj | It's a wooden box.
glass | стекло | n | Be careful, it's glass.
metal | металл | n | The gate is made of metal.
steel | сталь | n | The bridge is made of steel.
iron | железо | n | It's as hard as iron.
copper | медь | n | Copper conducts electricity.
leather | кожа (материал) | n | It's a leather jacket.
fur | мех | n | She never wears fur.
wool | шерсть | n | This jumper is pure wool.
cotton | хлопок | n | I like cotton shirts.
silk | шёлк | n | The scarf is made of silk.
linen | лён | n | Linen is cool in summer.
rubber | резина | n | Tyres are made of rubber.
cardboard | картон | n | Put it in a cardboard box.
concrete | бетон | n | The wall is made of concrete.
brick | кирпич | n | It's a brick house.
marble | мрамор | n | The floor is marble.
clay | глина | n | The pot is made of clay.
circle | круг | n | Draw a circle.
square | квадрат, квадратный | n | Cut it into squares.
triangle | треугольник | n | A triangle has three sides.
rectangle | прямоугольник | n | The field is a rectangle.
oval | овальный | adj | It's an oval mirror.
round | круглый | adj | The table is round.
flat | плоский | adj | The land is flat here.
sharp | острый | adj | The knife is sharp.
smooth | гладкий | adj | Her skin is smooth.
shiny | блестящий | adj | She bought shiny shoes.
transparent | прозрачный | adj | The bag is transparent.
solid | твёрдый, прочный | adj | Ice is solid water.
hollow | полый, пустой внутри | adj | The tree is hollow.
fragile | хрупкий | adj | Careful, it's fragile.
flexible | гибкий | adj | The material is flexible.
stiff | жёсткий, негнущийся | adj | The cardboard is stiff.
sticky | липкий | adj | My hands are sticky.
slippery | скользкий | adj | The floor is slippery.
bumpy | неровный, ухабистый | adj | It's a bumpy road.
durable | прочный, долговечный | adj | Leather is durable.
waterproof | водонепроницаемый | adj | Is your watch waterproof?
striped | полосатый | adj | He wore a striped shirt.
`,
  },
  {
    id: "topic-senses-movement",
    title: "Движения, взгляды, звуки",
    group: "topic",
    level: "B2–C1",
    icon: "👣",
    description: "Вместо walk, look и say: stroll, stare, whisper — лексика для рассказов и чтения книг.",
    lines: `
stroll | прогуливаться | v | We strolled along the beach.
wander | бродить | v | He wandered through the streets.
stride | шагать широким шагом | v | She strode into the room.
march | маршировать | v | The soldiers marched past.
limp | хромать | v | He limped off the field.
creep | красться, ползти | v | She crept upstairs.
tiptoe | идти на цыпочках | v | I tiptoed past the bedroom.
stumble | споткнуться | v | He stumbled on a stone.
trip | споткнуться, запнуться | v | She tripped over the cable.
stagger | шататься, идти пошатываясь | v | He staggered to his feet.
rush | мчаться, спешить | v | She rushed to the station.
dash | броситься, рвануть | v | I dashed across the road.
leap | прыгать, перепрыгивать | v | The cat leapt onto the wall.
crawl | ползти | v | The baby is crawling.
kneel | стоять на коленях | v | He knelt beside the bed.
bend | нагибаться, сгибать | v | Bend your knees.
lean | прислоняться, наклоняться | v | He leaned against the wall.
grab | схватить | v | He grabbed my hand.
clutch | сжимать, вцепиться | v | She clutched her bag.
stare | пристально смотреть | v | Don't stare at people.
gaze | смотреть не отрываясь | v | They gazed at the stars.
glance | бросить взгляд | v | He glanced at his watch.
glimpse | увидеть мельком | v | I glimpsed him in the crowd.
peer | всматриваться | v | She peered into the dark.
glare | смотреть сердито | v | He glared at me.
wink | подмигивать | v | She winked at him.
blink | моргать | v | He blinked in the sunlight.
frown | хмуриться | v | She frowned at the bill.
grin | широко улыбаться | v | He grinned at us.
sigh | вздыхать | v | She sighed with relief.
gasp | ахнуть, задыхаться | v | The crowd gasped.
whisper | шептать | v | He whispered in my ear.
mumble | бормотать | v | Don't mumble!
mutter | ворчать под нос | v | He muttered something rude.
yell | орать, кричать | v | She yelled for help.
scream | визжать, кричать | v | He screamed in pain.
giggle | хихикать | v | The girls giggled.
sob | рыдать | v | She sobbed all night.
groan | стонать | v | He groaned with pain.
snore | храпеть | v | My dad snores loudly.
shiver | дрожать (от холода) | v | She shivered in the wind.
tremble | дрожать (от волнения) | v | His hands trembled.
`,
  },
  {
    id: "topic-fashion",
    title: "Мода и стиль",
    group: "topic",
    level: "B1–C1",
    icon: "👗",
    description: "Тренды, ткани, фасоны и модная индустрия.",
    lines: `
fashion | мода | n | She's interested in fashion.
fashionable | модный | adj | It's a fashionable colour.
trendy | модный, стильный | adj | It's a trendy café.
outfit | наряд, комплект одежды | n | What a lovely outfit!
designer | дизайнер | n | She's a fashion designer.
collection | коллекция | n | The new collection is out.
catwalk | подиум | n | Models walked down the catwalk.
accessories | аксессуары | n | She loves accessories.
jewellery | украшения | n | She wears gold jewellery.
earrings | серьги | n | I bought new earrings.
necklace | ожерелье | n | The necklace was expensive.
bracelet | браслет | n | He gave her a bracelet.
casual clothes | повседневная одежда | col | I prefer casual clothes.
formal | официальный, строгий | adj | The dress code is formal.
smart | нарядный, опрятный | adj | You look smart today.
shabby | потрёпанный | adj | He wore a shabby coat.
second-hand | подержанный | adj | I buy second-hand clothes.
vintage | винтажный | adj | She collects vintage dresses.
bespoke | сшитый на заказ | adj | He wears bespoke suits.
old-fashioned | старомодный | adj | That hat is old-fashioned.
tight | тесный, обтягивающий | adj | These jeans are too tight.
baggy | мешковатый | adj | He wears baggy trousers.
sleeveless | без рукавов | adj | It's a sleeveless dress.
collar | воротник | n | The collar is dirty.
sleeve | рукав | n | Roll up your sleeves.
zip | молния (застёжка) | n | The zip is broken.
button | пуговица | n | I lost a button.
lace | кружево, шнурок | n | The dress has a lace collar.
checked | клетчатый | adj | He wore a checked shirt.
floral | в цветочек | adj | It's a floral pattern.
plain | однотонный | adj | I prefer plain shirts.
suit | идти (к лицу) | v | Blue suits you.
match | сочетаться | v | The bag matches your shoes.
dress up | нарядиться | pv | We dressed up for the party.
in fashion | в моде | col | Long skirts are in fashion.
out of fashion | не в моде | col | That style is out of fashion.
fast fashion | быстрая мода | n | Fast fashion harms the planet.
timeless | неподвластный времени | adj | It's a timeless style.
`,
  },
  {
    id: "topic-social-media",
    title: "Социальные сети и общение онлайн",
    group: "topic",
    level: "B1–C1",
    icon: "📱",
    description: "Посты, подписчики, приватность и этикет в интернете.",
    lines: `
social network | социальная сеть | n | Which social network do you use?
profile | профиль | n | Update your profile.
account | аккаунт | n | I deleted my account.
like | ставить лайк | v | Fifty people liked my photo.
comment | комментарий | n | Read the comments.
follow | подписываться | v | I follow him online.
feed | лента | n | My feed is full of cats.
hashtag | хештег | n | Use this hashtag.
viral | вирусный | adj | The video went viral.
influencer | блогер, инфлюенсер | n | She's a fashion influencer.
content | контент | n | He creates funny content.
content creator | создатель контента | n | I want to be a content creator.
direct message | личное сообщение | n | Send me a direct message.
group chat | групповой чат | n | We have a group chat.
block | заблокировать | v | I blocked him.
mute | отключить звук, скрыть | v | Mute the chat.
tag | отметить (на фото) | v | Don't tag me in photos.
scroll | листать | v | I scrolled for hours.
stream | вести трансляцию | v | He streams games.
screen time | время у экрана | n | Reduce your screen time.
troll | тролль, троллить | n | Ignore internet trolls.
cyberbullying | травля в интернете | n | Cyberbullying is a serious problem.
privacy settings | настройки приватности | n | Check your privacy settings.
personal data | личные данные | n | Protect your personal data.
online presence | присутствие в сети | col | Build your online presence.
digital footprint | цифровой след | n | Everyone leaves a digital footprint.
echo chamber | информационный пузырь | n | Social media can be an echo chamber.
algorithm | алгоритм | n | The algorithm chooses what you see.
oversharing | чрезмерная откровенность | n | Oversharing can be dangerous.
clickbait | кликбейт | n | It's just clickbait.
fear of missing out | страх упустить что-то важное | col | Fear of missing out keeps us online.
`,
  },
  {
    id: "topic-language-learning",
    title: "Изучение языков и общение",
    group: "topic",
    level: "B1–C1",
    icon: "🔤",
    description: "Как говорить об учёбе языка, произношении, переводе и понимании.",
    lines: `
native speaker | носитель языка | n | She's a native speaker of English.
mother tongue | родной язык | n | Russian is my mother tongue.
foreign language | иностранный язык | n | I speak two foreign languages.
bilingual | двуязычный | adj | They're a bilingual family.
multilingual | многоязычный | adj | Switzerland is multilingual.
fluent | свободно говорящий | adj | He's fluent in German.
fluency | беглость речи | n | Practice improves fluency.
accuracy | точность, правильность | n | Work on your accuracy.
accent | акцент | n | She has a French accent.
pronunciation | произношение | n | Your pronunciation is good.
pronounce | произносить | v | How do you pronounce this word?
vocabulary | словарный запас | n | I want to build my vocabulary.
grammar | грамматика | n | English grammar isn't hard.
spelling | правописание | n | Check your spelling.
dialect | диалект | n | They speak a local dialect.
slang | сленг | n | Teenagers use a lot of slang.
jargon | профессиональный жаргон | n | I don't understand legal jargon.
proverb | пословица | n | It's an old Russian proverb.
meaning | значение | n | What's the meaning of this word?
synonym | синоним | n | Find a synonym for big.
stress | ударение | n | The stress is on the first syllable.
syllable | слог | n | The word has three syllables.
intonation | интонация | n | Your intonation shows emotion.
misunderstand | неправильно понять | v | You misunderstood me.
misunderstanding | недоразумение | n | It was just a misunderstanding.
get by in | кое-как объясняться на (языке) | pv | I can get by in Italian.
pick up | нахвататься, выучить на слух | pv | Children pick up languages easily.
make yourself understood | объясниться | col | I can make myself understood in Spanish.
speak from memory | говорить по памяти | col | He spoke from memory.
memorise | заучивать | v | Memorise ten words a day.
by heart | наизусть | col | Learn the poem by heart.
tip of the tongue | (на) кончике языка | idiom | His name is on the tip of my tongue.
language barrier | языковой барьер | col | The language barrier disappeared.
command of | владение (языком) | col | She has a good command of English.
immersion | погружение (в среду) | n | Immersion is the best way to learn.
literal | буквальный | adj | It's a literal translation.
eloquent | красноречивый | adj | He's an eloquent speaker.
articulate | ясно выражающий мысли | adj | She's bright and articulate.
rusty | подзабытый (о навыке) | adj | My French is a bit rusty.
lingua franca | язык международного общения | n | English is a lingua franca.
`,
  },
  {
    id: "topic-cinema",
    title: "Кино, театр и сериалы",
    group: "topic",
    level: "B1–C1",
    icon: "🎬",
    description: "Жанры, съёмки, актёры, сюжет и рецензии.",
    lines: `
screenwriter | сценарист | n | He's a talented screenwriter.
script | сценарий | n | The script is brilliant.
leading role | главная роль | col | She plays the leading role.
supporting role | роль второго плана | col | He won an Oscar for a supporting role.
extra | актёр массовки | n | They needed a hundred extras.
star | играть главную роль | v | The film stars Tom Hanks.
set | съёмочная площадка | n | The actors arrived on set.
shoot | снимать (фильм) | v | The film was shot in Spain.
special effects | спецэффекты | n | The special effects are amazing.
stunt | трюк | n | He does his own stunts.
dubbed | дублированный | adj | The film is dubbed into Russian.
trailer | трейлер | n | Have you seen the trailer?
remake | ремейк | n | It's a remake of an old film.
blockbuster | блокбастер | n | It's a Hollywood blockbuster.
romantic comedy | романтическая комедия | n | We watched a romantic comedy.
animated film | мультфильм | n | It's an animated film for adults.
episode | серия | n | I watched three episodes.
season | сезон (сериала) | n | Season two starts in May.
cliffhanger | интригующий обрыв сюжета | n | The episode ended on a cliffhanger.
spoiler | спойлер | n | No spoilers, please!
binge-watch | смотреть залпом | v | We binge-watched the whole season.
premiere | премьера | n | The premiere is tomorrow.
be released | выйти на экраны | col | The film was released in 2020.
critic | критик | n | Critics loved it.
box office | кассовые сборы | n | It was a box office hit.
gripping | захватывающий | adj | It's a gripping story.
moving | трогательный | adj | It's a moving film.
predictable | предсказуемый | adj | The ending was predictable.
overrated | переоценённый | adj | I think it's overrated.
rehearsal | репетиция | n | The rehearsal lasted all day.
applause | аплодисменты | n | The applause was loud.
`,
  },
  {
    id: "topic-music",
    title: "Музыка",
    group: "topic",
    level: "A2–B2",
    icon: "🎸",
    description: "Инструменты, жанры, концерты и впечатления.",
    lines: `
musician | музыкант | n | He's a talented musician.
singer | певец, певица | n | She's my favourite singer.
songwriter | автор песен | n | He's a famous songwriter.
composer | композитор | n | Mozart was a great composer.
choir | хор | n | I sing in a choir.
orchestra | оркестр | n | The orchestra played Bach.
conductor | дирижёр | n | The conductor raised his hand.
instrument | инструмент | n | Do you play an instrument?
violin | скрипка | n | She plays the violin.
cello | виолончель | n | The cello has a deep sound.
drums | ударные, барабаны | n | He plays the drums.
flute | флейта | n | I learned to play the flute.
trumpet | труба | n | He plays jazz trumpet.
saxophone | саксофон | n | I love the saxophone.
string | струна | n | A guitar has six strings.
tune | мелодия | n | I can't forget that tune.
melody | мелодия | n | It's a beautiful melody.
rhythm | ритм | n | He has a good sense of rhythm.
beat | ритм, такт | n | Dance to the beat.
chord | аккорд | n | I know only three chords.
note | нота | n | She sang a high note.
chorus | припев | n | Everyone sang the chorus.
verse | куплет | n | The second verse is my favourite.
voice | голос | n | She has a beautiful voice.
performance | выступление | n | It was a great performance.
gig | концерт (небольшой) | n | We went to a gig.
tour | гастроли | n | The band is on tour.
record | записывать | v | They recorded an album.
hit | хит | n | The song was a big hit.
catchy | запоминающийся (о мелодии) | adj | The tune is catchy.
in tune | в тон, не фальшивя | col | He can't sing in tune.
out of tune | фальшиво, расстроенный | col | The piano is out of tune.
tone-deaf | не имеющий слуха | adj | I'm tone-deaf.
encore | вызов на бис | n | The crowd shouted for an encore.
live music | живая музыка | col | There's live music tonight.
`,
  },
  {
    id: "topic-literature",
    title: "Книги и литература",
    group: "topic",
    level: "B1–C1",
    icon: "📚",
    description: "Жанры, герои, стиль и обсуждение прочитанного.",
    lines: `
fiction | художественная литература | n | I prefer fiction.
non-fiction | документальная литература | n | She reads non-fiction.
short story | рассказ | n | He writes short stories.
poetry | поэзия | n | She loves poetry.
biography | биография | n | I read a biography of Einstein.
autobiography | автобиография | n | He wrote his autobiography.
fairy tale | сказка | n | Children love fairy tales.
fable | басня | n | It's a fable about a fox.
myth | миф | n | It's a Greek myth.
legend | легенда | n | It's the legend of King Arthur.
science fiction | научная фантастика | n | He's a fan of science fiction.
detective story | детектив | n | I can't put down this detective story.
poet | поэт | n | Pushkin was a great poet.
publisher | издатель, издательство | n | She found a publisher.
hero | герой | n | The hero saves the world.
villain | злодей | n | Who plays the villain?
narrator | рассказчик | n | The narrator is a child.
chapter | глава | n | Read chapter one.
paragraph | абзац | n | Read the first paragraph.
title | название | n | What's the title?
setting | место и время действия | n | The setting is London.
theme | тема | n | Love is the main theme.
climax | кульминация | n | The story reaches its climax.
twist | неожиданный поворот | n | There's a twist at the end.
happy ending | счастливый конец | col | I like happy endings.
paperback | книга в мягкой обложке | n | I bought the paperback.
classic | классика, классический | n | It's a classic of Russian literature.
metaphor | метафора | n | The sea is a metaphor for life.
simile | сравнение | n | As brave as a lion is a simile.
irony | ирония | n | There's irony in the title.
symbolism | символизм | n | The poem is full of symbolism.
satire | сатира | n | The novel is a political satire.
plagiarism | плагиат | n | He was accused of plagiarism.
page-turner | книга, от которой не оторваться | n | It's a real page-turner.
bookworm | книголюб, книжный червь | n | My sister is a bookworm.
well-read | начитанный | adj | He's well-read.
thought-provoking | заставляющий задуматься | adj | It's a thought-provoking novel.
`,
  },
];
