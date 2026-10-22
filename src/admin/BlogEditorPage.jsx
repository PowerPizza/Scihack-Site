import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import './blogEditorPage.css'
import ModernEntry from '../contact_us/ModernEntry';
import LoadingCircle from '../loading_circle/LoadingCircle';
import BlogDraftList from './prompts_and_popups/BlogDraftList';
import CustomTiptapEditor from '../custom_tiptap_editor/CustomTiptapEditor';
import { FastArrowLeft, SendSolid } from 'iconoir-react';

export default function BlogEditorPage(props) {
    const [fontFamiliesUsed, setFontFamiliesUsed] = useState([]);
    const [blogId, setBlogId] = useState(props.blog_id);
    const [blogTitle, setBlogTitle] = useState("");
    const [isPostingBlog, setIsPostingBlog] = useState(false);
    const [isBlogLoading, setIsBlogLoding] = useState(false);
    const [blog_draft_prompt, setBlogDraftPrompt] = useState(null);
    const [isDrafting, setIsDrafting] = useState(false);

    const curHeadElement = useRef(null);
    const draft_id_ref = useRef(null);
    const blog_id_ref = useRef();
    const blog_title_ref = useRef(null);
    const font_families_used_ref = useRef([]);
    const drafting_interval = useRef(null);

    const editor_ = useRef(null);

    const setEditor = (editor)=>{
        editor_.current = editor;

    }
    const months = useMemo(()=>{
        return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    }, []); 
   
    const onCloseThisWindow = () => {
        props.closeShowingWin();
        // props.createYesNoPrompt("Form filled on this page will be cleared, do you agree?", () => {
        //     props.closeShowingWin();
        //     props.closeYesNoPrompt();
        // }, props.closeYesNoPrompt);
    }

    const onPublishBlog = async () => {
        setIsPostingBlog(true);
        const date_ = new Date();
        let publish_date = `${months[date_.getMonth() + 1]} ${String(date_.getDate()).padStart(2, "0")}, ${date_.getFullYear()}`;
        let to_send = { "html_content": editor_.current.getHTML(), "additional_fonts": fontFamiliesUsed, "blog_id": blogId ?? "", "title": blogTitle, "publish_date": publish_date, "description": editor_.current.getText().slice(0, 250).replaceAll("\n", " ") }
        // let http_resp = await fetch("/add_blog", { method: "POST", body: btoa(JSON.stringify(to_send)) });
        const encoder_ = new TextEncoder();
        let bytes = '';
        encoder_.encode(JSON.stringify(to_send)).forEach((ele)=>{
            bytes += String.fromCharCode(ele);
        });
        let http_resp = await fetch("/add_blog", { method: "POST", body: btoa(bytes) });
        http_resp = JSON.parse(await http_resp.text());
        if (http_resp["status"] === "success") {
            setBlogId(http_resp["blog_id"]);
            props.createMessageBox("Post has been saved!", "success");
        }
        else {
            props.createMessageBox(`Failed to save post\nError : ${http_resp["error"]}`, "error");
        }
        setIsPostingBlog(false);
    }

    const appendFontUsed = useCallback((new_family) => {
        if (!fontFamiliesUsed.includes(new_family)) {
            setFontFamiliesUsed([...fontFamiliesUsed, new_family]);

            let url_ = "https://fonts.googleapis.com/css?family=";
            [...fontFamiliesUsed, new_family].forEach(family_name => {
                url_ += family_name + "|"
            });

            if (curHeadElement.current) {
                curHeadElement.current.remove();
                curHeadElement.current = null;
            }
            let ele_ = document.createElement("link");
            ele_.rel = "stylesheet";
            ele_.href = url_.substring(0, url_.length - 1);
            document.head.appendChild(ele_);
            curHeadElement.current = ele_;
        }
    }, [fontFamiliesUsed]);

    useEffect(() => {
        blog_id_ref.current = blogId;
        blog_title_ref.current = blogTitle;
        font_families_used_ref.current = fontFamiliesUsed;
    }, [blogId, blogTitle, fontFamiliesUsed]);

    const backup_draft = useCallback(() => {
        const available_drafts = localStorage.getItem("blog_drafts");
        if (!available_drafts) {
            localStorage.setItem("blog_drafts", "{}");
        }
        else {
            const date_ = new Date();
            let publish_date = `${months[date_.getMonth() + 1]} ${String(date_.getDate()).padStart(2, "0")}, ${date_.getFullYear()}`;
            let draft_element = { "title": blog_title_ref.current, "blog_id": blog_id_ref.current, "font_families_used": font_families_used_ref.current, "publish_date": publish_date, "html_content": editor_.current.getHTML() };
            let old_drafts = JSON.parse(available_drafts);
            if (draft_id_ref.current === null) {
                let new_draft_id = `draft_${Object.keys(old_drafts).length + 1}`
                draft_id_ref.current = new_draft_id;
            }
            old_drafts[draft_id_ref.current] = draft_element;
            console.log("saved", old_drafts);
            localStorage.setItem("blog_drafts", JSON.stringify(old_drafts));
        }
        setIsDrafting(false);
    }, [months]);

    const begin_draft_saver = useCallback(()=>{
        drafting_interval.current = setInterval(()=>{
            setIsDrafting(true);
            setTimeout(backup_draft, 5000)
        }, 30000);
    }, [backup_draft]);

    useEffect(() => {
        const get_blog_data = async () => {
            setIsBlogLoding(true);
            let http_resp = await fetch("/get_blog_post", { method: "POST", body: JSON.stringify({ "blog_id": props.blog_id }) });
            http_resp = JSON.parse(await http_resp.text());
            if (http_resp["status"] === "success") {
                editor_.current.commands.setContent(http_resp["blog_data"]["html_content"]);
                setBlogTitle(http_resp["blog_data"]["title"]);
                setFontFamiliesUsed(http_resp["blog_data"]["additional_fonts"]);
                if (http_resp["blog_data"]["additional_fonts"]) {
                    let url_ = "https://fonts.googleapis.com/css?family=";
                    http_resp["blog_data"]["additional_fonts"].forEach(family_name => {
                        url_ += family_name + "|"
                    });

                    let ele_ = document.createElement("link");
                    ele_.rel = "stylesheet";
                    ele_.href = url_.substring(0, url_.length - 1);
                    document.head.appendChild(ele_);
                }
            }
            setIsBlogLoding(false);
        }
        if (props.blog_id) {
            get_blog_data();
        }
    }, [props.blog_id])

    useEffect(() => {
        const load_draft = (draft_id, draft_metadata)=>{
            setBlogTitle(draft_metadata["title"]);
            editor_.current.commands.setContent(draft_metadata["html_content"]);
            setBlogId(draft_metadata["blog_id"]);
            (draft_metadata["font_families_used"] ?? []).map(appendFontUsed);
            draft_id_ref.current = draft_id;
        }

        document.getElementsByClassName("content_and_footer")[0].scrollTo(0, 0);
        if (localStorage.getItem("blog_drafts")) {
            // passing begin_draft_saver() in onclose will begin draft saver if the draft list is cleared or closed.
            setBlogDraftPrompt(<BlogDraftList on_close={() => { setBlogDraftPrompt(null); begin_draft_saver() }} load_draft={load_draft} />);
        }
        else {
            begin_draft_saver();
        }

        return ()=>{
            clearInterval(drafting_interval.current);
        }
    }, [begin_draft_saver, appendFontUsed]);

    const onEditorUpdate = (editor, fonts_used) => {
        setEditor(editor);
        font_families_used_ref.current = fonts_used;
    }

    return (
        <div className='blog_editor_body'>
            {blog_draft_prompt}
            {isDrafting ?
                <div className='backing_up_tag'>
                    <span>Drafting</span>
                </div>
                : null}
            <div className='opt_page_header'>
                <FastArrowLeft width={35} height={35} color='cyan' className='back_icon' onClick={onCloseThisWindow} />
                <h1>Publish Blog</h1>
            </div>
            {isBlogLoading ? <span style={{ marginLeft: "auto", marginRight: "auto", marginTop: "10px" }}><LoadingCircle width={35} height={35} /></span> : null}
            <div className='content'>
                <div className='editor_header'>
                    <ModernEntry className={"title_entry"} label_text={"Title"} onChange={setBlogTitle} defaultValue={blogTitle} />
                    {isPostingBlog ?
                        <button className='btn_aqua publish_btn'>
                            <SendSolid />
                            {blogId ? "Save" : "Publish"}
                            <LoadingCircle width={25} height={25} />
                        </button>
                        :
                        <button className='btn_aqua publish_btn' onClick={onPublishBlog}>
                            <SendSolid />
                            {blogId ? "Save" : "Publish"}
                        </button>
                    }
                </div>
                <div className='editor_holder'>
                    <CustomTiptapEditor default_text={"Hello There!"} onChange={onEditorUpdate} />
                </div>
            </div>
        </div>
    )
}
