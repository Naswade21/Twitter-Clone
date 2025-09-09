import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const modal = document.getElementById('modal')

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
            handleLikeClick(e.target.dataset.like)
    }
    else if(e.target.dataset.sublike){
        subHandleClick(e.target.dataset.sublike)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply) /////
    }
    else if(e.target.dataset.subreply){
        subHandleReplyClick(e.target.dataset.subreply)
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.subretweet){
        subHandleRetweetClick(e.target.dataset.subretweet)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.id === 'tweet-btn-modal'){
        subHandleTweetBtnClick()
    }
    else if(e.target.id === 'close-btn'){
        modal.classList.toggle('modal-appear')
    }
})

function subHandleClick(tweetId){
     const replyArray = []

    tweetsData.forEach(function(hey){
        hey.replies.forEach(function(heyman){
            if(heyman.uuid === tweetId)
                replyArray.push(heyman)
        })
    })

    const replyTargetTweet = replyArray[0]

    if(replyTargetTweet.isLiked){
        replyTargetTweet.likes--
    } else {
        replyTargetTweet.likes++
    }

    replyTargetTweet.isLiked = !replyTargetTweet.isLiked
    render()
}
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
            return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }

    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function subHandleRetweetClick(tweetId){
     const replyArray = []

    tweetsData.forEach(function(hey){
        hey.replies.forEach(function(heyman){
            if(heyman.uuid === tweetId)
                replyArray.push(heyman)
        })
    })

    const replyTargetTweet = replyArray[0]

    if(replyTargetTweet.isRetweeted){
        replyTargetTweet.retweets--
    } else {
        replyTargetTweet.retweets++
    }

    replyTargetTweet.isRetweeted = !replyTargetTweet.isRetweeted
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
            return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function subHandleReplyClick(replyId){
    const replyArray = []

    tweetsData.forEach(function(hey){
        hey.replies.forEach(function(heyman){
            if(heyman.uuid === replyId)
                replyArray.push(heyman)
        })
    })

    const replyTargetTweet = replyArray[0]

    if(replyId && replyTargetTweet.uuid){
        modal.classList.add('modal-appear')
    } else if(!replyId) {
        modal.classList.remove('modal-appear')
    } else{

    }
        
}

function handleReplyClick(replyId){
    const targetTweetObj = tweetsData.filter(function(tweet){
            return tweet.uuid === replyId
    })[0]

    const toggleReply =  document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
    renderButton(targetTweetObj.uuid)

    if(replyId || toggleReply === false){
        modal.classList.add('modal-appear')
    } else if(!replyId) {
        modal.classList.remove('modal-appear')
    }
        
}

function subHandleTweetBtnClick(){
    const tweetInputModal = document.getElementById('tweet-input-modal')

    if(tweetInputModal.value){
        tweetsData.unshift({
            handle: `@ItsNasBrown`,
            profilePic: `images/nasprofile.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInputModal.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInputModal.value = ''
    }

}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@ItsNasBrown`,
            profilePic: `images/nasprofile.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length >= 0){
            tweet.replies.forEach(function(reply){
                let likeReplyIconClass = ''

                if (reply.isLiked){
            likeReplyIconClass = 'liked'
        }

         let retweetReplyIconClass = ''

        if (reply.isRetweeted){
            retweetReplyIconClass = 'retweeted'
        }
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
                <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-subreply="${reply.uuid}"
                    ></i>
                    ${reply.replies.length}
                </span>
                <span class="tweet-detail" >
                    <i class="fa-solid fa-heart ${likeReplyIconClass}"
                    data-sublike="${reply.uuid}"
                    ></i>
                    ${reply.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetReplyIconClass}"
                    data-subretweet="${reply.uuid}"
                    ></i>
                    ${reply.retweets}
                </span>
            </div>   
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function getButtonHtml(){
    let buttonHTML = ``

    tweetsData.forEach(function(tweet){
        tweet.replies.forEach(function(sub){
            buttonHTML += `<button id="tweet-btn-modal-${sub.uuid}">Tweet</button>`
        })
    })
    return buttonHTML
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

function renderButton(replyId){
    document.getElementById('btn-hold').innerHTML = getButtonHtml()
}

render()


