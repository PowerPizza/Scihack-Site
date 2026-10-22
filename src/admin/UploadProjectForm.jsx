import React, { Component } from 'react'
import './uploadProjectForm.css'
import ModernEntry from '../contact_us/ModernEntry'
import { ArrowLeftCircle, CheckCircle, FastArrowLeft, FastArrowRight, Upload, UploadSquare, Xmark, XmarkCircle } from 'iconoir-react';
import LoadingCircle from '../loading_circle/LoadingCircle';
import CustomSelect from '../custom_select/CustomSelect';

/*
PROJECT METADATA LAYOUT
project_metadata = {
    "thumbnail_id": "sdadsadadw",
    "title": "P1",
    "desc": "DESCRIPTION HERE...",
    "images": [link1, link2, link3],
    "videos": "[link1, link2, link3],
    "links": [{text: "download", link: "github.com"}]
    "likes": 0,
    "dislikes": 0
}
*/

const default_state = {
    thumbnail: null, thumbnail_url: "", title: null, category: null, existing_categories: [], desc: null, images: [], images_urls: [],
    videos: [], videos_urls: [], links: [], link_text_val: "", link_url_val: "", uploaded_status: 0,
    total_media_to_upload: 0, uploaded_media: 0, running_interval: null
}

export default class UploadProjectForm extends Component {
    constructor() {
        super();
        this.state = JSON.parse(JSON.stringify(default_state));
    }

    putThumbnail = () => {
        let ele = document.createElement("input");
        ele.type = "file";
        ele.accept = "image/jpeg, image/png, image/gif, image/bmp, image/webp"
        ele.onchange = () => {
            this.setState({ thumbnail: ele.files[0], thumbnail_url: URL.createObjectURL(ele.files[0]) });
        }
        ele.click();
    }

    putTitle = (text) => {
        this.setState({ title: text })
    }

    putCategory = (val_)=>{
        this.setState({category: val_});
    }

    putDescription = (ele) => {
        this.setState({ desc: ele.target.value })
    }

    putImages = () => {
        let ele = document.createElement("input");
        ele.type = "file";
        ele.multiple = true;
        ele.accept = "image/jpeg, image/png, image/gif, image/bmp, image/webp"
        ele.onchange = () => {
            if (this.state.images.length + ele.files.length > 7) {
                this.props.createMessageBox(`Only 7 images are allowed per project. However, ${this.state.images.length + ele.files.length} images have been provided. The first 7 images will be used.`, "warning")
            }
            if (this.state.images.length < 7) {
                let imgs = [...this.state.images];
                imgs.push(...Object.values(ele.files).slice(0, Math.abs(this.state.images.length - 7)))
                this.setState({ images: imgs, images_urls: imgs.map((itm) => { return URL.createObjectURL(itm) }) });
            }
        }
        ele.click();
    }
    removeImages = (idx) => {
        let imgs = [...this.state.images];
        imgs.splice(idx, 1);
        this.setState({ images: imgs, images_urls: imgs.map((itm) => { return URL.createObjectURL(itm) }) });
    }

    putVideos = () => {
        let ele = document.createElement("input");
        ele.type = "file";
        ele.multiple = true;
        ele.accept = "video/mp4, video/webm, video/ogg, video/avi, video/mkv"
        ele.onchange = () => {
            if (this.state.videos.length + ele.files.length > 3) {
                this.props.createMessageBox(`Only 3 video clips are allowed per project. However, ${this.state.videos.length + ele.files.length} clips have been provided. The first 3 clips will be used.`, "warning")
            }
            if (this.state.videos.length < 3) {
                let vdos = [...this.state.videos];
                vdos.push(...Object.values(ele.files).slice(0, Math.abs(this.state.videos.length - 3)))
                this.setState({ videos: vdos, videos_urls: vdos.map((itm) => { return URL.createObjectURL(itm) }) });
            }
        }
        ele.click();
    }
    removeVideos = (idx) => {
        let vdos = [...this.state.videos];
        vdos.splice(idx, 1);
        this.setState({ videos: vdos, videos_urls: vdos.map((itm) => { return URL.createObjectURL(itm) }) });
    }

