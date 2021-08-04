export const TIANQI_URL = 'http://op.juhe.cn/onebox/weather/query';
export const TIANQI_CITY = '成都';
export const TIANQI_KEY = 'afc28ae28c6f1b520dab5d1ed537f6c0';

export const NEWS_URL = 'http://v.juhe.cn/toutiao/index';
export const NEWS_KEY = 'c3f9d6c4c70559205cab02fb9f8d4a66';

export const TULING_API = 'http://api.tianapi.com/txapi/robot/index';
export const TULING_API_KEY = 'bafa15789ce07f436ade5a770cc21e9d';
export const TULING_ERROR_MESSAGE = '可爱小机器人宕机啦 :>_<":'; // error语句

export const HELLO_WORLD = 'Hello 可爱聪明的小机器人上线啦 :>_<:'; //招呼语
export const MY_NAME = '@M周'; // 自己的昵称
export const CONTACT_ALIAS = '冰仔'; // 想要发消息的人（备注）
export const CONTACT_NAME = ''; // 想要发送消息的人（真实昵称）
export const ROOM_TOPIC = '脑花机器人'; // 想要发送消息的群组
export const NEW_FRIENDS_ACCEPT_MSG = 'hello';
// 每分钟的第30秒： '30 * * * * *'
// 每小时的1分30秒 ：'30 1 * * * *'
// 每天的1点1分30秒 ：'30 1 1 * * *'
// 每月的1日1点1分30秒 ：'30 1 1 1 * *'
// 每周1的1点1分30秒 ：'30 1 1 * * 1'
// 详情见node_schedule文档
// 每天的8点0分0秒
export const SCHEDULE_CONFIG = '0 50 7 * * *';
// export const SCHEDULE_CONFIG = '0 56 14 * * *';
export const SCHEDULE_CONFIG1 = '0 40 17 * * 1';
export const SCHEDULE_CONFIG2 = '0 40 17 * * 2';
export const SCHEDULE_CONFIG3 = '0 40 17 * * 3';
export const SCHEDULE_CONFIG4 = '0 40 17 * * 4';
export const SCHEDULE_CONFIG5 = '0 40 17 * * 5';

// 是否使用本地数据，因为免费接口有次数限制，调试建议开启mock
export const MOCK = false;

export const ENABLE_TULING_MACHINE = true;

// 数据库
export const HOST='localhost'
export const PORT='27017'
export const DB='test'
