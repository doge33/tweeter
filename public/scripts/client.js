/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(() => {

  //click top-right corner to show/hide new-tweet form;
  $('#compose-tweet').click( function() {
    $('.new-tweet').slideToggle(function(){   
    });
  });

  const loadTweets = function() {

      $.ajax({
        url: '/tweets',
        method:"GET",
        success: (response) => {
          $('form').trigger('reset');
          $('#all-tweets').empty();
          renderTweets(response);   
      }
    });
  };
  //GET right after definition to load initial tweets;
  loadTweets();
   
  $('form').on('submit', function(evt) {
    //form-validation here:
    const userInput = $('textArea').val();
    $('.error').slideUp();
    
    if (userInput.length === 0) {
      evt.preventDefault();
      $('.empty').slideDown(function() {
        $('.empty > div').text('Your tweet is empty. Please make sure you enter something!');
      })

    } else if (userInput.length > 140) {
      evt.preventDefault();
      $('.too-long').slideDown(function() {
        $('.too-long > div').text('Please keep it within 140 characters!');
      })

    } else {
      //if all is good, allow submission
      evt.preventDefault();
      //serialize value of form because server is set to receive query string
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

//-------helper functions 1: security & timestamp------//

//helps escape insecure text that can break the page
const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

//this helper can turn timestamp into ..days ago OR hours OR ...minutes ago
const daysAgo = (timeCreated) => {
  let timeDifference = (Date.now() - timeCreated);

  if (timeDifference >= 86400000) {
    return Math.floor(timeDifference / 86400000) + " days ago";

  } else if (timeDifference >= 3600000){
    return Math.floor(timeDifference / 3600000) + " hours ago";

  } else {
    return Math.floor(timeDifference / 60000) + " minutes ago";
  }
};

//------helper functions 2: define how to create new tweet------//

//this function decides what info to grab from each tweet object, and the html of it(same as tweet-container)
 const createTweetElement = (tweetObj) => {

  const timestamp = daysAgo(tweetObj.created_at);

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
          ${escape(tweetObj.content.text)}
        </p>
        <footer>
          <span>${timestamp}</span>
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

//this helper loops through an array of tweets from database
const renderTweets = (tweetsArray) => {

  for (tweetObj of tweetsArray) {
    
    $('#all-tweets').append(createTweetElement(tweetObj));
  }

}

