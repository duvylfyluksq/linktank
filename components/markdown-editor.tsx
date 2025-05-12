"use client";

import React, { useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import type SimpleMDE from "easymde";
import "easymde/dist/easymde.min.css";

import MarkdownIt from "markdown-it";
import markdownItTaskLists from "markdown-it-task-lists"; // only if you installed it

const SimpleMdeReact = dynamic(
  () => import("react-simplemde-editor").then((mod) => mod.default),
  { ssr: false }
);

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({
  value,
  onChange,
}: MarkdownEditorProps) {
  const mdParser = useMemo(() => {
    const md = new MarkdownIt({
      html:        true,   
      linkify:     true,   
      typographer: true,   
      breaks:      true,   
    });
    md.use(markdownItTaskLists, { label: true, labelAfter: true });
    return md;
  }, []);

  const options = useMemo<SimpleMDE.Options>(
    () => ({
      autofocus:    true,
      spellChecker: false,
      placeholder:  "Description here",
      toolbar : [
        "bold",
        "italic",
        "strikethrough",
        "|",
        "heading-1",
        "heading-2",
        "heading-3",
        "|",
        "code",
        "quote",
        "|",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "image",
        "horizontal-rule",
        "|",
        "preview"
      ],
      previewRender: (plainText: string) => {
        const rendered = mdParser.render(plainText);
        return `<div class="prose max-w-none p-4">${rendered}</div>`;
      },
    }),
    [mdParser]
  );

  const changeHandler = useCallback(
    (v: string) => onChange(v),
    [onChange]
  );

  return (
    <div className="w-full lg:max-w-2xl lg:mx-auto">
      <SimpleMdeReact
        value={value}
        onChange={changeHandler}
        options={options}
      />
    </div>
  );
}
