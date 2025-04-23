import Quill from "quill";
import { useEffect, useState, useRef } from "react";

interface RendererProps {
  value: string;
}

const Renderer = ({ value }: RendererProps) => {
  const [isEmpty, setIsEmpty] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(!containerRef.current) return;

    const container = containerRef.current;

    const quill = new Quill(document.createElement("div"), {
      theme: "snow"
    })

    quill.enable(false);

    const contents = JSON.parse(value)
    quill.setContents(contents);

    const isEmpty = quill.getText().replace(/<(.|\n)*?>/g, "").trim().length === 0;
    setIsEmpty(isEmpty);

    container.innerHTML = quill.root.innerHTML;

    return () => {
      if(container){
        container.innerHTML = ""
      }
    }

  },[value]);

  if(isEmpty) return null;

  return (
    <div ref={containerRef} />
  )
}

export default Renderer;