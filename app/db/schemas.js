var path = require('path')
    , fs = require('fs')



var loadModules = function(){
    var modelsPath = path.normalize(__dirname +'/models');

    fs.readdir(modelsPath, function(err, files){
        if (err) throw err;
        files.forEach(function(file){

            // Get the Model
            var name = file.replace('.js', '');
//            var model = require(modelsPath + '/' + name)[name]();
            model = require(modelsPath + '/' + name);

            module.exports[name] = model;
        });
    });


}
loadModules();

