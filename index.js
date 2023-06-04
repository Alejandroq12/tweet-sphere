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
  } else if (e.target.dataset.retweet) {
    // eslint-disable-next-line no-use-before-define
    handleRetweetClick(e.target.dataset.retweet);
  }
});

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter(
    (tweet) => tweet.uuid === tweetId,
  )[0];
  if (targetTweetObj.isLiked) {
    targetTweetObj.likes -= 1;
  } else {
    targetTweetObj.likes += 1;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  // eslint-disable-next-line no-use-before-define
  render();
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter(
    (tweet) => tweet.uuid === tweetId,
  )[0];
  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets -= 1;
  } else {
    targetTweetObj.retweets += 1;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
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
