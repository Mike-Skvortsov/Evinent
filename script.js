function about() {
  alert(
    `Автор: Скворцов Михайло\nІнструкція: Ця програма дозволяє вам побудувати два кола та знайти точки їх перетину .Щоб створити кільце, натисніть на полотно мишею у чотирьох різних точках. Кожне натискання буде додавати нову точку, і після того, як ви натиснете чотири рази, на екрані з'явиться два кола та координати точок їх перетину. Щоб пересунути точку, клацніть на неї та перетягніть її мишою.Щоб очистити полотно та розпочати заново, натисніть кнопку "Reset". Щоб отримати додаткову інформацію про програму та її автора, натисніть кнопку "About".Сподіваємося, вам сподобається цей додаток!`
  );
}
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let A, B, C, D;
let counter = 0;
let selectedPoint;
let isDragging = false;

canvas.addEventListener("mousedown", function (event) {
  const x = event.clientX;
  const y = event.clientY;

  if (A && pointIsNearby(A, x, y)) {
    selectedPoint = A;
    isDragging = true;
  } else if (B && pointIsNearby(B, x, y)) {
    selectedPoint = B;
    isDragging = true;
  } else if (C && pointIsNearby(C, x, y)) {
    selectedPoint = C;
    isDragging = true;
  } else if (D && pointIsNearby(D, x, y)) {
    selectedPoint = D;
    isDragging = true;
  }
});

canvas.addEventListener("mousemove", function (event) {
  if (isDragging && selectedPoint) {
    const x = event.clientX;
    const y = event.clientY;

    selectedPoint.x = x;
    selectedPoint.y = y;

    redraw();
  }
});

canvas.addEventListener("mouseup", function (event) {
  const x = event.clientX;
  const y = event.clientY;

  if (counter < 4 && !isDragging) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, 2 * Math.PI);
    ctx.fill();

    switch (counter) {
      case 0:
        A = { x, y };
        updatePoint("A", A);
        break;
      case 1:
        B = { x, y };
        updatePoint("B", B);
        break;
      case 2:
        C = { x, y };
        updatePoint("C", C);
        break;
      case 3:
        D = { x, y };
        updatePoint("D", D);
        break;
    }
    counter++;
  }

  if (A && B) {
    drawCircle(A, B, "blue");
  }
  if (C && D) {
    drawCircle(C, D, "yellow");
  }

  const intersectionPoints = document.getElementById("Intersection");

  if (counter === 4) {
    const intersections = findIntersections(
      A,
      C,
      getDistance(A, B),
      getDistance(C, D)
    );

    if (intersections.length == 2) {
      intersectionPoints.textContent = `Intersections points (${Math.round(
        intersections[0].x
      )}, ${Math.round(intersections[0].y)}) (${Math.round(
        intersections[1].x
      )}, ${Math.round(intersections[1].y)}) `;
    } else if (intersections.length == 0) {
      intersectionPoints.textContent = "Intersection point don't exist";
    } else if (
      intersections[0].x == intersections[1].x &&
      intersections[0].y == intersections[1].y
    ) {
      intersectionPoints.textContent = `Intersections points (${Math.round(
        intersections[0].x
      )}, ${Math.round(intersections[0].y)}`;
    }
  }
  if (A) {
    updatePoint("A", A);
  }
  if (B) {
    updatePoint("B", B);
  }
  if (C) {
    updatePoint("C", C);
  }
  if (D) {
    updatePoint("D", D);
  }

  selectedPoint = null;
  isDragging = false;
});

function updatePoint(name, point) {
  document.getElementById(
    `point${name}`
  ).textContent = `Point ${name}: ${point.x}, ${point.y};`;
}

function drawCircle(firstDot, secondDot, color) {
  const distance = getDistance(firstDot, secondDot);
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(firstDot.x, firstDot.y, distance, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.stroke();
}
function getDistance(firstDot, secondDot) {
  return Math.sqrt(
    Math.pow(secondDot.x - firstDot.x, 2) +
      Math.pow(secondDot.y - firstDot.y, 2)
  );
}

function findIntersections(center1, center2, radius1, radius2) {
  const x1 = center1.x;
  const y1 = center1.y;
  const r1 = radius1;
  const x2 = center2.x;
  const y2 = center2.y;
  const r2 = radius2;

  const distanceBetweenCircles = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  if (
    distanceBetweenCircles > r1 + r2 ||
    distanceBetweenCircles < Math.abs(r1 - r2)
  ) {
    return [];
  } else if (distanceBetweenCircles === 0 && r1 === r2) {
    return [];
  } else {
    const a =
      (r1 ** 2 - r2 ** 2 + distanceBetweenCircles ** 2) /
      (2 * distanceBetweenCircles);
    const h = Math.sqrt(r1 ** 2 - a ** 2);
    const x3 = x1 + (a * (x2 - x1)) / distanceBetweenCircles;
    const y3 = y1 + (a * (y2 - y1)) / distanceBetweenCircles;
    const x4 = x3 + (h * (y2 - y1)) / distanceBetweenCircles;
    const y4 = y3 - (h * (x2 - x1)) / distanceBetweenCircles;
    const x5 = x3 - (h * (y2 - y1)) / distanceBetweenCircles;
    const y5 = y3 + (h * (x2 - x1)) / distanceBetweenCircles;

    return [
      {
        x: x4,
        y: y4,
      },
      {
        x: x5,
        y: y5,
      },
    ];
  }
}

function pointIsSelected(x, y, point) {
  const distance = getDistance({ x, y }, point);
  return distance <= 2.5;
}

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (A && B) {
    drawCircle(A, B, "blue");
  }
  if (C && D) {
    drawCircle(C, D, "yellow");
  }

  if (A) {
    drawPoint(A);
  }
  if (B) {
    drawPoint(B);
  }
  if (C) {
    drawPoint(C);
  }
  if (D) {
    drawPoint(D);
  }
}

function drawPoint(point) {
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(point.x, point.y, 2.5, 0, 2 * Math.PI);
  ctx.fill();
}

function pointIsNearby(point, x, y) {
  const distance = getDistance(point, { x, y });
  return distance < 10; // adjust this value to change the distance threshold for selecting a point
}
function reset() {
  A = null;
  B = null;
  C = null;
  D = null;
  counter = 0;
  selectedPoint = null;
  isDragging = false;

  // clear canvas
  ctx.canvas.width = ctx.canvas.width;

  // clear point coordinates
  document.getElementById("pointA").textContent = "";
  document.getElementById("pointB").textContent = "";
  document.getElementById("pointC").textContent = "";
  document.getElementById("pointD").textContent = "";

  // clear intersection points
  document.getElementById("Intersection").textContent = "";
}
