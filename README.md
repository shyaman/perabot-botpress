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
</pre>

- TextBlob is built on top of NLTK, and it's more easily-accessible. This is the favorite library for fast-prototyping or building applications that don't require highly optimized performance.  

- Stanford's CoreNLP is a Java library with Python wrappers. It's in many existing production systems due to its speed.

- SpaCy is a new NLP library that's designed to be fast, streamlined, and production-ready. It's not as widely adopted, but if we are going to build a new application, we have to give it a try. It can be memory intensive and doesn’t attempt to cover the whole statistical NLP.

- Here since we are going to use BotPress as the development platform of our ChatBot, we were unable to find a method to integrate those NLP libraries to the BotPress. So that we gave up the idea of using NLP libraries.

- Then we considered about Wit.ai and Dialogflow (Api.ai).

- Wit.ai is a natural language interface for applications that can transform sentences into structured data. Dialogflow is a natural language tool dedicated to designing unique conversation scenarios, degenerating corresponding actions and analyzing interactions with users.

- Unlike Wit.ai, Dialogflow provides one-click integrations with the platform Facebook Messenger. So that using Dialogflow makes the development of PeraBot much easier. 

- So that the chosen NLP technology is Dialogflow (Api.ai)

#### Milestone 1 - Implementing the feature of retrieving the contact details of the academic and non academic staff the faculty from the bot

__16 Nov 2017__

-  Took initial steps to build a web app that contains contact information of staff using Microsoft Azure and established a database in it. Set the bot using Dialogflow and test some php codes.

- Web app was deployed by using github repository as the source.

- Updated the database with the [contact information](http://www.ce.pdn.ac.lk/staff.html#academic).

__18 Nov 2017__

- We were able to implement the feature. But still there are some drawbacks in person name recognizing in NLP.


### Support or Contact

- Sandali Dewni Lokuge    `sdewnilokuge@gmail.com `
- Puwasuru Ihalagedara    `puwasuru95@gmail.com `
- Shyaman Madhawa         `shayaman321@gmail.com`

_This is an undergraduate project for the subject CO227_
