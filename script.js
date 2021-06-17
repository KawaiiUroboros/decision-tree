canvas = document.getElementById("canvas");

let state = {
    points : [],
    pointSize : 3,
    canvasWidth: canvas.width,
    canvasHeight: canvas.height
}

generatePoints();
drawPoints()

document.querySelector(".btn-run").addEventListener("click", e => {
    let labels = [];
    for (let i = 0; i < 160; ++i)
        labels[i] = i % 2 === 0 ? 1 : -1;

    let forest = new forestjs.DecisionTree();
    forest.train(state.points, labels);
    let labelProbability = forest.predictOne(state.points[20]);
    // labelProbabilities = forest.predict([[4, 5], [3, 7], [50, 40]]);
    console.log(labelProbability);
})

function generateGroup(centerX,centerY) {

    let a = 30;
    let b = 30;

    for (let i = 0; i < 40; ++i) {

        let r = a * Math.random();
        let fi = 2 * Math.PI * Math.random();
        let x = centerX + r * Math.cos(fi)*3 ;
        let y = centerY + b / a * r * Math.sin(fi)*3;

        state.points.push([x, y]);
    }
}

function generatePoints() {

    let centerX = state.canvasWidth ;
    let centerY = state.canvasHeight ;
    generateGroup(centerX / 3,centerY / 3);
    generateGroup(centerX * 2.5 / 4,centerY * 2.5 / 4);
    generateGroup(centerX / 3,centerY * 2.5 / 4);
    generateGroup(centerX * 2.5 / 4,centerY / 3);
   
}


function drawPoints(){
    state.points.forEach(element => {
        drawCoordinates(element[0],element[1]);
    });
}

function drawCoordinates(x, y) {
  var ctx = document.getElementById("canvas").getContext("2d");
  ctx.fillStyle = "#ff2626"; // Red color
  ctx.beginPath();
  ctx.arc(x, y, state.pointSize, 0, Math.PI * 2, true);
  ctx.fill();
}
