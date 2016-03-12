var locomotive  = require('locomotive'),
    path        = require('path');


var settings = {
    port: process.argv[2] || 3000, // default
    host: '127.0.0.1'
};

// Boot Locomotive.
// Calls back with a fully configured express instance.
locomotive.boot('./', process.env.NODE_ENV, function(err, express) {
    if (err) throw err;
/*
module.exports = express.listen(settings.port, settings.host, function() {
        var addr = this.address();
        console.log('Server started.  [Addr: '+addr.address+'] [Port: '+addr.port+']');
});
*/

    module.exports = express.listen(settings.port, settings.host, function() {
        var addr = this.address();
        console.log('Server started.  [Addr: '+addr.address+'] [Port: '+addr.port+']');
    });
});
