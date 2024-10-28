let vertices;
let buttonWidth = 180;
let buttonHeight = 40;
let isHovered = false;
let isAfterHovered = false; // Додаємо змінну для після-hover ефекту
let animationFrame;

function setupButton( iconSrc, hoverColor, afterHoverColor, shadowBlurSize = 5) {
  const buttonContainer = document.getElementById("buttonContainer");
  const buttonText = document.getElementById("buttonText");
  const buttonIcon = document.getElementById("buttonIcon");

  buttonContainer.style.width = `${buttonWidth}px`;
  buttonContainer.style.height = `${buttonHeight}px`;
  buttonText.style.fontSize = `${buttonHeight / 3.5}px`;
  buttonText.style.top = `${-2}px`;
  buttonIcon.style.height = `${buttonHeight / 2}px`;
  buttonIcon.style.left = `${-buttonHeight}px`;
  buttonIcon.src = iconSrc;

  const cnv = createCanvas(buttonWidth + 10, buttonHeight + 10); // Змінюваний відступ
  cnv.parent(buttonContainer);

  vertices = [
    { x: 5, y: 5, radius: buttonHeight / 8 },
    { x: buttonWidth, y: 5, radius: buttonHeight / 8 },
    { x: buttonWidth, y: 5 + buttonHeight * 0.4, radius: buttonHeight / 6 },
    { x: buttonWidth * 0.85, y: buttonHeight, radius: buttonHeight / 6 },
    { x: 5, y: buttonHeight, radius: buttonHeight / 8 },
  ];

  drawButton(hoverColor, afterHoverColor, shadowBlurSize);

  buttonContainer.mouseOver(() => {
    isHovered = true;
    isAfterHovered = false;
    drawButton(hoverColor, afterHoverColor, shadowBlurSize);
  });
  buttonContainer.mouseOut(() => {
    isHovered = false;
    isAfterHovered = true;
    drawButton(hoverColor, afterHoverColor, shadowBlurSize);
  });
}

function drawButton(hoverColor, afterHoverColor, shadowBlurSize) {
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
        var i,
          x,
          y,
          len,
          p1,
          p2,
          p3,
          v1,
          v2,
          sinA,
          sinA90,
          radDirection,
          drawDirection,
          angle,
          halfAngle,
          cRadius,
          lenOut,
          radius;
        var asVec = function (p, pp, v) {
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
            if (angle < 0) {
              angle = Math.PI + angle;
            } else {
              angle = Math.PI - angle;
              radDirection = -1;
              drawDirection = true;
            }
          } else {
            if (angle > 0) {
              radDirection = -1;
              drawDirection = true;
            } else {
              angle = TAU + angle;
            }
          }
          if (p2.radius !== undefined) {
            radius = p2.radius;
          } else {
            radius = radiusAll;
          }
          halfAngle = angle / 2;
          lenOut = Math.abs(
            (Math.cos(halfAngle) * radius) / Math.sin(halfAngle)
          );
          if (lenOut > Math.min(v1.len / 2, v2.len / 2)) {
            lenOut = Math.min(v1.len / 2, v2.len / 2);
            cRadius = Math.abs(
              (lenOut * Math.sin(halfAngle)) / Math.cos(halfAngle)
            );
          } else {
            cRadius = radius;
          }
          x = p2.x + v2.nx * lenOut;
          y = p2.y + v2.ny * lenOut;
          x += -v2.ny * cRadius * radDirection;
          y += v2.nx * cRadius * radDirection;
          ctx.arc(
            x,
            y,
            cRadius,
            v1.ang + (Math.PI / 2) * radDirection,
            v2.ang - (Math.PI / 2) * radDirection,
            drawDirection
          );
          p1 = p2;
          p2 = p3;
        }
        ctx.closePath();
      }

function mousePressed() {
  if (mouseX >= 0 && mouseX <= buttonWidth && mouseY >= 0 && mouseY <= buttonHeight) {
    if (isInsidePolygon(mouseX, mouseY, vertices)) {
      alert("Button clicked!");
    }
  }
}
