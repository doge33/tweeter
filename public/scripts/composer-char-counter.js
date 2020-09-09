//jQuerry; makes sure this won't be triggered until the whole page/DOM is loaded. 
$(document).ready(function() {


  $('textarea').on('keyup', function() {

    let count = $(this).val().length;
    let remainder = 140 - count;
    let counter = $(this).siblings().find('.counter').text(remainder);

    $(counter).css({color: (remainder >= 0) ? '' : 'red'})
    


  });
  
})