      let vertices;
      let buttonWidth;
      let buttonHeight;
      let isHovered = false;

      let defaultColor;
      let hoverColor;
      let textDefaultColor;
      let textHoverColor;
      let shadowOffsetX;
      let shadowOffsetY;
      let shadowBlur;
      let shadowColor;
      let hoverShadowColor;

      function setup() {
        const buttonContainer = select("#buttonContainer");
        const buttonText = document.getElementById("buttonText");

        // Retrieve the DOM element from the p5.js element
        const buttonContainerElt = buttonContainer.elt;

        // Read button dimensions and styles from data attributes
        buttonWidth = parseInt(buttonContainerElt.getAttribute("data-width"));
        buttonHeight = parseInt(buttonContainerElt.getAttribute("data-height"));
        defaultColor = buttonContainerElt.getAttribute("data-color-default");
        hoverColor = buttonContainerElt.getAttribute("data-color-hover");

        // Initialize text colors
        textDefaultColor = buttonContainerElt.getAttribute(
          "data-text-color-default"
        );
        textHoverColor = buttonContainerElt.getAttribute(
          "data-text-color-hover"
        );

        // Initialize shadow variables
        shadowOffsetX = parseInt(
          buttonContainerElt.getAttribute("data-shadow-offset-x")
        );
        shadowOffsetY = parseInt(
          buttonContainerElt.getAttribute("data-shadow-offset-y")
        );
        shadowBlur = parseInt(
          buttonContainerElt.getAttribute("data-shadow-blur")
        );
        shadowColor = buttonContainerElt.getAttribute(
          "data-shadow-color-default"
        );
        hoverShadowColor = buttonContainerElt.getAttribute(
          "data-shadow-color-hover"
        );

        // Read the radius divisor
        const radiusDivisor = parseInt(
          buttonContainerElt.getAttribute("data-radius")
        );

        // Set width and height of the button
        buttonContainerElt.style.width = `${buttonWidth}px`;
        buttonContainerElt.style.height = `${buttonHeight}px`;
        buttonText.style.fontSize = `${buttonHeight / 3.5}px`;
        buttonText.style.top = `${-2}px`;

        const cnv = createCanvas(buttonWidth + 10, buttonHeight + 10);
        cnv.parent(buttonContainer);

        vertices = [
          { x: 5, y: 5, radius: buttonHeight / radiusDivisor }, // Use radiusDivisor
          { x: buttonWidth, y: 5, radius: buttonHeight / radiusDivisor },
          {
            x: buttonWidth,
            y: 5 + buttonHeight * 0.65,
            radius: buttonHeight / (radiusDivisor + 2), // Adjust as necessary
          },
          {
            x: buttonWidth * 0.87,
            y: buttonHeight,
            radius: buttonHeight / (radiusDivisor + 2),
          },
          { x: 5, y: buttonHeight, radius: buttonHeight / radiusDivisor },
        ];

        drawButton();

        // Unified hover events
        buttonContainer.mouseOver(() => {
          isHovered = true;
          drawButton();
        });
        buttonContainer.mouseOut(() => {
          isHovered = false;
          drawButton();
        });
      }

      function drawButton() {
        clear();

        // Set drop shadow properties
        drawingContext.shadowOffsetX = shadowOffsetX;
        drawingContext.shadowOffsetY = shadowOffsetY;
        drawingContext.shadowBlur = shadowBlur;
        drawingContext.shadowColor = isHovered ? hoverShadowColor : shadowColor;

        // Draw the shadow first
        fill(isHovered ? hoverColor : defaultColor); // This could be a neutral color for shadow
        noStroke(); // Remove outline for shadow

        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        roundedPoly(ctx, vertices); // Draw the custom shape
        ctx.fill(); // Fill shadow

        // Reset shadow properties to prevent affecting the button shape
        drawingContext.shadowOffsetX = 0;
        drawingContext.shadowOffsetY = 0;
        drawingContext.shadowBlur = 0;
        drawingContext.shadowColor = "rgba(0, 0, 0, 0)";

        // Now draw the button shape above the shadow
        fill(isHovered ? hoverColor : defaultColor); // Set the fill color for the button
        ctx.beginPath();
        roundedPoly(ctx, vertices); // Draw the same custom shape
        ctx.fill(); // Fill button shape
        ctx.stroke(); // If you want to add an outline to the button

        // Update text color
        buttonText.style.color = isHovered ? textHoverColor : textDefaultColor;
      }

      function mousePressed() {
        if (
          mouseX >= 0 &&
          mouseX <= buttonWidth &&
          mouseY >= 0 &&
          mouseY <= buttonHeight
        ) {
          if (isInsidePolygon(mouseX, mouseY, vertices)) {
            alert("Button clicked!");
          }
        }
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

      function draw() {
        // No need to redraw in draw loop as it's handled by mouse events
      }

      // Use p5.js to start the sketch
      new p5(setup);
