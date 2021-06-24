function init() {

    let canvas = document.getElementById('myCanvas');
    let clearBtn = document.getElementById('clearBtn');
    let xorGenBtn = document.getElementById('xorGenBtn');
    let linearGenBtn = document.getElementById('linearGenBtn');
    let insideGenBtn = document.getElementById('insideGenBtn');
    let defaultGenBtn = document.getElementById('defaultGenBtn');
    let context = canvas.getContext('2d');
    let displayTreeDiv = document.getElementById('displayTree');

    let NOT_SELECTED_COLOR_STYLE = '2px solid white';
    let SELECTED_COLOR_STYLE = '2px solid black';
    let colorSelectElements = document.getElementsByClassName('color-select');
    for (let i = 0; i < colorSelectElements.length; i++) {
        colorSelectElements[i].style.backgroundColor = colorSelectElements[i].getAttribute('label');
        colorSelectElements[i].style.border = NOT_SELECTED_COLOR_STYLE;
    }

    let color = colorSelectElements[0].getAttribute('label');
    let POINT_RADIUS = 3;
    let points = [];
    let tree = null;
    let MAX_ALPHA = 128;
    let addingPoints = false;

    colorSelectElements[0].style.border = SELECTED_COLOR_STYLE;

    canvas.addEventListener('mousedown', enableAddingPointsListener, false);

    canvas.addEventListener('mouseup', rebuildForestListener, false);

    canvas.addEventListener('mouseout', rebuildForestListener, false);

    canvas.addEventListener('mousemove', addPointsListener, false);


    for (let i = 0; i < colorSelectElements.length; i++) {
        colorSelectElements[i].addEventListener('click', selectColorListener, false);
    }

    clearBtn.addEventListener('click', clearCanvasListener, false);
    xorGenBtn.addEventListener('click', generateXorPoints, false);
    linearGenBtn.addEventListener('click', generateLinearPoints, false);
    insideGenBtn.addEventListener('click', generateInsidePoints, false);
    defaultGenBtn.addEventListener('click', generateDefaultPoints, false);

    function enableAddingPointsListener(e) {
        e.preventDefault();
        addingPoints = true;
    }

    function addPointsListener(e) {
        if (addingPoints) {
            let x = e.offsetX ? e.offsetX : (e.layerX - canvas.offsetLeft);
            let y = e.offsetY ? e.offsetY : (e.layerY - canvas.offsetTop);

            drawCircle(context, x, y, POINT_RADIUS, color);
            points.push({
                x: x,
                y: y,
                color: color
            });
        }
    }

    function rebuildForestListener() {

        // if (!addingPoints) return;

        if (points.length === 0) return;

        addingPoints = false;


        let threshold = Math.floor(points.length / 100);
        threshold = (threshold > 1) ? threshold : 1;

        tree = new dt.DecisionTree({
            trainingSet: points,
            categoryAttr: 'color',
            minItemsCount: threshold
        });

        displayTreePredictions();
        displayPoints();

        displayTreeDiv.innerHTML = treeToHtml(tree.root);
    }

    function displayTreePredictions() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                let predictedHexColor = tree.predict({
                    x: x,
                    y: y
                });
                putPixel(imageData, canvas.width, x, y, predictedHexColor, MAX_ALPHA);
            }
        }

        context.putImageData(imageData, 0, 0);
    }

    function displayPoints() {
        for (let p in points) {
            drawCircle(context, points[p].x, points[p].y, POINT_RADIUS, points[p].color);
        }
    }

    function drawCircle(context, x, y, radius, hexColor) {
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI, false);

        let c = hexToRgb(hexColor)
        context.fillStyle = 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')';

        context.fill();
        context.closePath();
        context.stroke();
    }

    function putPixel(imageData, width, x, y, hexColor, alpha) {
        let c = hexToRgb(hexColor);
        let indx = (y * width + x) * 4;

        let currAlpha = imageData.data[indx + 3];

        imageData.data[indx] = (c.r * alpha + imageData.data[indx] * currAlpha) / (alpha + currAlpha);
        imageData.data[indx + 1] = (c.g * alpha + imageData.data[indx + 1] * currAlpha) / (alpha + currAlpha);
        imageData.data[indx + 2] = (c.b * alpha + imageData.data[indx + 2] * currAlpha) / (alpha + currAlpha);
        imageData.data[indx + 3] = alpha + currAlpha;
    }

    function selectColorListener() {
        color = this.getAttribute('label');

        for (let i = 0; i < colorSelectElements.length; i++) {
            colorSelectElements[i].style.border = NOT_SELECTED_COLOR_STYLE;
        }

        this.style.border = SELECTED_COLOR_STYLE;
    }

    function clearCanvasListener() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        points = [];
        displayTreeDiv.innerHTML = '';
    }

    /**
     * Taken from: http://stackoverflow.com/a/5624139/653511
     */
    function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Repeating of string taken from: http://stackoverflow.com/a/202627/653511
    let EMPTY_STRING = new Array(26).join('&nbsp;');

    // Recursively traversing decision tree (DFS)
    function treeToHtml(tree) {

        if (tree.category) {
            return ['<ul>',
                '<li>',
                '<a href="#" style="background-color:', tree.category, '">', EMPTY_STRING, '</a>',
                '</li>',
                '</ul>'].join('');
        }

        return ['<ul>',
            '<li>',
            '<a href="#"><b>', tree.attribute, ' ', tree.predicateName, ' ', tree.pivot, ' ?</b></a>',
            '<ul>',
            '<li>',
            '<a href="#">yes (', tree.matchedCount, ' points) </a>',
            treeToHtml(tree.match),
            '</li>',
            '<li>',
            '<a href="#">no (', tree.notMatchedCount, ' points) </a>',
            treeToHtml(tree.notMatch),
            '</li>',
            '</ul>',
            '</li>',
            '</ul>'].join('');
    }

    generateXorPoints();
    drawPoints();

    function generateGroup(centerX, centerY, color, width, height) {

        let a = width;
        let b = height;

        for (let i = 0; i < 40; ++i) {

            let r = a * Math.random();
            let fi = 2 * Math.PI * Math.random();
            let x = centerX + r * Math.cos(fi) * 3;
            let y = centerY + b / a * r * Math.sin(fi) * 3;

            points.push({
                x: x,
                y: y,
                color: color
            });
        }
    }

    function generateXorPoints() {
        points = [];
        let centerX = canvas.width;
        let centerY = canvas.height;
        generateGroup(centerX / 3, centerY / 3, "#33CCFF", 18, 18);
        generateGroup(centerX * 2.5 / 4, centerY * 2.5 / 4, "#009933", 18, 18);
        generateGroup(centerX / 3, centerY * 2.5 / 4, "#FF6600", 18, 18);
        generateGroup(centerX * 2.5 / 4, centerY / 3, "#FFC508", 18, 18);
        rebuildForestListener();
    }

    function generateLinearPoints() {
        points = [];
        let centerX = canvas.width;
        let centerY = canvas.height;
        generateGroup(centerX / 2, centerY / 3, "#33CCFF", 18, 18);
        generateGroup(centerX / 2, centerY * 2.5 / 4, "#009933", 18, 18);
        rebuildForestListener();
    }

    function generateInsidePoints() {
        points = [];
        let centerX = canvas.width;
        let centerY = canvas.height;
        generateGroup(centerX / 2, centerY / 2, "#33CCFF", 18, 18);
        generateGroup(centerX / 2, centerY / 2, "#009933", 40, 40);
        rebuildForestListener();
    }

    function generateDefaultPoints() {
        points = [];
        let centerX = canvas.width;
        let centerY = canvas.height;
        generateGroup(centerX / 2, centerY / 2, "#33CCFF", 70, 70);
        generateGroup(centerX / 2, centerY / 2, "#009933", 70, 70);
        rebuildForestListener();
    }

    function drawPoints() {
        points.forEach(point => {
            drawCircle(context, point.x, point.y, 3, point.color);
        });
    }
}