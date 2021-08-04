import {Friendship, Wechaty} from "wechaty";
import QrTerm from "qrcode-terminal";
import Service from "./service";
import Schedule from 'node-schedule';
import until from './util/index'
import {
  CONTACT_ALIAS,
  CONTACT_NAME,
  ENABLE_TULING_MACHINE,
  HELLO_WORLD,
  MY_NAME,
  NEW_FRIENDS_ACCEPT_MSG,
  ROOM_TOPIC,
  SCHEDULE_CONFIG,
  SCHEDULE_CONFIG1,
  SCHEDULE_CONFIG2,
  SCHEDULE_CONFIG3,
  SCHEDULE_CONFIG4,
  SCHEDULE_CONFIG5,

} from "./config";

export default class WechatBoy {
  constructor() {
    this.onScan = this.onScan.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.onFriendship = this.onFriendship.bind(this);
    const name = 'wechat-puppet-wechat';
    this.boy = new Wechaty({
      name, // generate xxxx.memory-card.json and save login data for the next login
    });
    this.boy.on('scan', this.onScan)
      .on('login', this.onLogin)
      .on('message', this.onMessage)
      .on('logout', this.onLogout)
      .on('friendship', this.onFriendship)
      .start()
      .then(() => {
        console.log('start login your wechat account')
      }).catch(e => {
        console.error(e)
      });
  }

  onScan(qrCode) {
    console.log('onScan: ' + qrCode);
    QrTerm.generate(qrCode);
    const qrcodeImageUrl = [
      "https://wechaty.js.org/qrcode/",
      encodeURIComponent(qrCode),
    ].join("");
  };

  async onLogin(user) {
    console.log(`user ${user.name()} login !`);
    const contact = await this.boy.Contact.find({ alias: CONTACT_ALIAS });
    const group = await this.boy.Room.find({ topic: ROOM_TOPIC });
    // 与好友打招呼
    if (contact !== null) {
      await contact.say(HELLO_WORLD);
    } else {
      console.log('contact not found');
    }
    if (group !== null) {
      await group.say(HELLO_WORLD);
    } else {
      console.log('group not found')
    }
    // 发送天气
    // const weather = await Service.getWeather();
    // await contact.say(weather);
    // await group.say(weather);
    // 发送新闻头条
    // const news = await Service.getNews();
    // await contact.say(news);
    // await group.say(news);
    // 设置定时任务
    this.schedule()
  };
 async extractDatesFromText(text) {
    var reg = /(?=\d+ *[年月日点时分秒])(?:(\d+) *年份?)?(?: *(\d+) *月)?(?: *(\d+) *日)?(?: *(\d+) *[点时]钟?)?(?: *(\d+) *分钟?)?(?: *(\d+) *秒钟?)?/g;
    var dates = [];
    var mc;

    while (mc = reg.exec(text)) {
      var date = {
        year: Number(mc[1]) || null,
        month: Number(mc[2]) || null,
        day: Number(mc[3]) || null,
        hour: Number(mc[4]) || null,
        minute: Number(mc[5]) || null,
        second: Number(mc[6]) || null
      };
      // '0 50 7 * * *'
      // console.log(`${date.second} ${date.minute} ${date.hour} ${date.day} ${date.month} ${date.year} *`)
        let str=`0 ${date.minute} ${date.hour} 8 7 *`
      Schedule.scheduleJob(`定时任务已经创建。时间${date.year}年${date.month}月${date.day}日${date.hour}时${date.minute}分${date.second}秒`,str, async () => {
          console.log('执行')
        const contact = await this.boy.Room.find({ topic : ROOM_TOPIC });
        await contact.say(text);
        // await contact.say(await Service.getNews());
      });
      const contact = await this.boy.Room.find({ topic : ROOM_TOPIC });
      await contact.say(`定时任务已经创建。时间${date.year}年${date.month}月${date.day}日${date.hour}时${date.minute}分${date.second}秒`);
      // dates.push(date);
    }
    ;
    console.log(dates)
    return dates;
  }
  async onMessage (msg) {
    if (msg.self()) return;
    const contact = msg.talker();
    const content = msg.text();
    const room = msg.room();
    let reply;
    if (room) {
      const topic = await room.topic();
      console.log(`room: ${topic} send by: ${contact.name()} content: ${content}`);
      if(topic==ROOM_TOPIC){
          let unt=new until()
          // ACHOO.
          if(content=='下载'){
            await room.say(`http://47.96.111.67/oss/download?${new Date().getTime()}`);
          }
          else if(content=='清空'){
            await  unt.qk(room)
          }
          else if(content=='查询'){
            await  unt.search(room)
          }
          else if(content=='闹钟'){
              for (let i in Schedule.scheduledJobs) {
                  console.error("任务名称："+i);
                  await  room.say(i)
                  // console.error("任务名称："+i);
              }
          }
          else if(content.indexOf('提醒')>-1){
            this.extractDatesFromText(content)
          }
          else{
            unt.val=content
            await  unt.start(room)
          }
          // reply = await Service.reply(content.replace(MY_NAME, ''));
          // await room.say(reply);
      }
      // if (ENABLE_TULING_MACHINE && await msg.mentionSelf() && topic === ROOM_TOPIC) {
      //   reply = await Service.reply(content.replace(MY_NAME, ''));
      //   await room.say(reply);
      //   console.log(`tuling reply: ${reply}`);
      // }
    } else {
      // console.log(`sends by: ${contact.name()} content: ${content}`);

      // if (ENABLE_TULING_MACHINE) {
      //   reply = await Service.reply(content);
      //   await contact.say(reply);
      //   console.log(`tuling reply: ${reply}`);
      // }
    }
  };

