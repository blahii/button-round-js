let vertices;
let buttonWidth = 180;
let buttonHeight = 40;
let isHovered = false;
let isAfterHovered = false; // Для ефекту після hover
let hoverColor, afterHoverColor, shadowBlurSize;

function setup() {
  // Створюємо canvas з відступом
  const cnv = createCanvas(buttonWidth + 10, buttonHeight + 10);
  cnv.parent("buttonContainer");

  // Встановлюємо значення
  hoverColor = "#4557F7"; // Hover color
  afterHoverColor = "#8888FF"; // After-hover color
  shadowBlurSize = 10; // Shadow blur size

  vertices = [
    { x: 5, y: 5, radius: buttonHeight / 8 },
    { x: buttonWidth, y: 5, radius: buttonHeight / 8 },
    { x: buttonWidth, y: 5 + buttonHeight * 0.4, radius: buttonHeight / 6 },
    { x: buttonWidth * 0.85, y: buttonHeight, radius: buttonHeight / 6 },
    { x: 5, y: buttonHeight, radius: buttonHeight / 8 },
  ];

  drawButton();
  
  // Додаємо події hover
  const buttonContainer = document.getElementById("buttonContainer");
  buttonContainer.addEventListener("mouseover", () => {
    isHovered = true;
    isAfterHovered = false;
    drawButton();
  });
  buttonContainer.addEventListener("mouseout", () => {
    isHovered = false;
    isAfterHovered = true;
    drawButton();
  });
}

function drawButton() {
  clear();
  const fillColor = isHovered ? hoverColor : afterHoverColor;
  const shadowColor = isHovered
    ? "rgba(69, 87, 247, 0.9)"
    : "rgba(69, 87, 247, 0.4)";

  drawingContext.shadowOffsetX = 5;
  drawingContext.shadowOffsetY = 5;
  drawingContext.shadowBlur = shadowBlurSize;
  drawingContext.shadowColor = shadowColor;
  fill(fillColor);

  noStroke();
  const ctx = canvas.getContext("2d");
  ctx.beginPath();
  roundedPoly(ctx, vertices);
  ctx.fill();
  ctx.stroke();
  
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;
  drawingContext.shadowBlur = 0;
  drawingContext.shadowColor = "rgba(0, 0, 0, 0)";
}

function roundedPoly(ctx, points, radiusAll) {
  let i, x, y, len, p1, p2, p3, v1, v2, sinA, sinA90, radDirection, drawDirection, angle, halfAngle, cRadius, lenOut, radius;
  const asVec = (p, pp, v) => {
    v.x = pp.x - p.x;
    v.y = pp.y - p.y;
    v.len = Math.sqrt(v.x * v.x + v.y * v.y);
    v.nx = v.x / v.len;
    v.ny = v.y / v.len;
    v.ang = Math.atan2(v.ny, v.nx);
  };
  
  radius = radiusAll;
  v1 = {};
  v2 = {};
  len = points.length;
  p1 = points[len - 1];
  for (i = 0; i < len; i++) {
    p2 = points[i % len];
    p3 = points[(i + 1) % len];
    asVec(p2, p1, v1);
    asVec(p2, p3, v2);
    sinA = v1.nx * v2.ny - v1.ny * v2.nx;
    sinA90 = v1.nx * v2.nx - v1.ny * -v2.ny;
    angle = Math.asin(sinA < -1 ? -1 : sinA > 1 ? 1 : sinA);
    radDirection = 1;
    drawDirection = false;
    if (sinA90 < 0) {
      angle = angle < 0 ? Math.PI + angle : Math.PI - angle;
      radDirection = -1;
      drawDirection = true;
    } else if (angle > 0) {
      radDirection = -1;
      drawDirection = true;
    } else {
      angle = TAU + angle;
    }
    radius = p2.radius || radiusAll;
    halfAngle = angle / 2;
    lenOut = Math.abs((Math.cos(halfAngle) * radius) / Math.sin(halfAngle));
    if (lenOut > Math.min(v1.len / 2, v2.len / 2)) {
      lenOut = Math.min(v1.len / 2, v2.len / 2);
      cRadius = Math.abs((lenOut * Math.sin(halfAngle)) / Math.cos(halfAngle));
    } else {
      cRadius = radius;
    }
    x = p2.x + v2.nx * lenOut + -v2.ny * cRadius * radDirection;
    y = p2.y + v2.ny * lenOut + v2.nx * cRadius * radDirection;
    ctx.arc(x, y, cRadius, v1.ang + (Math.PI / 2) * radDirection, v2.ang - (Math.PI / 2) * radDirection, drawDirection);
    p1 = p2;
    p2 = p3;
  }
  ctx.closePath();
}
