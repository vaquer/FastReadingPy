define(['jquery', 'underscore', 'backbone', 'widgets/views/config', 'widgets/views/readdoc', 'jquery.cookie', 'jquery.ui.widget', 'jquery.iframe-transport', 'jquery.fileupload'], function ($, _, BB, config, readdoc) {
    return BB.View.extend({
        el: $('.site-wrapper'),
        configView: null,
        readView: null,
        page: 1,
        events: {
            'click .homePage': 'showmeMenu',
            'click .readPage': 'showReader',
            'click .configPage': 'showConfig',
        },
        initialize: function(){
            _.bindAll(this, '_showRead', '_changeProgress', '_manageFailUpload', '_loadState');
            this.configView = new config();
            this.configView.render();
        },
        render: function(){
            this.fileManager();
        },
        _changeProgress: function(progress){
            this.$el.find('.loading .lead.progresss').html( progress + '%');
        },
        _loadState: function(file){
            this.$el.find('.welcome').hide();
            this.$el.find('.loading .documento').html(file.name);
            this.$el.find('.loading .size').html(file.size + 'Kb');
            this.$el.find('.loading .progresss').html('0%');
        },
        _manageFailUpload: function(){
            this.$el.find('.loading .documento').html('Hemos tenido un error!');
            this.$el.find('.loading .lead').html('');
        },
        _showRead: function(){

        },
        fileManager: function(){
            var self = this;

            this.$el.find('input#fileupload').fileupload({
                dataType: 'json',
                maxFileSize: 10000000,
                done: function(e, data){
                    // var result = $.parseJSON(data.result);
                    self.page = 2;
                    $('.homePage').removeClass('active');
                    $('.readPage').addClass('active');
                    self.readView = new readdoc(self.configView ,data.result);
                    self.readView.render(self.configView.getSettings());
                },
                progressall: function(e, data){
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    self._changeProgress(progress);
                },
                fail: function(e, data){
                    self._manageFailUpload();
                },
                submit: function(e, data){
                    self._loadState(data.files[0]);
                }
            });
        },
        showmeMenu: function(e){
            switch(this.page){
                case 2:
                    this.readView.hideme();
                    $('.readPage').removeClass('active');
                    $('.homePage').addClass('active');
                    this.showme();
                break;
                case 3:
                    if(this.readView !== null){
                        this.readView.hideme();
                    }
                    $('.configPage').removeClass('active');
                    $('.homePage').addClass('active');
                    this.showme();
                break;
            }
            this.page = 1;
        },
        showReader: function(){
            if(this.readView !== null){
                switch(this.page){
                    case 1:
                        this.hideme();
                        $('.homePage').removeClass('active');
                        $('.readPage').addClass('active');
                        this.readView.showme(this.configView.getSettings());
                    break;
                    case 3:
                        this.configView.hideme();
                        $('.configPage').removeClass('active');
                        $('.readPage').addClass('active');
                        this.readView.showme(this.configView.getSettings());
                    break;
                }
                this.page = 2;
            }
        },
        showConfig: function(){
            switch(this.page){
                case 1:
                    this.hideme();
                    $('.homePage').removeClass('active');
                    $('.configPage').addClass('active');
                    this.configView.showme();
                break;
                case 2:
                    if(this.readView !== null){
                        this.readView.hideme();
                    }

                    $('.readPage').removeClass('active');
                    $('.configPage').addClass('active');
                    this.configView.showme();
                break;
            }
            this.page = 3;
        },
        showme: function(){
            this.$el.find('.welcome').show();
        },
        hideme: function(){
            this.$el.find('.welcome').hide();
        }
    });
});