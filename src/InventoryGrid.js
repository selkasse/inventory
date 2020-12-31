import React, { createRef, Component } from "react";

class InventoryGrid extends Component {
  constructor(props) {
    super(props);
    this.wrapper = createRef();
  }

  //? *******************************************************************
  //* Force a reload when the window resizes
  //* This is so that the grid inspector resizes to fit the inventory
  //? *******************************************************************
  resize = () => {
    this.forceUpdate();
    window.location.reload();
  };
  //? *******************************************************************
  //* -- End force reload code
  //? *******************************************************************

  //? *******************************************************************
  //* Taken from Dave Geddes: https://mastery.games/post/grid-inspector/
  //? *******************************************************************
  getName(item) {
    return item.includes("[") ? item.match(/\[(.*)\]/)[1].trim() : null;
  }

  parseGridTemplate(templateStr, gap = "0px") {
    const gapSize = parseFloat(gap.replace("px", ""));

    //*  splits at and space that isn't between two [ ] brackets
    const parsedArray = templateStr.split(/\s(?![^[]*])/);
    let lines = [];
    let currentPosition = 0;

    //* add in any missing names as ""
    //* "200px [center-start] 300px [center-end] 400px" becomes:
    //* "'' 200px [center-start] 300px [center-end] 400px ''"

    let allItems = [];

    parsedArray.forEach((item, index) => {
      if (item.includes("px")) {
        //* add a null name before it if missing
        if (!parsedArray[index - 1] || parsedArray[index - 1].includes("px")) {
          allItems.push("");
        }
      }

      allItems.push(item);
    });

    //* handle last item
    if (parsedArray[parsedArray.length - 1].includes("px")) {
      allItems.push("");
    }

    allItems.forEach((item, index) => {
      if (item.includes("px")) {
        const trackSize = parseFloat(item.replace("px", ""));
        currentPosition += trackSize;
      } else {
        let newLine = {
          start: currentPosition - 1,
          end: currentPosition + 1,
          name: this.getName(item),
        };
        //* add gaps on just the inner lines
        //* and count it for positioning
        if (index !== 0 && index !== allItems.length - 1 && gapSize !== 0) {
          newLine.gap = gapSize;
          currentPosition += gapSize;
        }

        lines.push(newLine);
      }
    });

    return lines;
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize);

    //? *******************************************************************
    //* Taken from Dave Geddes: https://mastery.games/post/grid-inspector/
    //? *******************************************************************
    // const container = ReactDOM.findDOMNode(this);
    const container = this.wrapper.current;
    const inspector = document.createElement("div");
    inspector.setAttribute(
      "style",
      `
            position: absolute;
            height: ${container.offsetHeight}px;
            width: ${container.offsetWidth}px;
            top: ${container.offsetTop}px;
            left: ${container.offsetLeft}px;
            // border: rgba(58, 250, 8, .5);
        `
    );

    document.body.appendChild(inspector);

    const styles = window.getComputedStyle(container);
    const rows = styles.getPropertyValue("grid-template-rows");
    const columns = styles.getPropertyValue("grid-template-columns");

    const rowGap = styles.getPropertyValue("grid-row-gap");
    const columnGap = styles.getPropertyValue("grid-column-gap");

    //* convert the rows and columns into a format we can work with
    const columnData = this.parseGridTemplate(columns, columnGap);
    const rowData = this.parseGridTemplate(rows, rowGap);

    //* extend the lines a bit so we can see them better
    //? I'm not sure where this is supposed to be used
    // const extendLines = 20

    //* render a line for each vertical grid line
    columnData.forEach((item) => {
      const line = document.createElement("div");
      line.setAttribute(
        "style",
        `
                    // background: rgba(0, 0, 0, 1);
                    background: rgba(135, 224, 237, .5);
                    // background: #87E0ED;
                    position: absolute;
                    height: ${container.offsetHeight}px;
                    width: ${item.end - item.start + (item.gap || 0)}px;
                    left: ${item.start}px;
                `
      );
      inspector.appendChild(line);
    });

    //* render a line for each horizontal grid line
    rowData.forEach((item) => {
      const line = document.createElement("div");
      line.setAttribute(
        "style",
        `
                    // background: rgba(0, 0, 0, 1);
                    background: rgba(135, 224, 237, .5);
                    // background: #87E0ED;
                    position: absolute;
                    width: ${container.offsetWidth}px;
                    height: ${item.end - item.start + (item.gap || 0)}px;
                    top: ${item.start}px;
                `
      );
      inspector.appendChild(line);
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }
  render() {
    return <div ref={this.wrapper} className="inventory"></div>;
  }
}

export default InventoryGrid;
