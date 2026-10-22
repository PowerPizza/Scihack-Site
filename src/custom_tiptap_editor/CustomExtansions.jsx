import Code from "@tiptap/extension-code"
import CodeBlock from "@tiptap/extension-code-block"
import LinkExtension from "@tiptap/extension-link"

const CustomCode = Code.extend({
    renderHTML({ HTMLAttributes }) {
        return [
            "code",
            {
                ...HTMLAttributes,
                style: `
                    background-color: #02242b;
                    border-radius: 4px;
                    padding: 3px 6px 3px 6px;
                    font-family: 'Fira Code', monospace;
                `
            }
        ]
    }
});

const CustomCodeBlock = CodeBlock.extend({
    renderHTML({ HTMLAttributes }) {
        return [
            "pre",
            {
                ...HTMLAttributes,
                class: "scrollbar_hr_w3",
                style: `
                    background-color: #02191d;
                    border: 1px solid #00ffff33;
                    border-radius: 8px;
                    padding: 12px;
                    font-family: 'Fira Code', monospace;
                    height: fit-content;
                    overflow-x: auto;
                    white-space: pre;
                    overflow-wrap: normal;
                    `
            },
            ["code", { style: "background-color: none; pre::-webkit-scrollbar {height: 3px !important;}" }, 0]
        ]
    }
})

const CustomLink = LinkExtension.extend({
    renderHTML({ HTMLAttributes }) {
        return [
            "a",
            {
                ...HTMLAttributes,
                style: `color: #8d00eb;`
            }
        ]
    }
})

export { CustomCode, CustomCodeBlock, CustomLink }