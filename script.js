var accordion = new Vue({
  el: '#main',
  data: {

    heading1: 'Hello There!',
    heading2: 'Title of selector',
    text1: 'It somehow works',
    acd_title_1: 'Part 1',
    acd_text_1: 'text2 inside',
    acd_title_2: 'Part 2',
    acd_text_2: 'text1 inside',
    acd_title_3: 'Part 3',
    acd_text_3: 'text inside 3',

  }
})

var tabs = new Vue({
  el: '#tabs',
  data: {
    
    tab1_title: 'jakis text w title 1',
    tab1_text:  'jakis text w text 1',
    tab2_title: 'jakis text w title 2',
    tab2_text:  'jakis text w text 2',
    tab3_title: 'jakis text w title 3',
    tab3_text:  'jakis text w text 3',
  
  }
})

$( function() {
    $( "#accordion" ).accordion();
} );

$( function() {
    $( "#tabs" ).tabs();
} );