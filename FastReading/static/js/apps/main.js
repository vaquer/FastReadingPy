define(function(require, exports, module) {
    var $ = require('jquery'),
        _ = require('bootstrap'),
        BB = require('backbone'),
        AppRead = require('widgets/views/core'),
        View = BB.View.extend({
            initialize: function(){
                // console.log('Hola');
            },
            render: function(){
                // console.log('Ya renderee');
                new AppRead().render();
            }
        });

        BB = BB.noConflict()
        return {
            initialize: function(params) {
                new View(params || {}).render();
            }
        };
});