    on_change_link_text = (text) => {
        this.setState({ link_text_val: text });
    }
    on_change_link_url = (url_) => {
        this.setState({ link_url_val: url_ });
    }
    putLinks = () => {
        let lnks = [...this.state.links]
        lnks.push({ text: this.state.link_text_val, link: this.state.link_url_val });
        this.setState({ links: lnks });
    }
    removeLinks = (idx) => {
        let lnks = [...this.state.links];
        lnks.splice(idx, 1);
        this.setState({ links: lnks });
    }

    upload_project = async () => {
        this.setState({ total_media_to_upload: 1 + this.state.images.length + this.state.videos.length, uploaded_status: 1 });
        let image_files_ids = []; // AS PER THE GOOGLE DRIVE | GIVEN BE SERVER
        let video_files_ids = []; // AS PER THE GOOGLE DRIVE | GIVEN BY SERVER
        let thumbnail_id = "";
        // Uploading thumbnail
        let http_resp1 = await fetch("/upload_to_drive", { method: "POST", body: this.state.thumbnail });
        http_resp1 = JSON.parse(await http_resp1.text());
        if (http_resp1["status"] === "success") {
            this.setState({ uploaded_media: this.state.uploaded_media + 1, uploaded_status: 2 });
            thumbnail_id = http_resp1["file_id"];
        }
        else {
            this.props.createMessageBox(`Upload cancled : Failed to upload thumbnail\nError : ${http_resp1["error"]}`, "error")
            this.setState({uploaded_status: -1});
            return;
        }

        this.state.images.forEach(async (file_) => {
            let http_resp1 = await fetch("/upload_to_drive", { method: "POST", body: file_ });
            http_resp1 = JSON.parse(await http_resp1.text());
            if (http_resp1["status"] === "success") {
                this.setState({ uploaded_media: this.state.uploaded_media + 1 });
                image_files_ids.push(http_resp1["file_id"]);
            }
            else {
                this.props.createMessageBox(`Failed to upload image : '${file_["name"]}'\nError : ${http_resp1["error"]}`, "error");
            }
        });

        this.state.videos.forEach(async (file_) => {
            let http_resp1 = await fetch("/upload_to_drive", { method: "POST", body: file_ });
            http_resp1 = JSON.parse(await http_resp1.text());
            if (http_resp1["status"] === "success") {
                this.setState({ uploaded_media: this.state.uploaded_media + 1 });
                video_files_ids.push(http_resp1["file_id"]);
            }
            else {
                this.props.createMessageBox(`Failed to upload video : '${file_["name"]}'\nError : ${http_resp1["error"]}`, "error");
            }
        });

        const final_upload = () => {
            setTimeout(async () => {
                if (this.state.uploaded_media === this.state.total_media_to_upload) {
                    this.setState({ uploaded_status: 3 });
                    let textual_data = {
                        "thumbnail_id": thumbnail_id,
                        title: this.state.title,
                        category: this.state.category,
                        desc: this.state.desc,
                        images: image_files_ids,
                        videos: video_files_ids,
                        links: this.state.links,
                        likes: 0,
                        dislikes: 0
                    }
                    let http_resp = await fetch("/upload_textual_data", { method: "POST", body: JSON.stringify(textual_data) });
                    http_resp = JSON.parse(await http_resp.text());
                    if (http_resp["status"] === "success") {
                        this.setState({ uploaded_status: 4 });
                    }
                    else {
                        this.props.createMessageBox("Failed to add project entry.", "errro");
                        this.setState({uploaded_status: -1});
                    }
                    return;
                }
                final_upload();
            }, 1000);
        }
        final_upload();
    }

    onRefresh = () => {
        this.setState(JSON.parse(JSON.stringify(default_state)));
    }

