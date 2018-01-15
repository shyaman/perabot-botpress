  const _ = require('lodash');
  const randomstring = require("randomstring");
  const mailer = require('../assets/mailer')

  module.exports = bp => {


    bp.hear({'nlp.metadata.intentName': 'Default Welcome Intent'}, (event, next) => {
      bp.db.get().then(knex => knex('userDetails').where({userId:event.user.id}))
      .then(querry =>  {
        if (querry == '') {
          const list_roles ={
            quick_replies: [
              {
                content_type: 'text',
                title: 'Student 👨‍🎓',
                payload: 'S'
              },
              {
                content_type: 'text',
                title: 'Instructor 👩‍💼',
                payload: 'I'
              },
              {
                content_type: 'text',
                title: 'Teacher 👨‍🏫',
                payload: 'T'
              }
            ],
            typing:true,
          }

          const list_departments ={
            quick_replies: [
              {
                content_type: 'text',
                title: 'Chemical & Process Engineering',
                payload: 'Chemical & Process Engineering'
              },
              {
                content_type: 'text',
                title: 'Civil Engineering',
                payload: 'Civil Engineering'
              },
              {
                content_type: 'text',
                title: 'Computer Engineering',
                payload: 'Computer Engineering'
              },
              {
                content_type: 'text',
                title: 'Electrical & Electronic Engineering',
                payload: 'Electrical & Electronic Engineering'
              },
              {
                content_type: 'text',
                title: 'Engineering Mathematics',
                payload: 'Engineering Mathematics'
              },
              {
                content_type: 'text',
                title: 'Mechanical Engineering',
                payload: 'Mechanical Engineering'
              },
              {
                content_type: 'text',
                title: 'Manufacturing & Industrial Engineering',
                payload: 'Manufacturing & Industrial Engineering'
              },
              {
                content_type: 'text',
                title: 'Engineering Management',
                payload: 'Engineering Management'
              }
            ],
            typing:true,
          }


          const quick = (message,quick_reply) => bp.messenger.createText(event.user.id,message,quick_reply);

          var convo = bp.convo.create(event)

          convo.messageTypes = ['quick_reply','message']

          convo.createThread('role')
          convo.switchTo('role')
          convo.activate()
          convo.threads['role'].addQuestion(quick('You are a ?',list_roles), response =>{
            convo.set('role', response.text)
            if (response.text == 'S') {
              convo.switchTo('regNum')
            } else {
              convo.switchTo('department')
            }
          });

          convo.createThread('regNum');
          convo.threads['regNum'].addQuestion('#askENum', [
            {
              pattern: /(.\/\d\d\/\d\d\d)/i,
              callback: (response) => {
                convo.set('regNum', response.match);
                let verificationCode = randomstring.generate(10);
                convo.set('verificationCode', verificationCode);
                bp.db.get().then(knex => knex('userDetails').where({regNum:convo.get('regNum')}).select('emailAddress')).then(email =>{
                  mail = _.get(email[0],'emailAddress');
                  mailer('Your verification code : '+ verificationCode,mail,'Perabot Verification');
                  convo.say(bp.messenger.createText(event.user.id,'I have sent an email. Check your inbox'));
                  convo.switchTo('Verification');
                });
              }
            },
            {
              default: true,    //if its not in correct pattern, question repeat
              callback: () => {
                convo.repeat()
              }
            }
          ]
        );

        convo.createThread('Verification');
        convo.threads['Verification'].addQuestion(bp.messenger.createText(event.user.id,'Enter your verification code here'), response =>{
          if(response.text === convo.get('verificationCode')){
            convo.say(bp.messenger.createText(event.user.id,'You have succefully entered the verification code'))
            convo.switchTo('department');
          }else{
            convo.say(bp.messenger.createText(event.user.id,'You have entered a incorrect verification code'))
            convo.repeat();
          }
        }
      );

        convo.createThread('department');
        convo.threads['department'].addQuestion(quick('Your department ?',list_departments),response =>{
          convo.set('department', response.text);
          convo.next();
        }
      );
      convo.on('done', () => {
        if (convo.get('role') == 'S') {
          bp.db.get().then(knex => knex('userDetails').where({regNum:convo.get('regNum')}).update({
            userId:event.user.id,
            role:convo.get('role'),
            department:convo.get('department'),
            registered:'T'
          }))
        } else {
          bp.db.get().then(knex => knex('userDetails').update({
            userId:event.user.id,
            role:convo.get('role'),
            department:convo.get('department'),
            registered:'T'
          }))
        }

        convo.say(bp.messenger.createText(event.user.id,'Thank you!'))
        convo.say(bp.messenger.createText(event.user.id,'Welcome to PeraBot'))
      })
      //if its abort
      convo.on('aborted', () => {
        convo.say(bp.messenger.createText(event.user.id,'OK. Is there anything else I could help you with?'))
      })


        } else {
          event.reply('#welcome')
        }
      });
  })



  // You can also pass a matcher object to better filter events
  bp.hear({
    type: /message|text/i,
    text: /exit|bye|goodbye|quit|done|leave|stop/i
  }, (event, next) => {
    event.reply('#goodbye')
  })

  bp.hear(/stop|abort|cancel/i, (event, next) => {
      const convo = bp.convo.find(event)
      convo && convo.stop('aborted')
      })

  bp.hear({'nlp.metadata.intentName': 'Default Fallback Intent'}, (event, next) => {
    convo.say(bp.messenger.createText(event.user.id,'I did not get that. Can you say it again?'))

          })
}
