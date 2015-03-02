define(['jquery', 'underscore', 'backbone', 'general_settings'], function ($, _, BB, GeneralSettings){
    return BB.View.extend({
        el: $('.reader'),
        configView: null,
        interval: null,
        documentToRead: null, 
        state: 0,
        speed: 0,
        currentWord: 0,
        texto: null,
        events: {
            'click .play': 'playButton',
            'click .rw': 'prevButton',
            'click .ff': 'nextButton',
            'click .pause': 'pauseButton',
            'click #playSlow': 'slowButton',
            'click #playMed': 'medButton',
            'click #playFast': 'fastButton',
        },
        initialize: function(configView, documentRead){
            _.bindAll(this, 'next', 'prev', 'play', 'pause')
            this.configView = configView;
            this.$el = $('.reader');
            this.speed = parseInt(60000 / this.configView.mediumSpeed);
            this.documentToRead = documentRead;
            // this.documentToRead.texto = this.documentToRead.texto.replace('', ' ');
            this.documentToRead.texto = this.documentToRead.texto.split(' ');
        },
        render: function(configView){
            this.$el.find('.word').html(this.documentToRead.texto[0]);
            this.showme(configView);
        },
        playButton: function(){
            if(this.state === 0){
                this.state = 1;
                this.$el.find('.play').addClass('hide');
                this.$el.find('.pause').removeClass('hide');
                this.interval = setInterval(this.play, this.speed);
            }
        },
        pauseButton: function(){
            this.pause();
        },
        prevButton: function(){
            this.pause();
            this.$el.find('.word').html(this.prev());
            // this.playButton();
        },
        nextButton: function(){
            this.pause();
            this.$el.find('.word').html(this.next());
            // this.playButton();
        },
        slowButton: function(){
            this.pause();
            this.speed = parseInt(60000 / GeneralSettings.lowSpeed);
            this.playButton();
        },
        medButton: function(){
            this.pause();
            this.speed = parseInt(60000 / GeneralSettings.mediumSpeed);
            this.playButton();
        },
        fastButton: function(){
            this.pause();
            this.speed = parseInt(60000 / GeneralSettings.highSpeed);
            this.playButton();
        },
        play: function(){
            this.$el.find('.word').html(this.next());
        },
        pause: function(){
            if(this.state === 1){
                clearInterval(this.interval);
                this.state = 0;
                this.$el.find('.play').removeClass('hide');
                this.$el.find('.pause').addClass('hide');
            }
        },
        next: function(){
            var next = true;
            while(this.documentToRead.texto.length > this.currentWord && next){
                this.currentWord++;
                if(this.documentToRead.texto[this.currentWord] !== ''){
                    next = false;
                }
            }
            return this.documentToRead.texto[this.currentWord];
        },
        prev: function(){
            var next = true;
            while(this.currentWord > 0 && next){
                this.currentWord--;
                if(this.documentToRead.texto[this.currentWord] !== ''){
                    next = false;
                }
            }
            return this.documentToRead.texto[this.currentWord];
        },
        showme: function(configView){
            this.$el.find('.word').css('font-size', configView.fontSize_ + 'px')
            this.$el.show('slow');
        },
        hideme: function(){
            this.$el.hide();
            this.pause();
        }
    });
});