import axios from 'axios'
import http from './http.js'

export default class Util {
    constructor() {
        // this.getCity = this.getCity.bind(this);
        this.reg = /(?<![\d.])[-+]?\d+(?:\.\d*[0-9])?(?![\d.])/g
        this.type = [{key: 'POS', val: 'pos'}, {key: 'POs', val: 'pos'}, {key: '工抵', val: 'gd'}, {
            key: '按揭',
            val: 'aj'
        }, {
            key: '退房款',
            val: 'tfk'
        }, {key: '电汇', val: 'dh'}, {key: 'pos', val: 'pos'}, {
            key: '退款',
            val: 'tfk'
        }]
        this.city = ['成都', '都江堰', '重庆主城', '万州', '南充', '达州', '德阳', '遂宁', '贵阳', '宜宾', '自贡', '泸州', '官仓']
        this.val = ''
        this.form = {
            city: '',
            toDay: '',
            toDayValue: {
                pos: '',
                gd: '',
                aj: '',
                tfk: '',
                dh: '',
            },
            toMonth: '',
            toMonthValue: {
                pos: '',
                gd: '',
                aj: '',
                tfk: '',
                dh: '',
            }
        }
    }

    static handleWeatherData(response) {
        const data = response.result.data;
        const realtime = data.realtime;
        const weather = realtime.weather;
        const wind = realtime.wind;
        const pm25 = data.pm25.pm25;
        return `今天是${realtime.date}
    农历${realtime.moon}
    ${realtime.city_name}天气：${weather.info}
    温度：${weather.temperature}
    湿度：${weather.humidity}
    空气质量：pm2.5 ${pm25.pm25} ${pm25.quality}
    ${pm25.des}`;
    }

    static handleNewsData(response) {
        const data = response.result.data;
        let msg = '今日早报:\n';
        data.slice(0, 10).forEach(item => {
            msg = msg + `${item.title}\n来源：${item.author_name},${item.url}\n\n`;
        });
        return msg;
    }

    async start(contact) {
        this.getCity(this.val)
        this.getDay(this.val)
        this.getMonth(this.val)
        console.log(this.form)
        let that = this
        let res = await http.post('http://47.96.111.67/oss/test', this.form)
        await contact.say(`城市：${this.form.city}<br/><br/>今日回款：${this.form.toDay}<br/>pos：${this.form.toDayValue.pos}<br/>工抵：${this.form.toDayValue.gd}<br/>按揭：${this.form.toDayValue.aj}<br/>退房款：${this.form.toDayValue.tfk}<br/>电汇：${this.form.toDayValue.dh}<br/><br/>本月回款：${this.form.toMonth}<br/>pos：${this.form.toMonthValue.pos}<br/>工抵：${this.form.toMonthValue.gd}<br/>按揭：${this.form.toMonthValue.aj}<br/>退房款：${this.form.toMonthValue.tfk}<br/>电汇：${this.form.toMonthValue.dh}<br/><br/>`)
        let rss = this.form
        if (res.status) {
            this.form = {
                city: '',
                toDay: '',
                toDayValue: {
                    pos: '',
                    gd: '',
                    aj: '',
                    tfk: 0,
                    dh: '',
                },
                toMonth: '',
                toMonthValue: {
                    pos: '',
                    gd: '',
                    aj: '',
                    tfk: 0,
                    dh: '',
                }

            }
            this.val = ''
            return rss
        }
    }

    getCity(val) {
        console.log(this.city)
        console.log('fsw')
        this.city.map(item => {
            if (val.indexOf(item) > -1) {
                this.form.city = item
            }
        })
    }

