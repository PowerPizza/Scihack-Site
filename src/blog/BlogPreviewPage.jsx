import React, { useEffect, useRef, useState } from 'react'
import './blogPreviewPage.css'
import { Check, PageLeft, ShareAndroidSolid } from 'iconoir-react'
import LoadingCircle from '../loading_circle/LoadingCircle';
import { Link } from 'react-router-dom';

export default function BlogPreviewPage(props) {
  const blog_id = useRef(new URLSearchParams(window.location.search).get("blog_id"));
  const [blogData, setBlogData] = useState(null);
  const [blogError, setBlogError] = useState(null);
  const [isCopyingLink, setIsCopyingLink] = useState(false);
  const setLoadingBarProgress = useRef(null);

  const on_click_share = () => {
    setIsCopyingLink(true);
    navigator.clipboard.writeText(`${window.location.host}/blog_preview?blog_id=${blog_id.current}`);
    setTimeout(() => {
      setIsCopyingLink(false);
    }, 3000);
  }

  useEffect(()=>{
    if (!setLoadingBarProgress.current) {
      setLoadingBarProgress.current = props.setLoadingBarProgress ?? null;
    }
  }, [props]);

  useEffect(() => {
    document.getElementsByClassName("content_and_footer")[0].scrollTo(0, 0);

    const get_blog = async () => {
      if (!blog_id.current) return;
      setLoadingBarProgress.current(30);
      let http_resp = await fetch("/get_blog_post", { method: "POST", body: JSON.stringify({ "blog_id": blog_id.current }) });
      http_resp = JSON.parse(await http_resp.text());
      setLoadingBarProgress.current(70);
      if (http_resp["status"] === "success") {
        setBlogData(http_resp["blog_data"]);
        if (http_resp["blog_data"]["additional_fonts"].length) {
          let url_ = "https://fonts.googleapis.com/css?family=";
          http_resp["blog_data"]["additional_fonts"].forEach(family_name => {
            url_ += family_name + "|"
          });

          let already_existing = document.getElementById("blog_preview_fonts_google");
          if (already_existing) {
            already_existing.remove();
          }
          let ele_ = document.createElement("link");
          ele_.id = "blog_preview_fonts_google"
          ele_.rel = "stylesheet";
          ele_.href = url_.substring(0, url_.length - 1);
          document.head.appendChild(ele_);
        }
      }
      else {
        setBlogError(http_resp);
      }
      setLoadingBarProgress.current(100);
    }
    get_blog();

    return () => {
      let already_existing = document.getElementById("blog_preview_fonts_google");
      if (already_existing) {
        already_existing.remove();
      }
    }
  }, []);

  return (
    <div className="blog_preview_body">
      <div className='header'>
        <Link to={"/blog"}>
          <PageLeft color='cyan' width={30} height={30} className='back_icon' />
        </Link>
      </div>

      <div className='blog_content'>
        {!blogData ?
          blogError ?
            <span className='blog_error_msg'>No blog found!</span>
            :
            <span style={{ marginLeft: "auto", marginRight: "auto" }}><LoadingCircle width={30} height={30} /></span>
          :
          <>
            <div className='content_header'>
              <h1 className='title'>{blogData["title"]}</h1>
              {isCopyingLink ?
                <Check width={25} height={25} className='share_icon'/>
                :
                <ShareAndroidSolid width={25} height={25} className='share_icon' onClick={on_click_share}  />
              }
            </div>
            <span className='publish_date'>{blogData["publish_date"]}</span>
            <div dangerouslySetInnerHTML={{ __html: blogData["html_content"] }}></div>
          </>
        }
      </div>
    </div>
  )
}
