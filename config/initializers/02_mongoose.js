var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId;
var fs = require('fs');
var path = require('path');

var loadModules = function(modelPath){

    self = this;
    self.models = self.models || [];
    /*fs.readdir(modelPath, function(err, files){
        if (err) throw err;
        files.forEach(function(file){
            if ( fs.statSync(modelPath + '/' + file).isDirectory() ){
                loadModules(modelPath + '/' + file);
                return;
            }
            // Get the Model
            var name = file.replace('.js', '');
//            var model = require(modelsPath + '/' + name)[name]();
            var model = require(modelPath + '/' + name);

            self.models[name] = model;
        });
    });*/

    var files = fs.readdirSync(modelPath);
    for ( var i = 0; i < files.length; i++)
    {
        var file =files[i];
        if ( fs.statSync(modelPath + '/' + file).isDirectory() ){
                loadModules.bind(self)(modelPath + '/' + file);
                continue;
        }
        var name = file.replace('.js', '');
//            var model = require(modelsPath + '/' + name)[name]();
        var model = require(modelPath + '/' + name);
        self.models[name] = model;
    }

    require('locomotive').Controller.prototype.models = self.models;
}
module.exports = function() {
    this.set('root', __dirname+"/../../app");

    switch (this.env) {
        case 'development':
            mongoose.connect('mongodb://localhost/muhimu_dev');
            break;
        case 'production':
        default:
            mongoose.connect('mongodb://localhost/muhimu_prd');
            break;
    }

    var modelsPath = path.normalize(this.set('root') + '/db/models');
    loadModules.call(this, modelsPath);

}

