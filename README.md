## Welcome to PeraBot

An **intelligent** chatbot who is going to help university students and staff regarding academic related stuff

### Project Members

- Sandali Dewni Lokuge
- Puwasuru Ihalagedara 
- Shyaman Madhawa

### Features

- Anyone can get the contact details of the academic and non academic staff the faculty
- The students can make appointments for lecturers
- The students can ask about their subject details

<pre>
eg: Subjects of semester 4
    Total credits of semester 3
    Number of credits that I have earned
    Lecturer of CO226
    Number of credits of software construction
</pre>
- The bot able to give the current gpa and grades of each subjects when a student asked
<pre>
eg: Current gpa 
    What's my grade of Electronics 1? 
</pre>

- The bot let the students to know about their upcoming submissions
<pre>
eg: What do I have to submit tomorrow? 
    What are my submissions?
</pre>
- Both students and lecturers can get to know about their timetables as well as the lecture rooms.
<pre>
eg: What do I have after lunch break? 
    Tomorrow time table 
    What is the next subject? 
    Where will be CO227 lecture conducted? 
    Lecture hours of Business Law 
</pre>
- The lecturers can check the timetable and can add extra lectures according to free lecture slots or cancel lectures

### Miletones
#### Milestone 0 - Finding suitable technology

- To make our ChatBot intelligent, we looked for some platforms of Natural Language Processing NLP. 
- Then we got to know about some NLP technologies that were listed below.
<pre>
1.	NLP libraries such as TextBlob, Stanford’s CoreNLP, SpaCy
2.	Wit.ai
3.	Dialogflow (Api.ai)
4.	Microsoft Luis

</pre>

- TextBlob is built on top of NLTK, and it's more easily-accessible. This is the favorite library for fast-prototyping or building applications that don't require highly optimized performance.  

- Stanford's CoreNLP is a Java library with Python wrappers. It's in many existing production systems due to its speed.

- SpaCy is a new NLP library that's designed to be fast, streamlined, and production-ready. It's not as widely adopted, but if we are going to build a new application, we have to give it a try. It can be memory intensive and doesn’t attempt to cover the whole statistical NLP.

- Here since we are going to use BotPress as the development platform of our ChatBot, we were unable to find a method to integrate those NLP libraries to the BotPress. So that we gave up the idea of using NLP libraries.

- Then we considered about Wit.ai and Dialogflow (Api.ai).

- Wit.ai is a natural language interface for applications that can transform sentences into structured data. Dialogflow is a natural language tool dedicated to designing unique conversation scenarios, degenerating corresponding actions and analyzing interactions with users.

- Microsoft Luis uses machine learning to allow developers to build applications that can receive user input in natural language and extract meaning from it. If we are going to use this technology, we have to build a middleware. But according to our time limit we thought that we could not be able to finish our project we if use this technology even though it provides all the necessary elements for building conversations.

- Unlike Wit.ai, Dialogflow provides one-click integrations with the platform Facebook Messenger. So that using Dialogflow makes the development of PeraBot much easier. 

- So that the chosen NLP technology is Dialogflow (Api.ai)

#### Milestone 1 - Implementing the feature of retrieving the contact details of the academic and non academic staff the faculty from the bot

__16 Nov 2017__

-  Took initial steps to build a web app that contains contact information of staff using Microsoft Azure and established a database in it. Set the bot using Dialogflow and test some php codes.

- Web app was deployed by using github repository as the source.

- Updated the database with the [contact information](http://www.ce.pdn.ac.lk/staff.html#academic).

__18 Nov 2017__

- We were able to implement the feature. But still there are some drawbacks in person name recognizing in NLP.

__22 Nov 2017 to 25 Nov 2017__

- This feature was implemented using only Dialogflow and Ms Azure without using botpress and we found so many drawbacks and we were unable to fix them.

- Sometimes the bot was unble to identify the intents clearly , fetch the data from Ms Azure database quickly, eventhough it identify the intents, we didn't get the expected outputs and sometimes there were timeouts too. 

- Because of those problems we could not continue oir work with only DialogFlow and MS Azure

- Again we searched about MS Luis and Wit.ai technologies, but we have to consider the time we have to implement the bot.

- At the end, we decided to use DialogFlow for natural language processing, pgAdmin3 to maintain a local database, Knex.js as the query builder and botpress as the bot framework.

__26 Nov 2017__

- Again we started implementing same feature using the above techonologies and tools.

__2 Dec 2017__

- We were able to finish the implementation without previous drawbacks.

- But there are some drawbacks in dialogflow when the user type a text with spelling mistakes.

- We created a facebook page named "PeraBot" and this feature was tested via facebook messenger.

#### Milestone 2 - Implementing the feature of querying about the timetables

__30 Nov 2017__

- When we were familiar with the tools and the technologies, we moved to work on this feature while implementing the above feature.

- We made the timetable in google calender and used calender api to implement this feature

- As the first stage of building this feature, we are working to get the details of the timetable of E14 Students in Computer Engineering Department.

- Later, we will implement to get the timetable according to the relevant students. 

__4 Dec 2017__

- We almost finished the first stage of this feature.

- But there are some drawbacks in dialogflow when the user type a text with spelling mistakes.

- This feature was tested via facebook messenger.


### Support or Contact

- Puwasuru Ihalagedara    `puwasuru95@gmail.com `
- Shyaman Madhawa         `shayaman321@gmail.com`
- Sandali Dewni Lokuge    `sdewnilokuge@gmail.com `

_This is an undergraduate project for the subject CO227_
