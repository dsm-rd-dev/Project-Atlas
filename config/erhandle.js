const log = console.log;
const chalk = require('chalk');
module.exports = {
    errWarn: function (text) {
        if (typeof text == 'object' && text != null) {
            log(chalk.yellow(JSON.stringify(text)));
        } else {
            log(chalk.yellow(text))
        }
    },

    errNotice: function (text) {
        if (typeof text == 'object' && text != null) {
            log(chalk.blue(JSON.stringify(text)));
        } else {
            log(chalk.blue(text))
        }
    },

    errSuccess: function (text) {
        if (typeof text == 'object' && text != null) {
            log(chalk.green(JSON.stringify(text)));
        } else {
            log(chalk.green(text))
        }
    },

    errFail: function (text) {
        if (typeof text == 'object' && text != null) {
            log(chalk.red(JSON.stringify(text)));
        } else {
            log(chalk.red(text))
        }

    }
}