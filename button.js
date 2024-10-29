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
        const buttonText = document.createElement("div");
        buttonText.innerText = "Button";
        buttonText.style.position = "absolute";
        buttonText.style.top = "10px";
        buttonText.style.left = "10px";
        buttonText.style.fontSize = "20px"; // Initial size; will update dynamically
        buttonContainer.elt.appendChild(buttonText);

        // Read initial button dimensions and styles from data attributes
        updateButtonAttributes(buttonContainer, buttonText);

        const cnv = createCanvas(buttonWidth + 10, buttonHeight + 10);
        cnv.parent(buttonContainer);

        // Create the vertices based on button dimensions
        createVertices();

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

        // Update button when "Update Button" is clicked
        const updateButton = document.getElementById("updateButton");
        updateButton.addEventListener("click", () => {
          updateButtonAttributes(buttonContainer, buttonText);
          createVertices();
          drawButton();
        });
      }

      function updateButtonAttributes(buttonContainer, buttonText) {
        const buttonContainerElt = buttonContainer.elt;

        buttonWidth = parseInt(buttonContainerElt.getAttribute("data-width"));
        buttonHeight = parseInt(buttonContainerElt.getAttribute("data-height"));
        defaultColor = buttonContainerElt.getAttribute("data-color-default");
        hoverColor = buttonContainerElt.getAttribute("data-color-hover");

        textDefaultColor = buttonContainerElt.getAttribute(
          "data-text-color-default"
        );
        textHoverColor = buttonContainerElt.getAttribute(
          "data-text-color-hover"
        );

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

        buttonContainerElt.style.width = `${buttonWidth}px`;
        buttonContainerElt.style.height = `${buttonHeight}px`;
        buttonText.style.fontSize = `${buttonHeight / 3.5}px`;
        buttonText.style.color = isHovered ? textHoverColor : textDefaultColor; // Update text color immediately
      }

      function createVertices() {
        const radiusDivisor = parseInt(
          document.getElementById("radiusInput").value
        );
        vertices = [
          { x: 5, y: 5, radius: buttonHeight / radiusDivisor },
          { x: buttonWidth, y: 5, radius: buttonHeight / radiusDivisor },
          {
            x: buttonWidth,
            y: 5 + buttonHeight * 0.65,
            radius: buttonHeight / (radiusDivisor + 2),
          },
          {
            x: buttonWidth * 0.87,
            y: buttonHeight,
            radius: buttonHeight / (radiusDivisor + 2),
          },
          { x: 5, y: buttonHeight, radius: buttonHeight / radiusDivisor },
        ];
      }

      function drawButton() {
        clear();

        // Set drop shadow properties
        drawingContext.shadowOffsetX = shadowOffsetX;
        drawingContext.shadowOffsetY = shadowOffsetY;
        drawingContext.shadowBlur = shadowBlur;
        drawingContext.shadowColor = isHovered ? hoverShadowColor : shadowColor;

        // Draw the shadow first
        fill(isHovered ? hoverColor : defaultColor);
        noStroke();

        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        roundedPoly(ctx, vertices);
        ctx.fill();

        // Reset shadow properties
        drawingContext.shadowOffsetX = 0;
        drawingContext.shadowOffsetY = 0;
        drawingContext.shadowBlur = 0;
        drawingContext.shadowColor = "rgba(0, 0, 0, 0)";

        // Draw the button shape above the shadow
        fill(isHovered ? hoverColor : defaultColor);
        ctx.beginPath();
        roundedPoly(ctx, vertices);
        ctx.fill();

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

      function roundedPoly(ctx, points) {
        ctx.moveTo(points[0].x, points[0].y + points[0].radius);
        for (let i = 0; i < points.length; i++) {
          const nextIndex = (i + 1) % points.length;
          ctx.lineTo(points[i].x, points[i].y - points[i].radius);
          ctx.arc(
            points[i].x,
            points[i].y - points[i].radius,
            points[i].radius,
            -Math.PI / 2,
            0,
            false
          );
          ctx.lineTo(
            points[nextIndex].x + points[nextIndex].radius,
            points[nextIndex].y
          );
        }
        ctx.closePath();
      }

      function draw() {
        // No need to redraw in draw loop as it's handled by mouse events
      }

      // Use p5.js to start the sketch
      new p5(setup);
