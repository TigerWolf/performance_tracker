# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/
$ ->
  tagAdderEl = $("#tag_adder")
  tagAdderEl.select2
    createSearchChoice: (term, data) ->
      if $(data).filter(->
        @text.localeCompare(term) is 0
      ).length is 0
        id: term
        text: term
    multiple: true
    data: []
    
    ajax: 
      dataType: 'json'
      url: tagAdderEl.data 'url'
      results: (data, page) ->
        { results: data }
      data: (term, page) ->
        return { q: term, customer_id: $('#portfolio_client_id').val() }
        #console.log(term)
        # { method: "GetClientsByName", name: term }

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

  addAllEl = $("#add_all")
  addAllEl.click ->
    $.ajax(
      dataType: 'json'
      url: tagAdderEl.data 'url'
      data:
        { customer_id: $('#portfolio_client_id').val() }
    ).done (data) ->
      tagAdderEl.select2("data", data)
      
