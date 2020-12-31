const editorValue = `function log(message){
    const consoleDiv = document.getElementById('console');
    consoleDiv.innerHTML = \`\${ message } <br /> <br />\` ;
}

function validInput(row, col){
    if(!row || ! col) return false;
    
    log('');

    const MAX_ROWS = 5;
    const MAX_COLS = 12;
    
    let validRow = row <= MAX_ROWS;
    let validCol = col <= MAX_COLS;

    if(!validRow){
        log(\`\${row} is outside the inventory row range\`);
    }
    if(!validCol){
        log(\`\${col} is outside the inventory column range\`);
    }
    return validRow && validCol;
}

function moveItem(item, row, col){

    const inventory = document.querySelector('.inventory');

    if(validInput(row,col)){

        item.style.gridColumnStart = col;
        item.style.gridRowStart = row;
        item.classList.add(item.id)
        inventory.insertAdjacentElement('beforeEnd', item); 
    }
    
}

const scroll = document.getElementById('scroll')
`;

export const onLoad = (editor) => {
  editor.session.foldAll();
  editor.getSession().setUseWrapMode(true);
  editor.setOption("showLineNumbers", false);
  console.log("in onLoad");
};

export default editorValue;
