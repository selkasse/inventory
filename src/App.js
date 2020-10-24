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
  //TODO: add an error boundary instead of checking if there is an activeLevel

  if (activeLevel) {
    return (
      <div className="story">
        <p>{activeLevel.text}!</p>

        <div key={activeLevel.imageID} id="image-div">
          <img
            ref={ref}
            id={activeLevel.imageID}
            className={activeLevel.imageID}
            src={activeLevel.imageSource}
            alt={activeLevel.imageID}
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

    let valid = true;
    for (const [key, item] of Object.entries(items)) {
      const image = document.getElementById(item.id);
      if (image) {
        //* if user has entered row and column
        //* and the row or column is different than the item in state
        if (
          image.style.gridRowStart &&
          image.style.gridColumnStart &&
          (image.style.gridRowStart !== item.row ||
            image.style.gridColumnStart !== item.col)
        ) {
          //* check if there is already an item in the entered position
          for (const [innerKey, innerItem] of Object.entries(items)) {
            if (
              innerItem.row === image.style.gridRowStart &&
              innerItem.col === image.style.gridColumnStart
            ) {
              valid = false;
              const consoleArea = document.getElementById("console");
              consoleArea.innerHTML = "There is already an item in that slot!";
              console.log("there is already an item in that position");

              //* move the item back to it's previous position
              let rowToCorrect;
              let colToCorrect;
              setItems((prevItems) => {
                for (const [prevKey, prevItem] of Object.entries(prevItems)) {
                  if (prevItem.id === image.id) {
                    console.log(prevItem.id, prevItem.row, prevItem.col);
                    if (prevItem.row === 0 && prevItem.col === 0) {
                      console.log("image should be moved back to top");
                      const imageDiv = document.getElementById("image-div");
                      imageDiv.insertAdjacentElement("beforeEnd", image);
                      rowToCorrect = 0;
                      colToCorrect = 0;
                    } else {
                      console.log("image should be moved to previous slot");
                      image.style.gridRowStart = prevItem.row;
                      image.style.gridColumnStart = prevItem.col;
                      rowToCorrect = prevItem.row;
                      colToCorrect = prevItem.col;
                    }
                  }
                  //* set the item position back to the correct state
                  setItems({
                    ...items,
                    [image.id]: {
                      ...items[image.id],
                      row: rowToCorrect,
                      col: colToCorrect,
                    },
                  });
                }
              });
            }
          }
          if (valid) {
            const thisLevel = levels.filter(
              (level) => level.id === currentLevel
            )[0];

            if (!thisLevel.done) markLevelComplete(currentLevel);

            setItems({
              ...items,
              [item.id]: {
                ...items[item.id],
                row: image.style.gridRowStart,
                col: image.style.gridColumnStart,
              },
            });
          }
        }
      }
    }
  }, [currentLevel, items, levels, value]);

  const imageRef = useRef();

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

        if (
          userCol &&
          userRow &&
          (userCol !== currentPosition.col || userRow !== currentPosition.row)
        ) {
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
