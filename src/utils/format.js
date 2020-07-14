const moment = require('moment')

function time2String(value) {
    return moment(value).format('YYYY-MM-DD')
}