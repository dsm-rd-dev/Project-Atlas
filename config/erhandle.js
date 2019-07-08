const log = console.log;
const chalk = require('chalk');
module.exports = {
    errWarn: function(text){
        log(chalk.yellow(text))
    },

    errNotice: function(text){
        log(chalk.blue(text))
    },

    errSuccess: function(text){
        log(chalk.green(text))
    },

    errFail: function(text){
        log(chalk.red(text))
    }
}