    getDay(val) {
        try {
            if (val.match(/今日pos([\S\s]*)[本当]月/i) && val.match(/今日pos回款([\S\s]*)[本当]月/i).length > 1) {
                let res = val.match(/今日pos([\S\s]*)[本当]月/i)[1]
                this.form.toDay = res.match(this.reg)[0]
                this.form.toDayValue.pos = res.match(this.reg)[0]
            } else if (val.match(/今日电汇([\S\s]*)[本当]月/i) && val.match(/今日电汇([\S\s]*)[本当]月/i).length > 1) {
                let res = val.match(/今日电汇([\S\s]*)[本当]月/i)[1]
                this.form.toDay = res.match(this.reg)[0]
                this.form.toDayValue.dh = res.match(this.reg)[0]
            } else {

                val = val.replace(/\s/g, '')
                let res = val.match(/今日回款([\S\s]*)[本当]月回款/)[1]
                let ToDay = res.match(this.reg)[0] //今日回款。
                this.form.toDay = ToDay
                console.log('今日汇款' + ToDay)
                console.log('其中')
                if (res.match(/[(（](\S*)[)）]/).length > 1) {
                    let ress = res.match(/[(（](\S*)[)）]/)[1]
                    this.type.map((item, index) => {
                        let data = ress.split('万')
                        data.map(items => {
                            try {
                                //item 为类型
                                //items 为切割段
                                if (items.indexOf(item.key) > -1 && items.indexOf('安家宝') < 0) {
                                    if (items.match(this.reg) != null) {
                                        var ms = items.match(this.reg)[0];
                                        if (item.val == 'tfk') {
                                            this.form.toDayValue[item.val] = (Number(this.form.toDayValue[item.val]) - Math.abs(ms))
                                        } else {
                                            this.form.toDayValue[item.val] = ms

                                        }
                                        console.log(item.key + '的汇款是' + ms)
                                    }
                                } else {

                                    if (items.indexOf('安家宝') > 0) {
                                        if (index == this.type.length - 1) {
                                            //控制让他只执行一次
                                            if (items.match(this.reg) != null) {
                                                var ms = items.match(this.reg)[0];
                                                // console.log(items)
                                                // console.log(item.key)
                                                // console.log(item.val)
                                                if (items.indexOf('退') > 0) {
                                                    console.log(Number(this.form.toDayValue['tfk']))
                                                    this.form.toDayValue['tfk'] = (Number(this.form.toDayValue['tfk']) - Math.abs(ms))
                                                    console.log('退安家宝的汇款是' + ms)

                                                } else {
                                                    this.form.toDayValue['dh'] = (Number(this.form.toDayValue['dh']) + Number(ms))
                                                    console.log('安家宝的汇款是' + ms)

                                                }
                                            }
                                        }


                                    }
                                }
                            } catch (err) {
                                console.log(err)

                            }
                        })
                    })
                }

            }


        } catch (err) {
            console.log(err)

        }

        // console.log(ress.split('万'))

    }

    getMonth(val) {
        if (val.match(/[本当]月pos([\S\s]*)/i) && val.match(/[本当]月pos([\S\s]*)/i).length > 1) {
            let res = val.match(/[本当]月pos([\S\s]*)/i)[1]
            console.log(res.match(this.reg))
            console.log('fff')
            this.form.toMonth = res.match(this.reg)[0]
            this.form.toMonthValue.pos = res.match(this.reg)[0]
        } else {
            val = val.replace(/\s/g, '')
            let res = val.match(/[本当]月回款([\S\s]*)/)[1]
            let ToDay = res.match(this.reg)[0]  //。
            this.form.toMonth = ToDay
            console.log('当月回款汇款' + ToDay)
            console.log('其中')
            if (res.match(/[(（](\S*)[)）]/).length > 1) {
                let ress = res.match(/[(（](\S*)[)）]/)[1]
                this.type.map((item, index) => {
                    let data = ress.split('万')
                    data.map(items => {
                        console.log(items)
                        if (items.indexOf(item.key) > -1 && items.indexOf('安家宝') < 0) {
                            if (items.match(this.reg) != null) {
                                var ms = items.match(this.reg)[0];
                                if (item.val == 'tfk') {
                                    this.form.toMonthValue[item.val] = (Number(this.form.toMonthValue[item.val]) - Math.abs(ms))
                                } else {
                                    console.log(item.key + '的汇款是' + ms)
                                    this.form.toMonthValue[item.val] = ms
                                }
                            }
                        } else {
                            if (items.indexOf('安家宝') > 0) {
                                console.log('los1')
                                console.log(items)
                                console.log('dsw1')
                                if (index == this.type.length - 1) {
                                    //控制让他只执行一次
                                    if (items.match(this.reg) != null) {
                                        var ms = items.match(this.reg)[0];
                                        // console.log(items)
                                        // console.log(item.key)
                                        // console.log(item.val)
                                        if (items.indexOf('退') > 0) {

                                            this.form.toMonthValue['tfk'] = (Number(this.form.toMonthValue['tfk']) - Math.abs(ms))
                                        } else {
                                            this.form.toMonthValue['dh'] = (Number(this.form.toMonthValue['dh']) + Number(ms))

                                        }
                                        console.log(item.key + '的汇款是' + ms)
                                    }
                                }


                            }
                        }
                    })
                })
            }

        }
    }

    async qk(contact) {
        let res = await http.get('http://47.96.111.67/oss/qk')
        contact.say('已经清空表')
        // qk
    }
    async search(contact) {
        let res = await http.get('http://47.96.111.67/oss/search')
        console.log(res)
        console.log(res.data.join())
        contact.say(`今日未交数据的公司有：${res.data.join()}`)
        // qk
    }
}
