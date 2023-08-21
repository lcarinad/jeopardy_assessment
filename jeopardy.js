let categories = [];
let num_cat = 6;
let num_clues_in_cat = 5;

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

  for (let clueIdx = 0; clueIdx < num_clues_in_cat; clueIdx++) {
    let $bodyRow = $("<tr>");
    $("#jeopardy tbody").append($bodyRow);

    for (let objIdx = 0; objIdx < num_cat; objIdx++) {
      let $td = $("<td>").text("?").attr("id", `${objIdx}, ${clueIdx}`);
      $bodyRow.append($td);
    }
    handleClick(objects);
  }
}

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
      clickedClue.showing = null;
    }
  });
  restartGame();
}

function restartGame() {
  $("#start").text("Restart Game").attr("id", "restart");
  $(".container").on("click", "#restart", function (e) {
    $("#jeopardy").empty();
    setupAndStart();
  });
}

async function setupAndStart() {
  $("#start").click(function (e) {
    e.preventDefault();
    getCategoryIds();
  });
}
setupAndStart();