    onOkay = () => {
        this.setState({uploaded_status: 0});
    }

    onCloseThisWindow = ()=>{
        this.props.createYesNoPrompt("Form filled on this page will be cleared, do you agree?", ()=>{
            this.props.closeShowingWin();
            this.props.closeYesNoPrompt();
        }, this.props.closeYesNoPrompt);
    }

    getCategories = async()=>{
        let http_resp = await fetch("/get_project_categories", {method: 'POST'});
        http_resp = JSON.parse(await http_resp.text());
        this.setState({existing_categories: http_resp["categories"]});
    }

    componentDidMount(){
        this.setState({title: localStorage.getItem("title") ?? this.state.title});
        this.setState({desc: localStorage.getItem("desc") ?? this.state.desc});
        if (localStorage.getItem("links")){
            this.setState({links: JSON.parse(localStorage.getItem("links"))["links"]});
        }
        const backup_state = ()=>{
            localStorage.setItem("title", this.state.title);
            localStorage.setItem("desc", this.state.desc);
            localStorage.setItem("links", JSON.stringify({links: this.state.links}));
        }
        this.setState({running_interval: setInterval(backup_state, 10000)});
        this.getCategories();
    }

    componentWillUnmount(){
        clearInterval(this.state.running_interval);
        localStorage.clear();
    }

