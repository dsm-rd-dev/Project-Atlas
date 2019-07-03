/*#
.01 Description
    Used for api communication and workflows for DSM interaction

.02 Creator
    Cpresley

*/
require('dotenv').config()
var request = require('request');    
const config = require('./config/erhandle.js');
const inquirer = require('inquirer')

// =============================================== DO NOT EDIT =============================================== \\

// ===== Build Connectwise Connection/Routes ===== \\
const cw = require('./connectors/cw.js');

// ===== Build Logic Monitor Connection/Routes ===== \\
const lm = require('./connectors/lm.js')

// ===== Build N-Central Connection/Routes ===== \\

// ===== Build SI Portal Connection/Routes ===== \\

// ===== Build Azure Connection/Routes ===== \\

// =============================================== EDIT BELOW =============================================== \\
//cw.getNotes(357451);
//cw.getComps();

// Error Handling Test
//config.errFail('Fail Test');
//config.errWarn('Warning Test');
//config.errNotice('Notice Test');
//config.errSuccess();