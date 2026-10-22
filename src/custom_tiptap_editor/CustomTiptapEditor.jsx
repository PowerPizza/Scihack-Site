import React, { useEffect, useRef, useState } from 'react'
import './customTiptapEditor.css'
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, ArrowLeftCircle, ArrowRightCircle, Bold, CodeBrackets, Code as CodeIcon, FontQuestion, Italic, Link, Strikethrough, TextSize, TextSquare, TextSquareSolid, Underline, XmarkCircle } from 'iconoir-react'
import ModernEntry from '../contact_us/ModernEntry';
import { useEditor, EditorContent, useEditorState } from '@tiptap/react'
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { BackgroundColor, Color, FontFamily, FontSize, TextStyle } from '@tiptap/extension-text-style'
import TextSizePlus from '../icons/test-size-plus.svg'
import TextSizeMinus from '../icons/text-size-minus.svg'
import { CustomCode, CustomCodeBlock, CustomLink } from './CustomExtansions';


function CustomDropDown({ innerContent, option_list, onChange, style, defaultValue }) {
    // props.options_list = [{"name": "name to show", "value": "the value of option", disabled: false/true, style: {color: red}}]
    return (
        <div className='custom_dropdown' style={style ?? {}}>
            <select className='custom_select' onInput={onChange} defaultValue={defaultValue}>
                {option_list ?
                    option_list.map((opt_ele, idx) => {
                        return <option key={"sh_site_opt+" + idx} value={opt_ele["value"]} disabled={opt_ele["disabled" ?? false]} style={opt_ele["style"] ?? {}}>{opt_ele["name"]}</option>
                    }) :
                    null}
            </select>
            <div className='visible_data'>
                {innerContent}
            </div>
        </div>
    )
}

function LinkPrompt({ onOk, onCancle }) {
    // CONTINUE MAKING LINK PROMPT THEN FIT IT IN LINK'S FUNCTNION.
    const [link_url, set_link_url] = useState("");

    return (
        <div className='lp_all_black'>
            <div className='link_prompt'>
                <ModernEntry label_text="Link address" className="link_entry" onChange={set_link_url} />
                <div className='opt_container'>
                    <button className='btn_aqua link_opt' onClick={() => { onOk(link_url) }}>Ok</button>
                    <button className='btn_aqua link_opt' onClick={onCancle}>Cancle</button>
                </div>
            </div>
        </div>
    )
}


