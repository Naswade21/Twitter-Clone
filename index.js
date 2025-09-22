import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const modal = document.getElementById('modal')
const singleButton = document.getElementById('btn-hold')
let tweetsFromLocalStorage = JSON.parse(localStorage.getItem("myTweetsData"))

if(!tweetsFromLocalStorage){
    tweetsFromLocalStorage = tweetsData
    localStorage.setItem("myTweetsData", JSON.stringify(tweetsData))
}

function getButtonHTML(replyId){
    let buttonHTML = `<button data-button="${replyId}">Tweet</button>`
    return buttonHTML
}

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
            handleLikeClick(e.target.dataset.like)
    }
    else if(e.target.dataset.sublike){
        subHandleLikeClick(e.target.dataset.sublike)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
        console.log('main')
    }
    else if(e.target.dataset.subreply){
        subHandleReplyClick(e.target.dataset.subreply)
        console.log('sub')
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
    else if(e.target.dataset.button){
        subHandleTweetBtnClick(e.target.dataset.button)
    }
    else if(e.target.dataset.delete){
        deleteTweetClick(e.target.dataset.delete)
    }
    else if(e.target.id === 'close-btn'){
        modal.classList.toggle('modal-appear')
    }
})

function deleteTweetClick(deleteId){ 

    tweetsFromLocalStorage = removeTweetById(tweetsFromLocalStorage, deleteId)
   
    localStorage.setItem("myTweetsData", JSON.stringify(tweetsFromLocalStorage))
    render()
}

function subHandleLikeClick(tweetId){

    const replyTargetTweet = findTheTweetById(tweetsFromLocalStorage, tweetId)

    if(replyTargetTweet.isLiked){
        replyTargetTweet.likes--
    } else {
        replyTargetTweet.likes++
    }

    replyTargetTweet.isLiked = !replyTargetTweet.isLiked
    localStorage.setItem("myTweetsData", JSON.stringify(tweetsFromLocalStorage))
    render()
}
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = findTheTweetById(tweetsFromLocalStorage, tweetId)

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }

    targetTweetObj.isLiked = !targetTweetObj.isLiked
    localStorage.setItem("myTweetsData", JSON.stringify(tweetsFromLocalStorage))
    render()
}

function subHandleRetweetClick(tweetId){

    const replyTargetTweet = findTheTweetById(tweetsFromLocalStorage, tweetId)

    if(replyTargetTweet.isRetweeted){
        replyTargetTweet.retweets--
    } else {
        replyTargetTweet.retweets++
    }

    replyTargetTweet.isRetweeted = !replyTargetTweet.isRetweeted
    localStorage.setItem("myTweetsData", JSON.stringify(tweetsFromLocalStorage))
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = findTheTweetById(tweetsFromLocalStorage, tweetId)
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    localStorage.setItem("myTweetsData", JSON.stringify(tweetsFromLocalStorage))
    render() 
}

function subHandleReplyClick(replyId){

    const replyTargetTweet = findTheTweetById(tweetsFromLocalStorage, replyId)

    singleButton.innerHTML = getButtonHTML(replyId)

    const toggleReply =  document.getElementById(`${replyId}`).classList.toggle('hidden')


    if(!toggleReply){
        modal.classList.add('modal-appear')
    } else if(toggleReply) {
        modal.classList.remove('modal-appear')
    }
}

function handleReplyClick(replyId){
     singleButton.innerHTML = getButtonHTML(replyId)

    const toggleReply =  document.getElementById(`replies-${replyId}`).classList.toggle('hidden')

    if(!toggleReply){
        modal.classList.add('modal-appear')
    } else if(toggleReply) {
        modal.classList.remove('modal-appear')
    }
        
}

//my try at recursion to access whatever id I need ---> it works!
function findTheTweetById(tweetsFromLocalStorage, id){
    let foundTweet = null
    tweetsFromLocalStorage.forEach(function(tweet){
        if(foundTweet){
            return
        }

        if (tweet.uuid === id){
            foundTweet = tweet
            return
        }

        if(tweet.replies && tweet.replies.length >= 0){
            const foundTweetReplies = findTheTweetById(tweet.replies, id)

            if(foundTweetReplies){
            foundTweet = foundTweetReplies
            return
        }

        }
    })

    return foundTweet
}

function removeTweetById(tweetsFromLocalStorage, id){
    return tweetsFromLocalStorage.filter(function(tweet){
        if(tweet.uuid === id){
            return false
        }

        if(Array.isArray(tweet.replies)){
            tweet.replies = removeTweetById(tweet.replies, id)
        }

        return true
    })
}


function subHandleTweetBtnClick(replyId){
    const tweetInputModal = document.getElementById('tweet-input-modal')
    const targetTweet = findTheTweetById(tweetsFromLocalStorage, replyId)

    if(tweetInputModal.value){
        targetTweet.replies.unshift({
            handle: `@ItsNasBrown`,
            profilePic: `/images/nasprofile.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInputModal.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    localStorage.setItem("myTweetsData", JSON.stringify(tweetsFromLocalStorage))
    render()
    tweetInputModal.value = ''
    } 
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsFromLocalStorage.unshift({
            handle: `@ItsNasBrown`,
            profilePic: `/images/nasprofile.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    localStorage.setItem("myTweetsData", JSON.stringify(tweetsFromLocalStorage))
    render()
    tweetInput.value = ''
    }

}


function getFeedHtml(){
    let feedHtml = ``
    
    tweetsFromLocalStorage.forEach(function(tweet){
        
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

        let subReplies = ``

        if(reply.replies.length >= 0){
            reply.replies.forEach(function(sub){
                let subLike = ''

                if(sub.isLiked){
                    subLike = 'liked'
                }

                let subRetweet = ''

                if(sub.isRetweeted){
                    subRetweet = 'retweeted'
                }

                subReplies +=`
                <div id="${sub.uuid}">
                    <div class="tweet-reply">
    <div class="tweet-inner">
        <img src="./${sub.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${sub.handle}</p>
                <p class="tweet-text">${sub.tweetText}</p>
                <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-subreply="${sub.uuid}"
                    ></i>
                    ${sub.replies.length}
                </span>
                <span class="tweet-detail" >
                    <i class="fa-solid fa-heart ${subLike}"
                    data-sublike="${sub.uuid}"
                    ></i>
                    ${sub.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${subRetweet}"
                    data-subretweet="${sub.uuid}"
                    ></i>
                    ${sub.retweets}
                </span>
                <span class="tweet-detail">
                    <i class="fa-regular fa-circle-xmark"
                    data-delete="${sub.uuid}"></i>
                </span>
            </div>   
            </div>
        </div> 
</div>
                </div>
                `
            })

        }

                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="./${reply.profilePic}" class="profile-pic">
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
                <span class="tweet-detail">
                    <i class="fa-regular fa-circle-xmark"
                    data-delete="${reply.uuid}"></i>
                </span>
            </div>   
            </div>
        </div> 
       ${subReplies}
</div>
`
        
            })
        } 
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="./${tweet.profilePic}" class="profile-pic">
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
                <span class="tweet-detail">
                    <i class="fa-regular fa-circle-xmark"
                    data-delete="${tweet.uuid}"></i>
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

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()



