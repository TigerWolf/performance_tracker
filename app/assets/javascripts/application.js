// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require ink.min
//= require ink-ui.min
//= require autoload
//= require html5shiv
//= require select2
//= require_tree .

$(function(){
$("#tag_adder").select2({
                createSearchChoice:function(term, data) { if ($(data).filter(function() { return this.text.localeCompare(term)===0; }).length===0) {return {id:term, text:term};} },
                multiple: true,
                data: [],//[{id: 0, text: 'story'},{id: 1, text: 'bug'},{id: 2, text: 'task'}]
                maximumInputLength: 9
            });
});

