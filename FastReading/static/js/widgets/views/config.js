define(['jquery', 'underscore', 'backbone', 'general_settings'], function ($, _, BB, GeneralSettings){
    return BB.View.extend({
        el: $('.config'),
        lowSpeed: 40,
        mediumSpeed: 80,
        highSpeed: 130,
        fontSize_: 30,
        initialize: function(){

        },
        render: function(){
            this.$el.find('input#lowSpeed.form-control').val(GeneralSettings.lowSpeed);
            this.$el.find('input#mediumSpeed.form-control').val(GeneralSettings.mediumSpeed);
            this.$el.find('input#highSpeed.form-control').val(GeneralSettings.highSpeed);
            this.$el.find('input#fontSize.form-control').val(GeneralSettings.fontSize_);
        },
        saveSetup: function(){
            GeneralSettings.lowSpeed = $('#lowSpeed').val();
            GeneralSettings.mediumSpeed = $('#mediumSpeed').val();
            GeneralSettings.highSpeed = $('#highSpeed').val();
            GeneralSettings.fontSize_ = $('#fontSize').val();
        },
        showme: function(){
            this.$el.show('slow');
        },
        hideme: function(){
            this.saveSetup();
            this.$el.hide('slow');
        },
        getSettings: function(){
            return GeneralSettings;
        }
    });
});