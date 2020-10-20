import React, { useState, useRef } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-dracula";

import editorValue from "./editor";
import gameLevels from "./levels";

const Level = React.forwardRef(({ activeLevel }, ref) => {
  console.log(activeLevel);
  return (
    <div className="story">
      <p className="story">{activeLevel.text}!</p>

      <div key={activeLevel.imageID}>
        <img
          ref={ref}
          id={activeLevel.imageID}
          className="story-img"
          src={activeLevel.imageSource}
          alt={activeLevel.imageID}
        />
      </div>
      <br />
      <br />
      <p className="help-text">{activeLevel.helpText}</p>
      <button
        className={activeLevel.done ? null : "hide"}
        // onClick={handleLevelButton}
      >
        Next
      </button>
    </div>
  );
});

function App() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levels, setLevels] = useState(gameLevels);
  const imageRef = useRef();

  const markLevelComplete = (id) => {
    console.log("in markLevelComplete, level ID: " + id);
    const updatedLevels = levels.map((level) => {
      if (level.id === id) {
        level.done = true;
      }
      return level;
    });

    setLevels(updatedLevels);
  };

  const onChange = (newValue) => {
    try {
      const userInput = new Function(newValue);
      try {
        const item = imageRef.current;
        userInput();
        if (item.style.gridColumnStart && item.style.gridRowStart) {
          console.log("currentLevel in if changed block: " + currentLevel);
          markLevelComplete(currentLevel);
        }
      } catch (e) {}
    } catch (e) {}
  };

  const onLoad = (editor) => {
    editor.session.foldAll();
    editor.getSession().setUseWrapMode(true);
    editor.setOption("showLineNumbers", false);
  };

  const activeLevel = levels.filter((level) => level.id === currentLevel)[0];

  //TODO: add a ref to AceEditor, much like you did with VanillaTilt in Epic React
  //TODO: then, you can useEffect to prevent AceEditor from re-rendering (it shouldn't ever have to)
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
        <Level activeLevel={activeLevel} ref={imageRef} />

        <div className="inventory"></div>
      </div>
    </div>
  );
}

export default App;
