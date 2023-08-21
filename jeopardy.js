// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
let num_cat = 6;
let num_clues_in_cat = 5;

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
  let res = await axios.get("https://jservice.io/api/categories?count=100");
  let catArr = res.data;
  let length = 6;
  while (categories.length < length) {
    let catArrIdx = Math.floor(Math.random() * catArr.length);
    let cluesCount = catArr[catArrIdx].clues_count;
    if (cluesCount >= 5 && !categories.includes(catArr[catArrIdx].id)) {
      categories.push(catArr[catArrIdx].id);
    }
  }
  getCategory(categories);
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catIds) {
  let resultObj = [];
  for (let id of catIds) {
    let idRes = await axios.get(`https://jservice.io/api/category?id=${id}`);
    let { title, clues } = idRes.data;

    let cluesArr = clues.map(({ question, answer }) => ({
      question,
      answer,
      showing: null,
    }));

    resultObj.push({ title, clues: cluesArr });
  }

  fillTable(resultObj);
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable(objects) {
  $("#spin-container").empty();
  $("#jeopardy thead").empty();
  let $headRow = $("<tr>");
  let objIdx = 0;
  for (let object of objects) {
    let $th = $("<th>").text(object.title).attr("id", `${objIdx}-${0}`);
    $headRow.append($th);
    objIdx++;
  }
  $("#jeopardy thead").append($headRow);

  $("#jeopardy tbody").empty();

  //appending the tbdoy row
  for (let clueIdx = 0; clueIdx < num_clues_in_cat; clueIdx++) {
    let $bodyRow = $("<tr>");
    $("#jeopardy tbody").append($bodyRow);

    for (let objIdx = 0; objIdx < num_cat; objIdx++) {
      let $td = $("<td>")
        .text("?")
        .attr("id", `${objIdx}, ${clueIdx}`)
        .addClass("box");
      // .val(objects[objIdx].clues);
      $bodyRow.append($td);
    }
    handleClick(objects);
  }

  // console.log(objects[objIdx].clues);
  /** Handle clicking on a clue: show the question or answer.
   *
   * Uses .showing property on clue to determine what to show:
   * - if currently null, show question & set .showing to "question"
   * - if currently "question", show answer & set .showing to "answer"
   * - if currently "answer", ignore click
   * */
  function handleClick(objects) {
    $("#jeopardy tbody").on("click", "td", function (evt) {
      let $element = $(this);
      let catId = evt.target.id.charAt(0);
      let rowId = evt.target.id.charAt(3);

      let clues = objects[catId].clues;
      let clickedClue = clues[rowId];

      if (clickedClue.showing === null) {
        clickedClue.showing = "question";
        $element.text(clickedClue.question);
      } else if (clickedClue.showing === "question") {
        clickedClue.showing = "answer";
        $element.text(clickedClue.answer);
      }
    });
  }

  /** Wipe the current Jeopardy board, show the loading spinner,
   * and update the button used to fetch data.
   */

  function showLoadingView() {}

  /** Remove the loading spinner and update the button used to fetch data. */

  function hideLoadingView() {}

  /** Start game:
   *
   * - get random category Ids
   * - get data for each category
   * - create HTML table
   * */

  async function setupAndStart() {
    $("#start").click(function (e) {
      e.preventDefault();
      getCategoryIds();
    });
  }
  setupAndStart();

  /** On click of start / restart button, set up game. */

  // TODO

  /** On page load, add event handler for clicking clues */

  // TODO
}
