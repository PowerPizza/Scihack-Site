import { useEffect, useRef, useState } from 'react'
import "./blogPage.css"
import BlogCard from './BlogCard'
import LoadingCircle from '../loading_circle/LoadingCircle';
import apiClient from '../api/api-client';
// import InfiniteScroll from 'react-infinite-scroll-component';
// TODO: Setup infinite scroll

export default function BlogPage(props) {
  const [blogsToShow, setBlogsToShow] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const setLoadingBarProgress = useRef(null);
  
  const fetchBlogsData = async (page_no)=>{
    const blogs_resp = await apiClient.getBlogs(page_no);
    if (blogs_resp.status !== 'OK') {
      // handle error
    }
    else {
      const new_posts = blogs_resp.blogs.map((blog)=>{
        return <BlogCard
                  title={blog.title}
                  publish_date={blog.publish_date}
                  content={blog.description.trim()}
                  blog_id={blog.id}
                  key={`${blog.id}-blog_card_asa`}
                  on_interact={(x)=>{console.log(x)}} />
      });
      return {renderables: new_posts, total_pages: blogs_resp.page.total};
    }
  };

  const onNextPage = () => {
    setIsLoading(true);
    fetchBlogsData(pageNo + 1).then(({renderables})=>{
      setBlogsToShow(prev => [...prev, ...renderables]);
      setIsLoading(false);
      setPageNo(prev => prev + 1);
    });
  }

  useEffect(()=>{
    if (!setLoadingBarProgress.current) {
      setLoadingBarProgress.current = props.setLoadingBarProgress ?? null;
    }
  }, [props]);

  useEffect(()=>{
    document.getElementsByClassName("content_and_footer")[0].scrollTo(0, 0);
  }, []);

  useEffect(()=>{
    fetchBlogsData(1).then(({renderables, total_pages}) => {
      setBlogsToShow(renderables);
      setIsLoading(false);
      setTotalPages(total_pages);
    });
  }, []);

  return (
    <div className='blog_page_body'>
        <div className='per_page_heading blog_heading_heading'>
          <span className='back'>Blog</span>
          <span className='front'>Blog</span>
        </div>
        <hr style={{width: "100%", border: "1px solid gray", opacity: "0.3"}}/>
        <div className='blog_content' id='blog-content'>
          {blogsToShow}
        </div>
        {isLoading ? 
          <span style={{marginLeft: "auto", marginRight: "auto"}}>
            <LoadingCircle width={30} height={30} />
          </span>
          :
          (totalPages !== pageNo) ? 
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span>({pageNo}/{totalPages})</span>
              <span className='load-more' onClick={onNextPage}>More...</span>
            </div>
            : null
        }
    </div>
  )
}
