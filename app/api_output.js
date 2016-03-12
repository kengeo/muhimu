/****
 * this module is generating default output for REST api
 *
 */



/**
 *
 * @param errorCode
 * @param message
 * @param err
 * @returns {{success: *, message: *, error: *}}
 */
function getError( message,  err, errorCode){
    if ( errorCode == undefined) errorCode = 0;
    return {success:errorCode,message:message, error:err };
}
// for update, delete which is required a operation succeed/false status
function getSuccess(message,  output){
    return {success:1 ,message:message, result:output};
}

function unauthorized(message, output){
    return {success:1 ,message:message, result:output};
}

module.exports.getError = getError;
module.exports.getSuccess = getSuccess;
