import React, { useState } from 'react'
import "./blogCard.css"
import { Check, ShareAndroidSolid, ThumbsDown, ThumbsUp } from 'iconoir-react'
import { Link } from 'react-router-dom';

export default function BlogCard(props) {
    const { title, publish_date, content, blog_id, on_interact } = props;
    const [isCopyingLink, setIsCopyingLink] = useState(false);
    const on_click_share = () => {
        setIsCopyingLink(true);
        navigator.clipboard.writeText(`${window.location.host}/blog_preview?blog_id=${blog_id}`);
        setTimeout(() => {
            setIsCopyingLink(false);
        }, 3000);
    }
    return (
        <div className='blog_card_body'>
            <div className='card_header'>
                <h1 className='title'>{title}</h1>
                {isCopyingLink ?
                    <Check color='#00def9' width={25} height={25} className='share_icon' />
                    :
                    <ShareAndroidSolid color='#00def9' width={25} height={25} className='share_icon' onClick={on_click_share} />
                }
            </div>
            <p className='post_date'>{publish_date}</p>
            <div className='content'>
                {content}...
            </div>
            <div className='card_footer'>
                <div className='like_dislike'>
                    <ThumbsUp color='#00def9' width={25} height={25} className='opt thumb_up' onClick={()=>on_interact(blog_id, 'like')} />
                    <span className='like_count' style={{ marginRight: "10px" }}>0</span>
                    <ThumbsDown color='#00def9' width={25} height={25} className='opt thumb_up' onClick={()=>on_interact(blog_id, 'dislike')} />
                    <span className='dislike_count'>0</span>
                </div>
                <Link to={`/blog_preview?blog_id=${blog_id}`} className='read_more'>
                    Read More
                </Link>
            </div>
        </div>
    )
}
