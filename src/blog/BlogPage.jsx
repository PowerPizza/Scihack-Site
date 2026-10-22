import React, { useCallback, useEffect, useRef, useState } from 'react'
import "./blogPage.css"
import BlogCard from './BlogCard'
import LoadingCircle from '../loading_circle/LoadingCircle';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function BlogPage(props) {
  const post_per_page = 10;
  const [blogsToShow, setBlogsToShow] = useState([]);
  const blogsToShowRef = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastPage, setLastPage] = useState(0);
  const [isDataFinished, setIsDataFinished] = useState(false);
  const setLoadingBarProgress = useRef(null);
  
  const onBlogInteracted = async (interaction, data)=>{
    let data_to_send = ["like", "dislike"].includes(interaction) ? {"action": interaction} : {"comment": data}; 
    console.log(props.loginCreds);
    // let http_resp = await fetch("/post_interactions", {method: "POST", body: JSON.stringify(data_to_send), headers: {"Content-Type": "application/json"}});
    // console.log(await http_resp.text())
  }

  const fetchNext = useCallback(async ()=>{
    const req_param = {from: post_per_page*lastPage, to: (post_per_page*lastPage)+post_per_page};
    let http_resp = await fetch(`/get_blog_posts?${(new URLSearchParams(req_param)).toString()}`, {method: "GET"});  // to: lastPage*(post_per_page+1) is fine.
    http_resp = await http_resp.json();
    const new_posts = http_resp["posts"].map((ele_, idx_)=>{
      return <BlogCard title={ele_["title"]} publish_date={ele_["publish_date"]} content={ele_["description"].trim()} blog_id={ele_["_id"]} key={"blog_card_asa"+idx_} on_interact={(x)=>{console.log(x)}} />
    });
    return new_posts;
  }, [lastPage]);

  useEffect(()=>{
    blogsToShowRef.current = [...blogsToShowRef.current, ...blogsToShow];
  }, [blogsToShow]);

  useEffect(()=>{
    if (!setLoadingBarProgress.current) {
      setLoadingBarProgress.current = props.setLoadingBarProgress ?? null;
    }
  }, [props]);

  useEffect(()=>{
    document.getElementsByClassName("content_and_footer")[0].scrollTo(0, 0);
  }, []);


  useEffect(()=>{
    fetchNext().then((items) => {
      setBlogsToShow(items);
    });
  }, [fetchNext]);

  return (
    <div className='blog_page_body'>
        <div className='per_page_heading blog_heading_heading'>
          <span className='back'>Blog</span>
          <span className='front'>Blog</span>
        </div>
        <hr style={{width: "100%", border: "1px solid gray", opacity: "0.3"}}/>
          <div className='blog_content' id='blog-content'>
            {isLoading ? 
            <span style={{marginLeft: "auto", marginRight: "auto"}}>
              <LoadingCircle width={30} height={30} />
            </span>
            :
            blogsToShowRef.current
            }
          </div>
    </div>
  )
}
