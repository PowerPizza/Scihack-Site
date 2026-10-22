import { useEffect, useState } from 'react'
import './blogDraftList.css'
import { Prohibition, TransitionDown, XmarkCircle } from 'iconoir-react'

function BlogDraftElement({title, date, on_load_draft, on_del_draft}) {
    return (
        <div className='blog_draft_item'>
            <div className='draft_info'>
                <span className='d_title'>{title}</span>
                <span className='d_date'>{date}</span>
            </div>
            <div className='draft_opts'>
                <button><TransitionDown width={30} height={30} color='lime' onClick={on_load_draft}/></button>
                <button><XmarkCircle width={30} height={30} color='red' onClick={on_del_draft}/></button>
            </div>
        </div>
    )
}

export default function BlogDraftList({on_close, load_draft}) {
    const [showClearDraftPrompt, setShowClearDraftPrompt] = useState(false);
    const [currentDrafts, setCurrentDrafts] = useState(null);

    const on_clear_drafts = ()=>{
        localStorage.setItem("blog_drafts", "{}");
        on_close();
    }

    const on_delete_draft = (draft_id)=>{
        let cur_drf = JSON.parse(JSON.stringify(currentDrafts));
        delete cur_drf[draft_id];
        localStorage.setItem("blog_drafts", JSON.stringify(cur_drf));
        setCurrentDrafts(cur_drf);
    }

    const on_load_draft = (draft_id)=>{
        load_draft(draft_id, currentDrafts[draft_id]);
        on_close();
    }


    useEffect(()=>{
        setCurrentDrafts(JSON.parse(localStorage.getItem("blog_drafts") ?? "{}"));
    }, []);
    
  return (
    <div className='all_black blog_draft_body'>
        <div className='view_container blog_draft_container'>
            <div className='header'>
                <h2 className='heading'>Blog Drafts</h2>
                <Prohibition width={25} height={25} className='clear_drafts' onClick={()=>{setShowClearDraftPrompt(true)}}/>
                <XmarkCircle width={28} height={28} className='close_win' onClick={on_close} />
            </div>
            {showClearDraftPrompt ? 
                <div className='clear_drafts_prompt'>
                    <span>Do you want to clear all drafts?</span>
                    <button className='d_opt yes' onClick={on_clear_drafts} >Yes</button>
                    <button className='d_opt no' onClick={()=>{setShowClearDraftPrompt(false)}}>No</button>
                </div>
            : null}
            <div className='draft_holder'>
                {currentDrafts && Object.keys(currentDrafts).length ? 
                Object.keys(currentDrafts).map((draft_id, idx)=>{
                    return <BlogDraftElement title={currentDrafts[draft_id]["title"]} date={currentDrafts[draft_id]["publish_date"]} key={"BLOG_DRAFT_ELE"+idx} on_load_draft={()=>{on_load_draft(draft_id)}} on_del_draft={()=>{on_delete_draft(draft_id)}} />
                })
                :
                <span style={{textAlign: "center"}}>No drafts are available.</span>}
            </div>
        </div>
    </div>
  )
}
