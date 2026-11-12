import { useState } from 'react'
import apiClient from '../../api/api-client'
import './postInteraction.css'
import {ThumbsUp, ThumbsDown} from 'iconoir-react'

export default function PostInteraction({post_id, module, likes, dislikes, current_interaction}) {
    // module -> BLOG, PROJECT etc..
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [curInteractStatus, setCurInteractStatus] = useState(current_interaction);
    const [curLikes, setCurLikes] = useState(likes);
    const [curDislikes, setCurDislikes] = useState(dislikes);

    const onLikeDislike = async (action) => {
        if (curInteractStatus === action) {
            action = 'none';
        }
        setIsLoading(true);
        const resp = await apiClient.likeOrDislikePost(post_id, module, action);
        if (resp.status !== 'OK') {
            // handle error
        }
        else {
            if (action === 'none' && curInteractStatus === 'like') {
                setCurLikes(prev => prev - 1);
            }
            else if (action === 'none' && curInteractStatus === 'dislike') {
                setCurDislikes(prev => prev - 1);
            }
            else if (action === 'like' && curInteractStatus === 'dislike') {
                setCurDislikes(prev => prev - 1);
                setCurLikes(prev => prev + 1);
            }
            else if (action === 'dislike' && curInteractStatus === 'like') {
                setCurLikes(prev => prev - 1);
                setCurDislikes(prev => prev + 1);
            }
            else if (action === 'like' && curInteractStatus === 'none') {
                setCurLikes(prev => prev + 1);
            }
            else if (action === 'dislike' && curInteractStatus === 'none') {
                setCurDislikes(prev => prev + 1);
            }
            setCurInteractStatus(action);
        }
        setIsLoading(false);
    }

    const onComment = async () => {
        setIsLoading(true);
        const resp = await apiClient.commentOnPost(post_id, module, comment);
        if (resp.status !== 'OK') {
            // handle error
        }
        setIsLoading(false);
    }

  return (
    <div className='post-interaction-area'>
        <textarea className='comment-box' placeholder='comment here..' onChange={eve => setComment(eve.target.value)}></textarea>
        <div className='review-opts'>
            <div className='opt like'>
                <ThumbsUp width={25} height={25} color='cyan' fill={curInteractStatus === 'like' ? 'cyan' : ''} className='icon' onClick={() => onLikeDislike('like')} />
                <span>{curLikes ?? 0}</span>
            </div>
            <div className='opt dislike'>
                <ThumbsDown width={25} height={25} color='cyan' fill={curInteractStatus === 'dislike' ? 'cyan' : ''} className='icon' onClick={() => onLikeDislike('dislike')} />
                <span>{curDislikes ?? 0}</span>
            </div>
            <button className='comment-btn' onClick={onComment}>comment</button>
        </div>
    </div>
  )
}
