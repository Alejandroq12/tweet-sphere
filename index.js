import tweetsData from './modules/data.js';

const tweetInput = document.getElementById('tweet-input');
const tweetBtn = document.getElementById('tweet-btn');

tweetBtn.addEventListener('click', () => {
  // eslint-disable-next-line no-console
  console.log(tweetInput.value);
});

document.addEventListener('click', (e) => {
  if (e.target.dataset.like) {
    // eslint-disable-next-line no-use-before-define
    handleLikeClick(e.target.dataset.like);
  }
});

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter((tweet) => tweet.uuid === tweetId)[0];
  targetTweetObj.likes += 1;
  // eslint-disable-next-line no-use-before-define
  render();
}

function getFeedHtml() {
  let feedHtml = '';

  tweetsData.forEach((tweet) => {
    feedHtml += `
        <div class='tweet'>
        <div class='tweet-inner'>
          <img src='${tweet.profilePic}' class="profile-pic" />
          <div>
            <p class='handle'>${tweet.handle}</p>
            <p class='tweet-text'>${tweet.tweetText}</p>
            <div class='tweet-details'>
              <span class='tweet-detail'>
                <i class='fa-regular fa-comment-dots'
                data-reply='${tweet.uuid}'
                ></i>
              ${tweet.replies.length}</span>
              <span class='tweet-detail'>
              <li class='fa-solid fa-heart'
              data-like='${tweet.uuid}'
              ></li>
              ${tweet.likes}</span>
              <span class='tweet-detail'>
              <li class='fa-solid fa-retweet'
              data-retweet='${tweet.uuid}'
              ></li>
              ${tweet.retweets}</span>
            </div>
          </div>
        </div>
      </div>`;
  });

  return feedHtml;
}

function render() {
  document.getElementById('feed').innerHTML = getFeedHtml();
}

render();