    render() {
        let {device_width} = this.props;

        return (
            <div className='upload_project_body'>
                <div className='opt_page_header'>
                    <FastArrowLeft width={35} height={35} color='cyan' className='back_icon' onClick={this.onCloseThisWindow} />
                    <h1>Upload Project</h1>
                </div>
                <div className='portion1' style={device_width < 700 ? {display: "flex", flexDirection: "column", gap: "10px"} : {}}>
                    <div className='thumbnail' onClick={this.putThumbnail} style={{ backgroundImage: `url('${this.state.thumbnail_url}')` }}>
                        {this.state.thumbnail ? null :
                            <>
                                <UploadSquare width={60} height={60} color='cyan' />
                                <span style={{ fontSize: "1.2rem" }}>Upload project thumbnail</span>
                            </>
                        }
                    </div>
                    <div className='title_entry'>
                        <ModernEntry className="title_input" label_text="Title" onChange={this.putTitle} defaultValue={this.state.title} />
                        <CustomSelect className="category_select" options={this.state.existing_categories} onChange={this.putCategory}/>
                    </div>
                    <textarea placeholder='desc' className="desc_entry" defaultValue={this.state.desc} onChange={this.putDescription}></textarea>
                </div>

                <span className="lbl_more_imgs">Project Images</span>
                <div className="more_images">
                    <div className='more_images_holder'>
                        {this.state.images.map((_, idx) => {
                            return (
                                <div className='proj_img_view' style={{ backgroundImage: `url('${this.state.images_urls[idx]}')` }} key={`${idx}`}>
                                    <Xmark width={30} height={30} color='red' strokeWidth={2} onClick={() => { this.removeImages(idx) }} className='close_proj_img' />
                                </div>
                            )
                        })}
                        <div className='btn_add_images' onClick={this.putImages}>
                            <Upload width={40} height={40} style={{ backgroundColor: "black", borderRadius: "50px", padding: "5px" }} />
                            <span style={{ margin: "5px", textAlign: "center" }}>Please upload the necessary images related to your project.</span>
                        </div>
                    </div>
                </div>

                <span className="lbl_more_vdos">Project Videos</span>
                <div className="more_videos">
                    <div className='more_videos_holder'>
                        {this.state.videos.map((_, idx) => {
                            return (
                                <div className='proj_vdo_view' key={`${idx}`}>
                                    <Xmark width={30} height={30} color='red' strokeWidth={2} onClick={() => { this.removeVideos(idx) }} className='close_proj_vdo' />
                                    <video src={this.state.videos_urls[idx]} controls></video>
                                </div>
                            )
                        })}
                        <div className='btn_add_videos' onClick={this.putVideos}>
                            <Upload width={40} height={40} style={{ backgroundColor: "black", borderRadius: "50px", padding: "5px" }} />
                            <span style={{ margin: "5px", textAlign: "center" }}>Please upload the necessary clips/videos related to your project.</span>
                        </div>
                    </div>
                </div>

                <span className="lbl_more_links">Project Links</span>
                <div className='add_links'>
                    <div className='link_entries'>
                        <div className='link_text'>
                            <ModernEntry label_text="Link Text" onChange={this.on_change_link_text} />
                        </div>
                        <div className='link_address'>
                            <ModernEntry label_text="Link Address" onChange={this.on_change_link_url} />
                        </div>
                        <button className='add_link_btn' onClick={this.putLinks} >Add</button>
                    </div>
                    <div className='link_list'>
                        {this.state.links.map((link_, idx) => {
                            return (<div className='link_view' key={`${idx}_link_item`}>
                                <span className='link_text'>{link_["text"]}</span>
                                <a href={link_["link"]} className='link_url'>{link_["link"]}</a>
                                <div style={{ width: "30px", height: "30px", marginLeft: "auto"}}>
                                    <Xmark width={30} height={30} color='red' className='delete_link' onClick={() => { this.removeLinks(idx) }} />
                                </div>
                            </div>)
                        })}
                    </div>
                </div>

                {this.state.uploaded_status >= 1 ?
                    <div className='uploading_status'>
                        {4 > this.state.uploaded_status >= 1 ?
                            <>
                                <div style={{ display: 'flex', gap: "5px", alignItems: "center" }}>
                                    <FastArrowRight width={30} height={30} strokeWidth={2} />
                                    <span className='uploading_text'>Uploading</span>
                                </div>

                                <div className='uploading_media'>
                                    <div className='uploading_media_h'>
                                        {4 > this.state.uploaded_status >= 3 ?
                                            <CheckCircle width={40} height={40} color='lime' />
                                            :
                                            <LoadingCircle width={40} height={40} />
                                        }
                                        <span style={{ fontSize: "1.3rem" }}>Uploading Media Files</span>
                                    </div>
                                    {4 > this.state.uploaded_status >= 2 ?
                                        <span className='remaining_uploads'>Thumbnail Uploaded ✔</span>
                                        : null}
                                    <span className='remaining_uploads'>Remaining {this.state.uploaded_media}/{this.state.total_media_to_upload}</span>
                                </div>
                            </>
                            :
                            null
                        }

                        {4 > this.state.uploaded_status >= 3 ?
                            <div className='updating_db'>
                                {this.state.uploaded_status >= 4 ?
                                    <CheckCircle width={40} height={40} color='lime' />
                                    :
                                    <LoadingCircle width={40} height={40} />
                                }
                                <span style={{ fontSize: "1.3rem" }}>Updating Database</span>
                            </div>
                            : null}

                        {this.state.uploaded_status === 4 ?
                            <>
                                <div style={{ display: "flex", alignItems: 'center', gap: "20px", margin: "auto" }}>
                                    <CheckCircle width={40} height={40} color='lime' />
                                    <span style={{ fontSize: "1.4rem" }} >Uploading Done</span>
                                </div>
                                <button className='upload_proj_btn' onClick={this.onRefresh} >Refresh</button>
                            </>
                            : null}

                        {this.state.uploaded_status  === 502?
                            <>
                                <div style={{ display: "flex", alignItems: 'center', gap: "20px", margin: "auto" }}>
                                    <XmarkCircle width={40} height={40} color='red' />
                                    <span style={{ fontSize: "1.4rem" }} >Uploading Failed !</span>
                                </div>
                                <button className='upload_proj_btn' onClick={this.onOkay} >Okay</button>
                            </>
                            : null}
                    </div>
                    :
                    <button onClick={this.upload_project} className='upload_proj_btn'>UPLOAD</button>
                }
            </div>
        )
    }
}
