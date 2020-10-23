import React, { useState, useRef, useEffect } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-dracula";

import "brace/ext/language_tools";
import "ace-builds/webpack-resolver";

import editorValue, { onLoad } from "./editor";
import gameLevels from "./levels";
import gameItems from "./items";

const Level = React.forwardRef(({ activeLevel, handleNextLevel }, ref) => {
  // console.log(activeLevel);
  //TODO: add an error boundary instead of checking if there is an activeLevel

  if (activeLevel) {
    return (
      <div className="story">
        <p>{activeLevel.text}!</p>

        <div key={activeLevel.imageID}>
          <img
            ref={ref}
            id={activeLevel.imageID}
            className="story-img"
            src={activeLevel.imageSource}
            alt={activeLevel.imageID}
            tabIndex="0"
          />
        </div>
        <br />
        <br />
        <p className="help-text">{activeLevel.helpText}</p>
        <button
          className={activeLevel.done ? null : "hide"}
          onClick={() => handleNextLevel(activeLevel)}
        >
          Next
        </button>
      </div>
    );
  } else {
    return <p>This is an error that needs to be handled properly</p>;
  }
});

function App() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levels, setLevels] = useState(gameLevels);
  const [items, setItems] = useState(gameItems);
  const [currentPosition, setCurrentPosition] = useState({ row: 0, col: 0 });
  const [value, setValue] = useState(editorValue);

  useEffect(() => {
    //TODO: Compare the items' row/col with all of the image elements from the front end
    //TODO: if any changes, call setItems in that method with the updated positions
    //! You'll also need to validate the position of each item
    //? if trying to move to a position that is already occupied,
    //* you need to return the item to the previous (valid) position (using a function that accepts prevState)
    console.log("in useEffect");
  }, [value]);

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

  const incrementLevel = () => {
    setCurrentLevel((prevLevel) => prevLevel + 1);
  };

  const onChange = (newValue) => {
    try {
      const userInput = new Function(newValue);
      try {
        let levelItem = imageRef.current;
        userInput();
        setValue(newValue);

        const userRow = levelItem.style.gridRowStart;
        const userCol = levelItem.style.gridColumnStart;

        const thisLevel = levels.filter(
          (level) => level.id === currentLevel
        )[0];

        if (
          userCol &&
          userRow &&
          (userCol !== currentPosition.col || userRow !== currentPosition.row)
        ) {
          if (!thisLevel.done) markLevelComplete(currentLevel);

          setItems({
            ...items,
            [levelItem.id]: {
              ...items[levelItem.id],
              row: userRow,
              col: userCol,
            },
          });
          setCurrentPosition({ row: userRow, col: userCol });
        }
      } catch (e) {}
    } catch (e) {}
  };

  const activeLevel = levels.filter((level) => level.id === currentLevel)[0];

  const editorRef = useRef(null);
  useEffect(() => {
    onLoad(editorRef.current.editor);
  }, [levels]);

  return (
    <div className="App">
      <div className="code-area">
        {/* <Editor /> */}
        <AceEditor
          ref={editorRef}
          mode="javascript"
          theme="dracula"
          value={value}
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
        <Level
          activeLevel={activeLevel}
          ref={imageRef}
          handleNextLevel={incrementLevel}
        />

        <div className="inventory"></div>
      </div>
    </div>
  );
}

export default App;
