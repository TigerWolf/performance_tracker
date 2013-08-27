# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/
$ ->
  $("#tag_adder").select2
    createSearchChoice: (term, data) ->
      if $(data).filter(->
        @text.localeCompare(term) is 0
      ).length is 0
        id: term
        text: term
    multiple: true
    data: []
    maximumInputLength: 9
    tokenSeparators: [",", " "]

    initSelection: (element, callback) ->
      tags = $(element).val().split(',')
      data = []
      for tag in tags
        data.push { id: tag, text: tag }
      
      callback data

    tokenizer: (input, selection, callback) ->
      # no comma no need to tokenize
      return  if input.indexOf(",") < 0
      parts = input.split(",")
      data = []

      for part in parts when $.isNumeric(part) # This is hacky but should check for numbers and text if needed
        callback { id: part, text: part } 
      $('#s2id_list-tag_adder .select2-input').val(" ") # This is to fix the looping issue but doesnt work correctly - it puts in [object Object]
      
