import React, { useState, useRef } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-dracula";

import editorValue from "./editor";
import levels from "./levels";

function App() {
  const imageRef = useRef();

  const onChange = (newValue) => {
    try {
      const userInput = new Function(newValue);
      try {
        const item = imageRef.current;
        userInput();
        if (item.style.gridColumnStart && item.style.gridRowStart) {
          console.log(item.style.gridColumnStart, item.style.gridRowStart);
        }
      } catch (e) {}
    } catch (e) {}
  };

  const onLoad = (editor) => {
    editor.session.foldAll();
    editor.getSession().setUseWrapMode(true);
    editor.setOption("showLineNumbers", false);
  };

  return (
    <div className="App">
      <div className="code-area">
        <AceEditor
          mode="javascript"
          theme="dracula"
          value={editorValue}
          onChange={onChange}
          onLoad={onLoad}
          name="UNIQUE_ID_OF_DIV"
          width="auto"
          height="100%"
          showPrintMargin={false}
          fontSize="12px"
          editorProps={{
            $blockScrolling: Infinity,
          }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
          }}
        />
        <div id="console" className="console"></div>
      </div>
      <div className="content">
        <div className="story">
          <p>You found a scroll!</p>
          <img
            ref={imageRef}
            id="scroll"
            src="https://via.placeholder.com/150?text=scroll-1"
            alt="scroll"
          />
        </div>
        <div className="inventory"></div>
      </div>
    </div>
  );
}

export default App;
