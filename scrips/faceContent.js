import { rollUp, setFacingFaceContent, setFacingFaceContentAndRoll } from "./dice.js";

setup();

function numberFaceContent (number) {
    const span = document.createElement('span');
    span.innerText = `${number}`;
    const content = {
        element: span,
        eventListener: key => {
            if (key == `${number}`) {
                if (content.next)
                    setFacingFaceContentAndRoll(content.next.direction, content.next.content);
                else
                    rollUp();
            }   
        }
    };
    return content;
}


function dotsFaceContent (number, dot = '.') {
    const table = document.createElement('table');
    table.className = "dotsTable";
    const cells = [];
    for (let i = 0; i < 3; i++) {
        const tableRow = table.insertRow();
        const row = [];
        cells.push(row);
        for (let j = 0; j < 3; j++) {
            const cell = tableRow.insertCell();
            row.push(cell);
        }
    }

    function placeDot (i, j) {
        cells[i][j].innerHTML = dot;
    }

    switch (number) {
        case 1:
            placeDot(1, 1);
            break;
        case 2:
            placeDot(0, 0);
            placeDot(2, 2);
            break;
        case 3:
            placeDot(0, 0);
            placeDot(1, 1);
            placeDot(2, 2);
            break;
        case 4:
            placeDot(0, 0);
            placeDot(0, 2);
            placeDot(2, 0);
            placeDot(2, 2);
            break;
        case 5:
            placeDot(0, 0);
            placeDot(0, 2);
            placeDot(2, 0);
            placeDot(2, 2);
            placeDot(1, 1);
            break;
        case 6:
            placeDot(0, 0);
            placeDot(0, 2);
            placeDot(2, 0);
            placeDot(2, 2);
            placeDot(1, 0);
            placeDot(1, 2);
            break;
    }

    const content = numberFaceContent(number);
    content.element = table;

    return content;
}

function problemContent (number, text) {
    const content = numberFaceContent(number);
    content.element.innerHTML = text;
    content.element.className = "problem";
    return content;
}

/**
 * Sets the next content of this content. The dice will step to it after.
 * @param {{
 *  element: Element,
 *  eventListener: function 
 * }} content 
 * @param {string} direction up, down, left or right
 * @param {{
 *  element: Element,
 *  eventListener: function 
 * }} nextContent 
 */
function setNext (content, direction, nextContent) {
    content.next = {
        direction: direction,
        content: nextContent
    };
}


function setup () {
    setFacingFaceContent('top', dotsFaceContent(1));
    setFacingFaceContent('right', dotsFaceContent(2));
    setFacingFaceContent('front', dotsFaceContent(3));
    let content = dotsFaceContent(4);
    setFacingFaceContent('back', content);
    setFacingFaceContent('left', dotsFaceContent(5));
    setFacingFaceContent('bottom', dotsFaceContent(6));

    let nextContent = numberFaceContent(2);
    setNext(content, 'left', nextContent);
    content = nextContent;
    nextContent = numberFaceContent(6);
    setNext(content, 'down', nextContent);
    content = nextContent;
    nextContent = dotsFaceContent(6, '😄');
    setNext(content, 'down', nextContent);
    content = nextContent;
    nextContent = problemContent(4, "2 + 2");
    setNext(content, 'down', nextContent);
    content = nextContent;
    nextContent = problemContent(2, "2 * 2 / 2");
    setNext(content, 'down', nextContent);
    content = nextContent;
    nextContent = dotsFaceContent(6, '🐶');
    setNext(content, 'down', nextContent);
    content = nextContent;
    nextContent = problemContent(6, "Sally had 2 apples. She gave dave 1. How many sides are there to a cube?");
    setNext(content, 'right', nextContent);
    content = nextContent;
    nextContent = dotsFaceContent(2);
    setNext(content, 'down', nextContent);
    content = nextContent;
    nextContent = dotsFaceContent(5, '🐷');
    setNext(content, 'down', nextContent);
    content = nextContent;
    nextContent = dotsFaceContent(3, '🐷');
    setNext(content, 'right', nextContent);
    content = nextContent;
    nextContent = numberFaceContent(5);
    setNext(content, 'down', nextContent);
    content = nextContent;
    nextContent = problemContent(1, "0!");
    setNext(content, 'up', nextContent);
}
