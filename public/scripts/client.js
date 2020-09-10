/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(() => {

  const loadTweets = function() {
    //console.log("POSt success")
  
      $.ajax({
        url: '/tweets',
        method:"GET",
        success: (response) => {
          console.log("inside GET success")
          console.log(response);
          $('form').trigger('reset');
          $('#all-tweets').empty();
          renderTweets(response);   
      }
    });//call this right after defining it, cuz if you don't, you will have to click submit twice to come to GET
  };
  loadTweets();
   
  $('form').on('submit', function(evt) {
    //form-validation here:
    const userInput = $('textArea').val();
    
    if (userInput.length === 0) {
      evt.preventDefault();
      alert("Looks like your tweet is empty. Please make sure you enter something ;)")

    } else if (userInput.length > 140) {
      evt.preventDefault();
      alert("Hey the tweet is too long. Please keep it within 140 characters!")

    } else {
      //if all is good, allow submission
      evt.preventDefault();

      //get the data value of what is entered into the form, using serialize()
      const tweetInput = $(this).serialize();
      $.ajax({
        url: '/tweets', 
        method: 'POST',
        dataType: 'text',
        data: tweetInput,
        success: loadTweets

      });
    }
  });  
})


//this function decides what info to grab from each tweet object, and the html of it(same as tweet-container)
 const createTweetElement = (tweetObj) => {

  const $tweet = $(`
  <article class="single-tweet">
        <header>
          <div class="tweet-profile">
              <img src="${tweetObj.user.avatars}"> 
              <span>${tweetObj.user.name}</span>    
          </div> 
          <span class="user-handle">
            ${tweetObj.user.handle}
          </span>
        </header>
        <p>
          ${tweetObj.content.text}
        </p>
        <footer>
          <span>${tweetObj.created_at}</span>
          <section>
            <img src="./images/flag-alt-solid-24.png">
            <img src="./images/repost-regular-24.png">
            <img src="./images/heart-solid-24.png">
          </section> 
        </footer>
      </article>
  `);
  return $tweet;
}

const renderTweets = (tweetsArray) => {

  for (tweetObj of tweetsArray) {
    
    $('#all-tweets').append(createTweetElement(tweetObj));
  }

}