function MoreFontsWindow(props) {
    const fontCardPerPage = 50;

    const [fontFamilies, setFontFamilies] = useState([]);
    const [loadFrom, setLoadFrom] = useState(0);
    const [loadTo, setLoadTo] = useState(fontCardPerPage);
    const [fontCardElements, setFontCardElements] = useState([]);
    const curHeadElement = useRef(null);
    const curSelectedFont = useRef("");
    const [selectedFont, setSelectedFont] = useState(null);

    const onNextPage = () => {
        if (loadTo + fontCardPerPage > fontFamilies.length) {
            return;
        }
        setLoadFrom(loadTo);
        setLoadTo(loadTo + fontCardPerPage);
    }

    const onPreviousPage = () => {
        if (loadFrom - fontCardPerPage < 0) {
            return;
        }
        setLoadFrom(loadFrom - fontCardPerPage);
        setLoadTo(loadTo - fontCardPerPage);
    }

    const onFontSelect = (family_name)=>{
        curSelectedFont.current = family_name;
        setSelectedFont(family_name);
    }

    const onCloseWin = () => {
        if (curHeadElement.current) {
            curHeadElement.current.remove();
        }
        props.setMoreFontWindow(null);
    }

    useEffect(() => {
        if (!selectedFont) {
            return;
        }
        props.onSelectFontFamily(curSelectedFont.current);
        if (curHeadElement.current) {
            curHeadElement.current.remove();
        }
        props.setMoreFontWindow(null);
    }, [selectedFont, props]);

    useEffect(() => {
        let url_ = "https://fonts.googleapis.com/css?family=";
        fontFamilies.slice(loadFrom, loadTo).forEach(family_name => {
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
        setFontCardElements(fontFamilies.slice(loadFrom, loadTo).map((family_name, idx) => {
            return <div className='font_card' style={{ fontFamily: family_name }} key={"family_ele_+" + idx} onClick={() => { onFontSelect(family_name) }}>{family_name}</div>
        }))
    }, [loadFrom, loadTo, fontFamilies])

    useEffect(() => {
        const get_fonts = async () => {
            let http_resp = await fetch("/get_font_families", { method: "POST" });
            http_resp = JSON.parse(await http_resp.text());
            setFontFamilies(http_resp["families"]);
        };
        get_fonts();
    }, []);

    return (
        <div className='more_fonts_area'>
            <div className='more_fonts_content'>
                <div className='more_font_header'>
                    <h2 className='win_name'>More Fonts</h2>
                    <XmarkCircle color='gray' className='close_win' width={30} height={30} onClick={onCloseWin} />
                </div>
                <div className='page_controls'>
                    <ArrowLeftCircle color='cyan' width={35} height={35} className='page_left' onClick={onPreviousPage} />
                    <span className='cur_page'>{Math.floor(loadTo / fontCardPerPage)}/{Math.floor(fontFamilies.length / fontCardPerPage)}</span>
                    <ArrowRightCircle color='cyan' width={35} height={35} className='page_right' onClick={onNextPage} />
                </div>
                <div className='font_card_holder'>
                    {fontCardElements}
                </div>
            </div>
        </div>
    )
}

function BlogEditorMenu(props) {
    // props.onChange of this function passes current editor object to the given callback function whenever there is a change in editor state.
    const editor_ = props.editor;

    const editor_state = useEditorState({
        editor: editor_, selector: ({ editor }) => {
            if (!editor) return;

            props.onChange(editor);

            return {
                isBold: editor.isActive('bold') ?? false,
                isItalic: editor.isActive('italic') ?? false,
                isUnderline: editor.isActive('underline') ?? false,
                isStrike: editor.isActive('strike') ?? false,
                isCodeBlock: editor.isActive('codeBlock') ?? false,
                isCode: editor.isActive('code') ?? false,
                isLeftAlign: editor.isActive({ textAlign: "left" }) ?? false,
                isCenterAlign: editor.isActive({ textAlign: "center" }) ?? false,
                isRightAlign: editor.isActive({ textAlign: "right" }) ?? false,
                isJustifyAlign: editor.isActive({ textAlign: "justify" }) ?? false,
                currentFontSize: Number(editor.getAttributes("textStyle").fontSize?.replace("px", "")) || Number(window.getComputedStyle(editor.view.domAtPos(editor.state.selection.from).node.parentElement).fontSize?.replace("px", "")),
                currentColor: editor.getAttributes("textStyle").color || window.getComputedStyle(editor.view.domAtPos(editor.state.selection.from).node.parentElement).color,
                currentBackgroundColor: editor.getAttributes("textStyle").backgroundColor || window.getComputedStyle(editor.view.domAtPos(editor.state.selection.from).node.parentElement).backgroundColor,
                isLink: editor.isActive("link")
            }
        }
    })

    const font_sizes = [{ "name": "---------", "value": "dash_only" }, { "name": "H1", "value": "1" }, { "name": "H2", "value": "2" }, { "name": "H3", "value": "3" }, { "name": "H4", "value": "4" }, { "name": "H5", "value": "5" }, { "name": "H6", "value": "6" }];
    const defaultFontFamilies = [
        { "name": "---------", "value": "dash_only" },
        { "name": "Get more fonts", "value": "getmore" },
        { "name": "Serif", "value": "serif", "style": { "fontFamily": "serif" } },
        { "name": "Sans-serif", "value": "sans-serif", "style": { "fontFamily": "sans-serif" } },
        { "name": "Monospace", "value": "monospace", "style": { "fontFamily": "monospace" } },
        { "name": "Cursive", "value": "cursive", "style": { "fontFamily": "cursive" } },
        { "name": "Fantasy", "value": "fantasy", "style": { "fontFamily": "fantasy" } },
        { "name": "System UI", "value": "system-ui", "style": { "fontFamily": "system-ui" } },
        { "name": "Arial", "value": "Arial", "style": { "fontFamily": "Arial" } },
        { "name": "Helvetica", "value": "Helvetica", "style": { "fontFamily": "Helvetica" } },
        { "name": "Verdana", "value": "Verdana", "style": { "fontFamily": "Verdana" } },
        { "name": "Tahoma", "value": "Tahoma", "style": { "fontFamily": "Tahoma" } },
        { "name": "Trebuchet MS", "value": "Trebuchet MS", "style": { "fontFamily": "Trebuchet MS" } },
        { "name": "Times New Roman", "value": "Times New Roman", "style": { "fontFamily": "Times New Roman" } },
        { "name": "Georgia", "value": "Georgia", "style": { "fontFamily": "Georgia" } },
        { "name": "Garamond", "value": "Garamond", "style": { "fontFamily": "Garamond" } },
        { "name": "Courier New", "value": "Courier New", "style": { "fontFamily": "Courier New" } },
        { "name": "Lucida Console", "value": "Lucida Console", "style": { "fontFamily": "Lucida Console" } },
        { "name": "Lucida Sans Unicode", "value": "Lucida Sans Unicode", "style": { "fontFamily": "Lucida Sans Unicode" } },
        { "name": "Segoe UI", "value": "Segoe UI", "style": { "fontFamily": "Segoe UI" } }
    ];

    const recentUsedFonts = props.fontFamiliesUsed ?
        props.fontFamiliesUsed.map((font_name) => {
            return { "name": font_name, "value": font_name, "style": { "fontFamily": font_name } }
        })
        : [];

    const on_google_font_select = (font_name) => {
        props.appendFontUsed(font_name);
        editor_.chain().focus().setFontFamily(font_name).run();
    }

    const on_font_select = (ele) => {
        if (ele.target.value === "getmore") {
            props.setMoreFontWindow(<MoreFontsWindow setMoreFontWindow={props.setMoreFontWindow} onSelectFontFamily={on_google_font_select} />);
            ele.target.value = "dash_only"
        }
        editor_.chain().focus().setFontFamily(ele.target.value).run();
    }

    const on_text_size_change = (ele) => {
        editor_.chain().focus().toggleHeading({ level: Number(ele.target.value) }).run()
        // ele.target.value = "dash_only";
    }

    const on_change_font_size = (new_size) => {
        editor_.chain().focus().setFontSize(`${Math.floor(new_size)}px`).run();
    }

    const on_change_text_fg = (ele) => {
        editor_.chain().focus().setColor(ele.target.value).run()
    }

    const on_change_text_bg = (ele) => {
        editor_.chain().focus().setBackgroundColor(ele.target.value).run()
    }

    const on_add_link = () => {
        if (editor_state.isLink) {
            editor_.chain().focus().extendMarkRange("link").unsetLink().run()
            return;
        }
        function on_ok(url_) {
            editor_.chain().focus().extendMarkRange("link").setLink({ href: url_ }).run()
            props.set_link_prompt(null);
        }
        props.set_link_prompt(<LinkPrompt onOk={on_ok} onCancle={() => { props.set_link_prompt(null) }} />)
    }

    useEffect(() => {
        document.getElementById("options-font_size_input").value = editor_state.currentFontSize;
    }, [editor_state.currentFontSize])

    return (
        <div className='editor_menu'>
            <CustomDropDown innerContent={<TextSize width={25} height={25} color='cyan' />} option_list={font_sizes} style={{ width: "40px" }} onChange={on_text_size_change} />

            <CustomDropDown innerContent={<FontQuestion width={25} height={25} color='cyan' />} option_list={[...defaultFontFamilies.slice(0, 2), ...recentUsedFonts, { "name": "----------", "value": "line", "disabled": true }, ...defaultFontFamilies.slice(2)]} style={{ width: "40px" }} onChange={on_font_select} />

            <div className='options font_size'>
                <input id='options-font_size_input' type="number" min={2} style={{ width: "40px" }} defaultValue={editor_state.currentFontSize} onBlur={(ele) => { on_change_font_size(ele.target.value) }} onKeyDown={(eve) => { if (eve.key === "Enter") on_change_font_size(eve.target.value) }} />
                <img src={TextSizePlus} alt="TextSizePlus" onClick={() => { on_change_font_size(editor_state.currentFontSize + 1) }} />
                <img src={TextSizeMinus} alt="TextSizeMinus" onClick={() => { on_change_font_size(editor_state.currentFontSize - 1) }} />
            </div>

            <span className='saperator'></span>

            <button className={`options ${editor_state.isBold ? "active" : ""}`} onClick={() => { editor_.chain().focus().toggleBold().run() }}>
                <Bold color='cyan' width={25} height={25} />
            </button>

            <button className={`options ${editor_state.isItalic ? "active" : ""}`} onClick={() => { editor_.chain().focus().toggleItalic().run() }}>
                <Italic color='cyan' width={25} height={25} />
            </button>

            <button className={`options ${editor_state.isUnderline ? "active" : ""}`} onClick={() => { editor_.chain().focus().toggleUnderline().run() }}>
                <Underline color='cyan' width={25} height={25} />
            </button>

            <button className={`options ${editor_state.isStrike ? "active" : ""}`} onClick={() => { editor_.chain().focus().toggleStrike().run() }}>
                <Strikethrough color='cyan' width={25} height={25} />
            </button>

            <button className={`options ${editor_state.isCodeBlock ? "active" : ""}`} onClick={() => { editor_.chain().focus().toggleCodeBlock().run() }}>
                <CodeIcon color='cyan' width={25} height={25} />
            </button>

            <button className={`options ${editor_state.isCode ? "active" : ""}`} onClick={() => { editor_.chain().focus().toggleCode().run() }}>
                <CodeBrackets color='cyan' width={25} height={25} />
            </button>

            <button className={`options text_fg`}>
                <TextSquare color={editor_state.currentColor} width={25} height={25} />
                <input type="color" onChange={on_change_text_fg} />
            </button>

            <button className={`options text_bg`}>
                <TextSquareSolid color={editor_state.currentBackgroundColor === "rgba(0, 0, 0, 0)" ? "#00090d" : editor_state.currentBackgroundColor} width={25} height={25} style={{ backgroundColor: "cyan" }} />
                <input type="color" onChange={on_change_text_bg} />
            </button>

            <span className='saperator'></span>

            <button className={`options ${editor_state.isLeftAlign ? "active" : ""}`} onClick={() => { editor_.chain().focus().setTextAlign("left").run() }}>
                <AlignLeft color='cyan' width={25} height={25} />
            </button>

            <button className={`options ${editor_state.isCenterAlign ? "active" : ""}`} onClick={() => { editor_.chain().focus().setTextAlign("center").run() }}>
                <AlignCenter color='cyan' width={25} height={25} />
            </button>

            <button className={`options ${editor_state.isRightAlign ? "active" : ""}`} onClick={() => { editor_.chain().focus().setTextAlign("right").run() }}>
                <AlignRight color='cyan' width={25} height={25} />
            </button>

            <button className={`options ${editor_state.isJustifyAlign ? "active" : ""}`} onClick={() => { editor_.chain().focus().setTextAlign("justify").run() }}>
                <AlignJustify color='cyan' width={25} height={25} />
            </button>

            <span className='saperator'></span>

            <button className={`options ${editor_state.isLink ? "active" : ""}`} onClick={on_add_link}>
                <Link color='cyan' width={25} height={25} />
            </button>
        </div>
    )
}

export default function CustomBlogEditor({default_text, onChange}) {
    // onChange must be a function which takes two arguments : editor and font_families_used
    const [moreFontWindow, setMoreFontWindow] = useState(null);
    const [fontFamiliesUsed, setFontFamiliesUsed] = useState([]);
    const [link_prompt, setLinkPrompt] = useState(null);

    const curHeadElement = useRef(null);

    const font_families_used_ref = useRef([]);

    useEffect(() => {
            font_families_used_ref.current = fontFamiliesUsed;
    }, [fontFamiliesUsed]);

    const editor_ = useEditor({
        extensions: [
            StarterKit.configure({
                code: false,
                codeBlock: false,
                link: false
            }),
            TextAlign.configure({ types: ['heading', 'paragraph', 'span'] }),
            FontFamily,
            TextStyle,
            FontSize,
            Color,
            BackgroundColor,
            CustomCode,
            CustomCodeBlock,
            CustomLink.configure({
                openOnClick: false,
            })
        ],
        content: default_text ?? ""
    });
    // editor_.chain().focus().toggle
    
    const appendFontUsed = (new_family) => {
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
    }

    const _onChange = (editor)=>{
        onChange(editor, fontFamiliesUsed);
    }

    return (
        <div className='tiptap_editor_body'>
            {moreFontWindow}
            {link_prompt}
            <BlogEditorMenu editor={editor_} setMoreFontWindow={setMoreFontWindow} appendFontUsed={appendFontUsed} fontFamiliesUsed={fontFamiliesUsed} set_link_prompt={setLinkPrompt} onChange={_onChange} />
            <EditorContent editor={editor_} className='editor' />
        </div>
    )
}