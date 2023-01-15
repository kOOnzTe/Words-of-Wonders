// [letter,rowIndex,colIndex]

var answers = {
  EARTH: [
    ["E", 3, 1],
    ["A", 3, 2],
    ["R", 3, 3],
    ["T", 3, 4],
    ["H", 3, 5],
  ],
  HEAT: [
    ["H", 1, 2],
    ["E", 2, 2],
    ["A", 3, 2],
    ["T", 4, 2],
  ],
  EAT: [
    ["E", 1, 4],
    ["A", 2, 4],
    ["T", 3, 4],
  ],
  HEAR: [
    ["H", 3, 5],
    ["E", 4, 5],
    ["A", 5, 5],
    ["R", 6, 5],
  ],
  RAT: [
    ["R", 6, 5],
    ["A", 6, 6],
    ["T", 6, 7],
  ],
};

var selectedLetters = "";

var revealedWords = [];

var hintsRevealed = false;

$(function () {
  shuffleLetters();

  $("body").on("contextmenu", function (e) {
    e.preventDefault();
    showClickCircle(e);

    if (answers[selectedLetters]) {
      if (revealedWords.includes(selectedLetters)) {
        answers[selectedLetters].forEach((e) => {
          var rowIndex = e[1];
          var colIndex = e[2];

          flashEffect(
            $(`tr:nth-of-type(${rowIndex}) > td:nth-of-type(${colIndex})`)
          );
        });

        bounceEffect($(".selected-letters"), "horizontal", function () {
          $(".letter").removeClass("selected");
          selectedLetters = "";
          $(".selected-letters").text(selectedLetters).css("display", "none");
        });
      } 
      else {
        answers[selectedLetters].forEach((e) => {
          var rowIndex = e[1];
          var colIndex = e[2];

          $(`tr:nth-of-type(${rowIndex}) > td:nth-of-type(${colIndex})`)
            .addClass("revealed")
            .removeClass("hint-active");
        });
        $(".letter").removeClass("selected");
        $(".selected-letters").text(selectedLetters).css("display", "none");
        revealedWords.push(selectedLetters);
        selectedLetters = "";
      }
    } 
    else {
      bounceEffect($(".selected-letters"), "horizontal", function () {
        $(".letter").removeClass("selected");
        selectedLetters = "";
        $(".selected-letters").text(selectedLetters).css("display", "none");
      });
    }
  });

  $("body").on("click", function (e) {
    showClickCircle(e);
  });

  $(".mix-button").on("click", function () {
    if (selectedLetters.length) {
      bounceEffect($(this), "vertical");
    } else shuffleLetters();
  });

  $(".letter").on("click", function () {
    var value = $(this).attr("value");
    if (selectedLetters.indexOf(value) != -1) {
      bounceEffect($(this), "vertical");
    } else {
      selectedLetters += value;
      $(this).addClass("selected");
      $(".selected-letters").text(selectedLetters).css("display", "block");
    }
  });

  $(".hint").on("click", function () {
    for (let word of Object.keys(answers)) {
      if (!revealedWords.includes(word)) {
        answers[word].forEach((e) => {
          var rowIndex = e[1];
          var colIndex = e[2];
          var element = $(
            `tr:nth-of-type(${rowIndex}) > td:nth-of-type(${colIndex})`
          );
          if (!hintsRevealed) {
            if (!element.attr("class").includes("revealed")) {
              element.addClass("hint-active");
            }
          } else {
            element.removeClass("hint-active");
          }
        });
      }
    }
    hintsRevealed = !hintsRevealed;
  });
});

function shuffleLetters() {
  var letters = "EARTH".split("");
  $(".letter").each(function () {
    var i = Math.floor(Math.random() * letters.length);
    var letter = letters[i];
    letters.splice(i, 1);
    $(this).attr("value", letter).text(letter);
  });
}

function showClickCircle(e) {
  var left = e.pageX - 25;
  var top = e.pageY - 25;

  $("#click-effect-circle")
    .css({ display: "block", left, top })
    .animate(
      {
        width: "-=50",
        height: "-=50",
        left: "+=25",
        top: "+=25",
      },
      function () {
        $(this).css({ display: "none", width: "50px", height: "50px" });
      }
    );
}

function bounceEffect(
  element,
  orientation = "horizontal",
  callBack = function () {}
) {
  const distance = 10;
  const speed = 50;

  const previousTransition = element.css("transition");
  element.css("transition", "none");

  if (orientation == "horizontal") {
    element
      .animate({ marginLeft: "-=" + distance }, speed)
      .animate({ marginLeft: "+=" + distance }, speed)
      .animate({ marginLeft: "-=" + distance }, speed)
      .animate({ marginLeft: "+=" + distance }, speed)
      .animate({ marginLeft: "-=" + distance }, speed)
      .animate({ marginLeft: "+=" + distance }, speed, function () {
        element.css("transition", previousTransition);
        callBack();
      });
  } else {
    element
      .animate({ marginTop: "-=" + distance }, speed)
      .animate({ marginTop: "+=" + distance }, speed)
      .animate({ marginTop: "-=" + distance }, speed)
      .animate({ marginTop: "+=" + distance }, speed)
      .animate({ marginTop: "-=" + distance }, speed)
      .animate({ marginTop: "+=" + distance }, speed, function () {
        element.css("transition", previousTransition);
        callBack();
      });
  }
}

function flashEffect(element, callBack = function () {}) {
  const oldColor = element.css("color");
  var count = 0;
  var intNum;
  const previousTransition = element.css("transition");
  element.css("transition", "color .1s ease");

  intNum = setInterval(function () {
    element.css("color", count % 2 ? oldColor : "black");

    count++;
    if (count == 6) {
      clearInterval(intNum);
      element.css("transition", previousTransition);
    }
  }, 100);
}
