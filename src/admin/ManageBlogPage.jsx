import React, { useCallback, useEffect, useState } from 'react'
import './manageBlogPage.css'
import { ArrowUpRightCircle, EditPencil, FastArrowLeft, UserStar, XmarkCircle } from 'iconoir-react'
import LoadingCircle from '../loading_circle/LoadingCircle';
import { Link } from 'react-router-dom';
import PromptYesNo from '../prompt_box/PromptYesNo';
import BlogEditorPage from './BlogEditorPage';

function BlogElement({title, publish_date, blog_id, create_msg_box, set_delete_prompt, load_blogs, on_edit_blog}) {
    const [is_deleting, set_is_deleting] = useState(false);

    const on_delete_blog = ()=>{
        async function onYes(){
            set_is_deleting(true);
            let http_resp = await fetch("/delete_blog", {method: "POST", body: JSON.stringify({"blog_id": blog_id})});
            http_resp = JSON.parse(await http_resp.text());
            if (http_resp["status"] === "success") {
                create_msg_box("Blog post deleted successfully.", "success");
                set_delete_prompt(null);
                load_blogs();
            }
            else {
                create_msg_box(`Failed to delete.\nError : ${http_resp["error"]}`, "error");
            }
            set_is_deleting(false);
        }
        function onNo() {
            set_delete_prompt(null);
        }
        set_delete_prompt(<PromptYesNo msg_text={`Do you really want to delete blog '${title}' ?`} onYes={onYes} onNo={onNo} />)
        
    }
    return (
        <div className='blog_element'>
            <div className='blog_info'>
                <h2 className='title'>{title}</h2>
                <span className='publish_date'>{publish_date}</span>
            </div>
            <div className='ctrl_opts'>
                <Link to={`/blog_preview?blog_id=${blog_id}`} target='_blank'>
                    <ArrowUpRightCircle width={30} height={30} color='cyan' className='opt' />
                </Link>
                <EditPencil width={30} height={30} color='lime' className='opt' onClick={()=>{on_edit_blog(blog_id)}} />
                {is_deleting ?
                <LoadingCircle width={25} height={25}/>
                :
                <XmarkCircle width={30} height={30} color='red' className='opt' onClick={on_delete_blog} />}
            </div>
        </div>
    )
}

export default function ManageBlogPage(props) {
    const {closeShowingWin} = props;
    const [blogElements, setBlogElements] = useState(null);
    const [deletePropmpt, setDeletePrompt] = useState(null);
    const [blogEditor, setBlogEditor] = useState(null);

    const on_edit_blog = useCallback((blog_id)=>{
        setBlogEditor(<BlogEditorPage createMessageBox={props.createMessageBox} closeShowingWin={()=>{setBlogEditor(false)}} blog_id={blog_id} />)
    }, [props]);

    const load_blogs = useCallback(
        async ()=>{
            let http_resp = await fetch("/get_blog_title_date", {method: "POST"});
            http_resp = JSON.parse(await http_resp.text());
            if ((http_resp["blogs"] ?? "undefined") === "undefined") return;
            setBlogElements(http_resp["blogs"].map((item, idx)=>{
                return <BlogElement title={item["title"]} publish_date={item["publish_date"]} blog_id={item["_id"]} key={"blog_ele_v+"+idx} create_msg_box={props.createMessageBox} set_delete_prompt={setDeletePrompt} load_blogs={load_blogs} on_edit_blog={on_edit_blog} />
            }))
        },
        [props, on_edit_blog]
    );

    useEffect(()=>{
        document.getElementsByClassName("content_and_footer")[0].scrollTo(0, 0);
        load_blogs();
    }, [load_blogs]);

    if (blogEditor) {
        return blogEditor
    }

  return (
    <div className='manage_blog_body'>
        {deletePropmpt}
        <div className='opt_page_header'>
            <FastArrowLeft width={35} height={35} className='back_icon' onClick={closeShowingWin} />
            <h1>Manage Blogs</h1>
        </div>

        <div className='blog_list_holder'>
            {blogElements === null ?
                <span style={{marginLeft: 'auto', marginRight: "auto"}}><LoadingCircle width={30} height={30} /></span>
            :
                !blogElements.length ? <span style={{marginLeft: 'auto', marginRight: "auto", color: "white"}}>No blogs found!</span> : blogElements
            }
        </div>
    </div>
  )
}
