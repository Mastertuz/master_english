import { deckWordKey } from "./key";

/**
 * Определения для слов готовых наборов, которых нет в Cambridge, и для фраз, на которые
 * Cambridge отдаёт определение отдельного слова («never mind» → mind) или другого значения.
 * Важнее кэша Cambridge. Формат строки: «слово из набора | определение».
 * Само слово в определении не называем: по нему слово угадывают в тренажёре.
 */
const LINES = `
How are you doing? | used to ask someone about their life and health when you meet
Nice to meet you. | said politely when you are introduced to someone for the first time
Have a nice day. | said when leaving, to wish someone a pleasant time until evening
Could you help me? | a polite way to ask someone for assistance
Could you repeat that, please? | said when you want to hear the same words again
Could you speak more slowly? | said when someone is talking too fast for you
I don't understand. | said when the meaning is not clear to you
What does it mean? | asked when you want someone to explain a word or sentence
How do you say it in English? | asked when you know a word only in your own language
How do you spell it? | asked when you want to know the letters of a word
Can I have the bill, please? | said in a restaurant when you want to pay
I'd like a coffee, please. | said when ordering a hot drink in a café
I'm not sure. | said when you do not know something for certain
That's a good idea. | said when you like someone's suggestion
I don't think so. | a polite way to say that your answer is probably no
That sounds great. | said when you are happy to accept a plan or an offer
As far as I know, … | used to say what you believe is true, although you may not have all the facts
As far as I know | used to say what you believe is true, although you may not have all the facts
I'm looking for … | said in a shop or in the street when you want to find something
Is there a … near here? | asked when you want to find a place close to where you are
How far is it? | asked when you want to know the distance to a place
How much is it? | asked when you want to know the price
Do you accept credit cards? | asked when you want to pay without cash
Can I try it on? | asked in a shop when you want to see if clothes suit you
What time does it start? | asked when you want to know the beginning of an event
How long does it take? | asked when you want to know the number of minutes or hours needed
I'll be right back. | said when you are leaving for only a very short time
I'm on my way. | said when you are already travelling to the place where someone is waiting
I'm running late. | said when you will not arrive on time
What a pity! | said when you are sad or disappointed about some news
What a surprise! | said when something unexpected happens
That's a relief. | said when you stop worrying because things are all right
It's up to you. | said when the other person must make the decision
It's a deal. | said when you agree to what has been offered
Are you kidding me? | said when you cannot believe what you have just heard
That makes sense. | said when an explanation seems clear and logical
Do you mind if I open the window? | a polite way to ask if you may let some fresh air into the room
Would you like some tea? | a polite way to offer someone a hot drink
I'd rather stay at home. | said when you prefer not to go out
I feel like going for a walk. | said when you want to spend some time outside on foot
I'm in a hurry. | said when you have very little time
I'm fed up with this weather. | said when you are annoyed that it keeps raining or is too cold
It's not a big deal. | said when something is not important or serious
It's none of your business. | a rude way to say that someone should not ask about your private life
It's worth a try. | said when something may not work, but you should do it and see
It's out of order. | said about a machine that is broken
There's no point. | said when doing something would not help at all
What's wrong? | asked when someone looks upset or ill
I've got a headache. | said when you feel pain above your eyes
I'm feeling under the weather. | said when you are slightly ill
Get well soon. | said or written to someone who is ill
Can I take a message? | asked on the phone when the person the caller wants is not there
Could I speak to Mr Brown? | a polite way to ask for a particular man on the phone
I'll get back to you. | said when you promise to contact someone later with an answer
You've got the wrong number. | said on the phone when the caller has rung a stranger by mistake
Speak up, please. | said when you cannot hear someone well
The line is breaking up. | said on the phone when the connection is bad
Thank you for having me. | said to the host when you leave after a visit
Me neither. | used to agree with a negative statement
Take care. | a friendly way of saying goodbye
Excuse me. | said politely to get someone's attention
I'm sorry. | said when you want to apologise
No problem. | a friendly answer when someone thanks you or asks for help
You're welcome. | a polite answer to someone who has thanked you
Thanks a lot. | said when you are very grateful
Just a moment. | said when you want someone to wait for a short time
Hold on. | said when you want someone to wait, especially on the phone
Never mind. | said to tell someone not to worry because something is not important
I have no idea. | said when you do not know the answer at all
It depends. | said when the answer may be different in different situations
What do you think? | asked when you want to know someone's opinion
In my opinion, … | used to introduce your own view
Keep in touch. | said to ask someone to continue writing or calling after you part
Make yourself at home. | said to a guest who should relax in your house
Help yourself. | said to a guest who may take food or drink without asking
Bless you! | said to someone who has just sneezed
Good luck! | said when you hope someone will be successful
Happy birthday! | said to someone who has become a year older today
I can't wait. | said when you are very excited about something in the future
You must be joking. | said when you cannot believe that someone is serious
Fair enough. | said when you accept that someone's reason or suggestion is acceptable
To be honest, … | used before you say what you really think
As soon as possible | without any delay, at the earliest time
What's the matter? | asked when someone looks upset or has trouble
Give me a call. | said when you want someone to phone you
Same here. | said when you feel or think exactly like the other person
Me too. | used to agree with a positive statement
I see what you mean. | said when you understand someone's explanation
make a plan | to decide in detail how you will do something
make a complaint | to say officially that you are not satisfied
make a wish | to hope silently for something, for example when blowing out candles
do the shopping | to buy food and other things you need
do research | to study a subject in detail in order to discover new facts
do exercise | to move your body in order to stay fit
take a bus | to travel by a large public road vehicle
have a rest | to relax and do nothing for a while
have a good time | to enjoy yourself
have a meeting | to come together with other people to discuss something
have an idea | to think of a new plan or suggestion
have a cold | to be ill with a runny nose and a sore throat
have a headache | to feel pain above your eyes
have an argument | to disagree with someone in an angry way
get a ticket | to buy a piece of paper that lets you travel or enter
get a message | to receive a short piece of information from someone
get angry | to lose your temper
get tired | to begin to need rest
get ready | to prepare yourself
get dressed | to put your clothes on
get a haircut | to have a barber make your hair shorter
give a presentation | to speak to a group in order to explain or show something
give permission | to allow someone to do something
give up | to stop trying or to stop doing something, such as a bad habit
look up | to find information in a dictionary or on the internet
turn on | to start a machine, a light or a device
turn off | to stop a machine, a light or a device
turn up | to arrive, or to make the sound louder
get up | to rise from your bed after sleeping
get on | to have a good relationship, or to enter a bus or train
go ahead | used to allow someone to start doing something
come on | used to encourage someone or to ask them to be quick
put on | to cover part of your body with clothes
take off | to remove clothes, or (of a plane) to leave the ground
take up | to start doing a new hobby or sport
take care of | to look after someone or something
take out | to remove something from a place
bring back | to return something, or to make something from the past popular again
carry on | to continue
call off | to decide that a planned event will not happen
call back | to phone someone again, or to phone someone who tried to reach you
check in | to register when you arrive at a hotel or an airport
set up | to start a business, or to prepare equipment for use
set off | to begin a journey
drop off | to take someone somewhere by car and leave them there
run out of | to use all of something so that there is none left
run into | to meet someone by chance
break up | to end a romantic relationship
break into | to enter a building illegally, using force
fill in | to write the necessary information on a form
fill out | to complete a form by writing information on it
deal with | to take action in order to solve a problem
sort out | to solve a problem or to put things in order
show off | to try to impress people with your abilities or possessions
stand up | to rise to your feet
sit down | to move from your feet onto a chair
wake up | to stop sleeping
slow down | to begin to move less quickly
make sense | to be clear and easy to understand
make a difference | to have an important effect on a situation
make an appointment | to arrange to meet someone, such as a doctor, at a particular time
make noise | to produce loud sounds
make time | to find a free period in a busy day for something
do your best | to try as hard as you can
do good | to have a useful or helpful effect
take a risk | to do something although it may be dangerous
take a seat | to move onto a chair, often after a polite invitation
take a shower | to wash yourself standing under running water
take place | to happen
take part in | to join other people in an activity
take advantage of | to use a situation or chance to get what you want
take notes | to write down the main points of what you hear
take responsibility | to accept that something is your duty or your fault
take into account | to consider something before making a decision
have a word with | to speak privately and briefly to someone
get a job | to be given paid work
get better | to improve or to recover after an illness
get married | to become husband and wife
get the point | to understand the main idea
get in touch | to contact someone
keep a secret | to not tell anyone what you know
keep a promise | to do what you said you would do
keep in mind | to remember and consider a fact
hit the nail on the head | to describe exactly what is causing a situation or problem
once in a blue moon | very rarely
cost an arm and a leg | to be extremely expensive
let the cat out of the bag | to tell people about something secret by mistake
the ball is in your court | it is now your turn to act or decide
barking up the wrong tree | looking for the answer in a completely mistaken place
bite off more than you can chew | to try to do something that is too difficult for you
every cloud has a silver lining | there is something good in every bad situation
get out of hand | to become impossible to control
kill two birds with one stone | to achieve a pair of results with a single action
no pain, no gain | you must work hard or suffer to achieve something
take it with a grain of salt | to not completely believe what you are told
when pigs fly | used to say that something will never happen
you can't judge a book by its cover | you should not form an opinion about something only from how it looks
your guess is as good as mine | used to say that you do not know the answer either
go back to the drawing board | to start planning again because the first attempt failed
the last straw | the latest of several bad things, which makes a situation impossible to accept
keep an eye on | to watch or look after someone or something
on the same page | having the same understanding or opinion about something
pull someone's leg | to tell someone something untrue as a joke
for this reason | because of the fact just mentioned
what is more | used to add an even more important point
to put it another way | used when you explain the same thing in different words
as far as I'm concerned | used to give your personal opinion
on the other hand | used to introduce a contrasting point of view
in spite of | without being prevented by something; although there is a problem
even so | used to add a surprising fact: nevertheless
due to | because of something
in addition | used to add another fact: also
apart from | except for, or as well as
in other words | used to explain something more simply
to begin with | used to introduce the first of several points
in conclusion | used to introduce the last part of a speech or essay
to sum up | used before repeating the main points briefly at the end
all in all | considering everything
on the whole | generally, in most ways
in general | usually, or in most cases
to be honest | used before you say what you really think
in fact | used to say what is really true
rely on | to trust or depend on someone
Yours sincerely | used at the end of a formal letter when you know the person's name
Yours faithfully | used at the end of a formal letter that begins with Dear Sir or Madam
With reference to … | used in formal letters to say what you are writing about
I am writing to inform you that … | used at the start of a formal letter that gives news or facts
I am writing to enquire about … | used at the start of a formal letter that asks for information
Further to our conversation, … | used in an email to continue something you discussed earlier
Please find attached … | used in an email to say that you have added a file
I would be grateful if you could … | used in a formal letter to make a very polite request
I look forward to hearing from you. | written at the end of a letter to say that you hope for an answer
Thank you for your prompt reply. | written when someone has answered you quickly
Please let me know if you have any questions. | written to offer further explanation if something is unclear
Best regards | a polite and friendly way to end an email
I apologise for the inconvenience. | a formal way to say sorry for causing trouble
I'm afraid I can't attend. | a polite way to say that you will not come to a meeting
Could we reschedule the meeting? | asked when you want colleagues to gather at a different time
Let's set up a call. | said when you want to arrange a conversation by phone
Let's touch base next week. | said when you want to talk briefly again in seven days or so
I'll keep you posted. | said when you promise to give someone the latest news
Could you get back to me by Friday? | asked when you need an answer before the end of the working week
The deadline is tight. | said when there is very little time to finish the work
We are running behind schedule. | said when the work is progressing more slowly than planned
We're on track. | said when the work is progressing as planned
Let's move on to the next item. | said in a meeting when it is time to discuss another topic
Does anyone have any questions? | said after a talk to invite people to ask about it
I'd like to raise a point. | said in a meeting when you want to mention something important
Could I just come in here? | a polite way to interrupt in a meeting
Let me get back to you on that. | said when you cannot answer now but will do so later
I'll look into it. | said when you promise to examine a problem
I'm in charge of … | used to say what you manage or control at work
I'm responsible for … | used to say what your duties are
We need to prioritise. | said when it is necessary to decide which tasks are most important
It's out of my hands. | said when you have no power to change a situation
Let's agree on a deadline. | said when you want to fix a final date for the work together
We will send you a quote. | said when you promise to tell a customer the expected price
Could you send me the invoice? | asked when you need a document showing how much to pay
The payment is overdue. | said when money should already have been paid
This is a priority. | said about a task that must be done before others
Please bear with me. | a polite way to ask someone to be patient
Could you put me through to …? | asked on the phone when you want to be connected to someone
I'll transfer you. | said on the phone when you are connecting the caller to another person
He is not available at the moment. | said on the phone when a man cannot speak now
Could you spell that, please? | asked when you want to hear a name letter by letter
I'd like to schedule a meeting. | said when you want to fix a time to see colleagues
I'm calling about … | used on the phone to give the reason for your call
We would like to propose … | a formal way to suggest something
It would be great if … | used to make a friendly request or suggestion
Thank you for your cooperation. | a formal way to thank people for working with you or following rules
Pending your reply … | a formal way to say that you will wait until someone answers
come across as | to seem to other people to have a particular character
cut back on | to use or spend less of something
miss out on | to lose a chance to do or have something good
tamper with | to touch or change something when you should not, often causing damage
call for | to need or demand a particular action
let down | to disappoint someone by not doing what you promised
make out | to manage to see, hear or understand something with difficulty
pin down | to discover or describe something exactly
see through | to realise that someone is trying to trick you
set back | to delay the progress of something
step down | to leave an important job or position
sum up | to repeat the main points briefly
tie in with | to agree with or be connected to other information
weigh up | to think carefully about the advantages and disadvantages
wind down | to relax after work or stress
zero in on | to direct all your attention to one thing
be in the same boat | to share an unpleasant situation with other people
be on the fence | to be unable to decide between two options
cross that bridge when you come to it | to deal with a problem only if it really happens
give someone the benefit of the doubt | to believe a person is honest although you are not certain
keep someone in the loop | to continue giving a person the latest information
not see eye to eye | to disagree with someone
off the top of my head | without thinking carefully or checking
on the spur of the moment | suddenly, without any planning
play devil's advocate | to argue against an idea just to make the discussion more interesting
put all your eggs in one basket | to risk everything on the success of a single plan
rub salt in the wound | to make a painful situation even worse for someone
take it with a pinch of salt | to not completely believe what you are told
wrap your head around | to manage to understand something difficult
get the hang of | to learn how to do something with practice
set the record straight | to correct a false belief by telling the true facts
bear in mind | to remember and consider a fact
bridge the gap | to make the difference between two things smaller
broaden your horizons | to increase the range of things you know or have experienced
cast doubt on | to make something seem less likely to be true
come to terms with | to gradually accept a sad or difficult situation
come under fire | to be strongly criticised
draw attention to | to make people notice something
keep an open mind | to be willing to consider new ideas
pay tribute to | to show respect and admiration for someone in public
put pressure on | to try to force someone to do something
raise eyebrows | to cause people to feel surprised or slightly shocked
set an example | to behave in a way that others should copy
sound asleep | sleeping deeply
stand a chance | to have the possibility of succeeding
stark contrast | a very clear difference between two things
strike a balance | to find a satisfactory position between two opposite things
wide awake | not sleepy at all
take for granted | to not appreciate something because it has always been there
bitterly disappointed | extremely sad because something did not happen as you hoped
exercise caution | to be very careful
express concern | to say that you are worried about something
fiercely competitive | with many people or companies trying very hard to win
gain insight into | to get a deeper understanding of something
gain access | to succeed in entering a place or system or reaching information
hold a grudge | to stay angry with someone for something they did in the past
highly unlikely | almost certainly not going to happen
meet the demand | to supply as much of something as people want
meet the requirements | to have everything that is officially necessary
mutual understanding | a situation in which both sides know and accept each other's views
play a pivotal role | to be extremely important in how something develops
reach a compromise | to agree after each side accepts less than it wanted
utterly ridiculous | completely silly
to my mind | used to give your own opinion
up to a point | partly but not completely
on balance | after considering all the good and bad sides
all things considered | after thinking about every fact
in the light of | because of certain new facts
with regard to | in connection with, concerning
I'm convinced that | used to say that you are completely certain about something
I'm inclined to think | used to say in a careful way what you probably believe
there's no denying that | used to say that something is clearly true
it's worth mentioning that | used to introduce an extra fact that is useful or interesting
you have a point | said when you admit that someone's idea is partly right
that's debatable | said when people may have different opinions about something
I see your point, but | used before disagreeing politely
I'm not entirely convinced | a polite way to say that you still have doubts
for the sake of argument | used when you imagine that something is true in order to discuss it
what I mean is | used to explain your words more clearly
let me put it another way | said before you express the same idea in different words
if I understand you correctly | used to check that you have followed what someone said
could you elaborate on that | a polite way to ask for more details
correct me if I'm wrong | used before saying something you are not completely certain about
the bottom line is | used to introduce the most important fact
to cut a long story short | used when you leave out details and tell only the end
be that as it may | used to accept a fact but say that it changes nothing
it is widely believed that | used to say what most people think is true
there is a growing tendency to | used to say that more and more people do something
this raises the question of | used to introduce a problem that must now be considered
by the same token | used to say that something is also true for the same reason
table for two | what a couple asks for when they arrive at a restaurant
have a shower | to wash yourself standing under running water
go to work | to travel to the place where you do your job
finish work | to stop doing your job at the end of the day
start work | to begin doing your job in the morning
leave home | to go out of the place where you live, or to stop living with your parents
cook dinner | to prepare an evening meal
do the dishes | to wash plates and cups after a meal
watch TV | to look at programmes on a screen at home
clean the house | to make the place where you live free from dirt
take out the rubbish | to carry waste out of your home
set the alarm | to make a clock ring at a chosen time
go to bed | to lie down at night in order to sleep
fall asleep | to start sleeping
brush your teeth | to clean the inside of your mouth, usually with paste
move house | to go to live in a different home
get home | to arrive at the place where you live
get on with | to have a friendly relationship with someone
be born | to come into the world as a baby
every day | on each date of the week, without missing any
at night | during the hours of darkness
in the morning | between the time you wake up and noon
it's raining | said when water is falling from the sky
it's pouring | said when a lot of water is falling from the sky
a quarter past | fifteen minutes after the hour
a quarter to | fifteen minutes before the hour
half past | thirty minutes after the hour
the day after tomorrow | two days from now
turn right | to go in the direction opposite to left
go straight on | to continue without turning
cross the road | to walk from one side of the street to the other
Where is the nearest ...? | asked when you want to find the closest place of some kind
next to | beside, very close to the side of
in front of | directly before someone or something, not behind
book a room | to arrange to stay in a hotel
key card | a piece of plastic that opens a hotel door
play the guitar | to make music on an instrument with six strings
play chess | to take part in a board game with kings and queens
go cycling | to ride a bike for pleasure
go swimming | to move through water for exercise or pleasure
take photos | to make pictures with a camera
collect stamps | to keep small pieces of paper used on letters as a hobby
watch films | to enjoy stories on a screen or in a cinema
listen to music | to enjoy songs or tunes with your ears
join a club | to become a member of a group with the same interest
be keen on | to like something very much
be into | to be very interested in something (informal)
miss a class | to not be present at a lesson
be late for class | to arrive after a lesson has begun
tuition fee | money paid for teaching at a school or university
raise awareness | to make more people know about a problem
be made redundant | to lose your job because the employer no longer needs it
log in | to enter a computer system with your name and password
sign up | to register for a course, service or website
solar power | electricity made from the sun's light or heat
take action | to do something in order to deal with a problem
go viral | to spread very quickly on the internet
warm up | to do gentle movements before hard exercise
lose weight | to become thinner
in good shape | healthy and physically fit
portion size | the amount of food served to one person
put on weight | to become fatter
skip meals | to not eat at the usual times
get enough sleep | to rest as many hours at night as your body needs
medium height | neither tall nor short
dark-haired | having black or brown locks on your head
get on well with | to have a friendly relationship with someone
make up | to become friends again after a quarrel
keep in touch | to continue to write to or call someone
split up | to end a marriage or relationship
fall out with | to stop being friends with someone after a quarrel
have a lot in common | to share many interests or qualities with someone
cheat on | to secretly have a relationship with another person
bring up children | to care for young sons and daughters until they are adults
raise a child | to care for a young person until he or she becomes an adult
household chores | regular jobs at home, such as cleaning and washing
exchange gifts | to give presents to each other
get together | to meet in order to spend time with other people
remote area | a place that is far away from towns and people
volcanic eruption | an event when a mountain throws out fire and lava
rescue team | a group of people who save others from danger
spare wheel | an extra part of a car, used when a tyre is damaged
fill up | to make the petrol tank of a car full
do up | to repair and decorate an old house or room
dress up | to put on formal or special clothes
casual clothes | comfortable things to wear that are not formal
online presence | the way a person or company can be seen on the internet
digital footprint | the information about you that stays on the internet
oversharing | telling people too much about your private life, especially online
fear of missing out | a worry that others are having fun without you
screen time | the number of hours you spend using a phone, computer or television
echo chamber | a situation in which you meet only opinions that are the same as yours
get by in | to know just enough of a language to communicate
speak from memory | to talk without looking at any notes
make yourself understood | to express your meaning clearly enough in another language
by heart | so that you can repeat something exactly without looking
command of | a good knowledge of a language or subject
leading role | the most important part in a film or play
romantic comedy | a funny film about love
animated film | a movie made with moving drawings or computer images
be released | (of a film or album) to become available to the public
box office | the amount of money a film earns from tickets
live music | songs or tunes performed in front of an audience, not recorded
out of tune | not producing the correct musical notes
detective story | a book about solving a crime
bottle up | to hide strong feelings instead of showing them
gut feeling | a strong belief that you cannot explain with logic
lift off | (of a rocket) to leave the ground
self-driving car | a vehicle that needs no human behind the wheel
go bankrupt | to be unable to pay your debts and have to close a business
Stone Age | the very early period when people made tools from rock
minority group | a smaller part of the population that differs in race, religion or language
ageing population | a situation in which more and more citizens are elderly
drop out | to leave school or university before finishing
vocational training | teaching that prepares people for a particular job
launch a product | to start selling something new
free sample | a small amount of goods given without payment so that people can try them
value for money | good quality in relation to the price
appeal to | to seem attractive or interesting to someone
word of mouth | the spreading of information by people talking to each other
single-use plastic | packaging that is thrown away after being needed once
belief system | a set of ideas that a person or society considers true
common good | the benefit of everyone in a society
meaning of life | the purpose of human existence
a third of | one of three equal parts of something
compared with | used when you look at how two things are different
in contrast | used to introduce something very different
level off | (of a number or price) to stop rising or falling and become steady
rise sharply | to go up quickly and by a large amount
remain stable | to stay at the same level
reach a low | to fall to the smallest amount or level
line graph | a picture that shows changes over time as connected points
flexible hours | a system that lets employees choose when to start and finish
remote work | doing your job from home or another place, not in an office
deadline-driven | organised around finishing tasks by fixed dates
climb the career ladder | to move up to better and better jobs
book a table | to arrange in advance to eat at a restaurant
still water | a plain drink without bubbles
sparkling water | a plain drink with bubbles of gas
grab a bite | to eat something quickly (informal)
have a sweet tooth | to like cakes, chocolate and similar food very much
`;

const DEFINITIONS = new Map(
  LINES.split("\n")
    .filter((line) => line.includes(" | "))
    .map((line) => {
      const [english, definition] = line.split(" | ");
      return [deckWordKey(english), definition.trim()] as const;
    }),
);

/** Своё определение слова набора, если оно есть */
export function ownDefinition(english: string): string | undefined {
  return DEFINITIONS.get(deckWordKey(english));
}
