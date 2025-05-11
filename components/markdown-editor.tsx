"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import type SimpleMDE from "easymde";

const SimpleMdeReact = dynamic(
  () => import("react-simplemde-editor").then((mod) => mod.default),
  { ssr: false }
);

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
}: MarkdownEditorProps) {
  const [cmInstance, setCmInstance] = useState<any>(null);
  const [isFocused, setIsFocused] = useState(false);

  const options = useMemo<SimpleMDE.Options>(
    () => ({
      autofocus: true,
      spellChecker: false,
      placeholder: placeholder,
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "code",
        "unordered-list",
        "ordered-list",
        "|",
        "preview",
      ],
    }),
    []
  );

  useEffect(() => {
    if (isFocused && cmInstance) {
      cmInstance.focus();
    }
  }, [value, isFocused, cmInstance]);

  const getCodemirrorInstance = useCallback((cm: any) => {
    setCmInstance(cm);
    cm.focus();
  }, []);

  const changeHandler = useCallback((v: string) => {
    onChange(v);
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <SimpleMdeReact
        value={value}
        onChange={changeHandler}
        options={options}
        getCodemirrorInstance={getCodemirrorInstance}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}