  onLogout(user) {
    console.log(`user ${user} logout`);
  };

  async onFriendship(friendship) {
    console.log(`new friend request from ${friendship.contact().name()}, type: ${friendship.type()}, greetings: ${friendship.hello()}`);
    if (friendship.type() === Friendship.Type.Receive && friendship.hello() === NEW_FRIENDS_ACCEPT_MSG) {
      await friendship.accept();
    }
  }

  schedule() {
    console.log('start schedule mission');
    Schedule.scheduleJob('天气预报',SCHEDULE_CONFIG, async () => {
      // 每日播报天气，新闻快报
      console.log('定时任务执行')
      const contact = await this.boy.Room.find({ topic : ROOM_TOPIC });
      let unt=new until()
      await  unt.qk(contact)
      await contact.say(await Service.getWeather());
      // await contact.say(await Service.getNews());
    });
    Schedule.scheduleJob('下班打卡提醒',SCHEDULE_CONFIG1, async () => {
      const contact = await this.boy.Room.find({ topic : ROOM_TOPIC });
      await contact.say('下班打卡了没？');
      // await contact.say(await Service.getNews());
    });
    Schedule.scheduleJob(SCHEDULE_CONFIG2, async () => {
      const contact = await this.boy.Room.find({ topic : ROOM_TOPIC });
      await contact.say('下班打卡了没？');
      // await contact.say(await Service.getNews());
    });
    Schedule.scheduleJob(SCHEDULE_CONFIG3, async () => {
      const contact = await this.boy.Room.find({ topic : ROOM_TOPIC });
      await contact.say('下班打卡了没？');
      // await contact.say(await Service.getNews());
    });
    Schedule.scheduleJob(SCHEDULE_CONFIG4, async () => {
      const contact = await this.boy.Room.find({ topic : ROOM_TOPIC });
      await contact.say('下班打卡了没？');
      // await contact.say(await Service.getNews());
    });
    Schedule.scheduleJob(SCHEDULE_CONFIG5, async () => {
      const contact = await this.boy.Room.find({ topic : ROOM_TOPIC });
      await contact.say('下班打卡了没？');
      // await contact.say(await Service.getNews());
    });


  }
}
