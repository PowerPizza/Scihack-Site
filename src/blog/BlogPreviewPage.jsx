import { useEffect, useRef, useState } from 'react'
import './blogPreviewPage.css'
import { Check, PageLeft, ShareAndroidSolid } from 'iconoir-react'
import LoadingCircle from '../loading_circle/LoadingCircle';
import { Link } from 'react-router-dom';
import apiClient from '../api/api-client';

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
      const blog_resp = await apiClient.getFullBlogById(blog_id.current);
      setLoadingBarProgress.current(70);
      if (blog_resp.status === "OK") {
        delete blog_resp.status;
        blog_resp.additional_fonts = blog_resp.additional_fonts.split(',').filter(f => f?.trim()?.length);
        setBlogData(blog_resp);

        if (blog_resp.additional_fonts.length) {
          let url_ = "https://fonts.googleapis.com/css?family=";
          blog_resp.additional_fonts.forEach(family_name => {
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
        setBlogError(blog_resp.error);
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
