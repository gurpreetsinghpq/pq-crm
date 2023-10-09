// components/SelectableDiv.tsx
import React, { useRef, useEffect, useState } from 'react';

interface SelectableDivProps {
  text: string;
}

const SelectableDiv: React.FC<SelectableDivProps> = ({ text }) => {
  const divRef = useRef<HTMLDivElement | null>(null);

  const handleDivClick = () => {
    if (divRef.current) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(divRef.current);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };


  return (
    <span ref={divRef} onClick={handleDivClick}>
      {text}
    </span>
  );
};

export default SelectableDiv;
