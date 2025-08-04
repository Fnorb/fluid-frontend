// squircle.js — Houdini Paint Worklet for smooth corners

registerPaint(
  "squircle",
  class {
    static get inputProperties() {
      return ["--squircle-radius", "--squircle-smooth", "background-color"];
    }

    paint(ctx, geom, props) {
      const width = geom.width;
      const height = geom.height;

      const radius =
        parseFloat(props.get("--squircle-radius").toString()) || 12;
      const smooth =
        parseFloat(props.get("--squircle-smooth").toString()) || 1.8;
      const color = props.get("background-color").toString() || "#000";

      ctx.fillStyle = color;

      const maxRadius = Math.min(width, height) / 2;
      const adjustedRadius = Math.min(radius, maxRadius);

      const r = adjustedRadius;
      const s = smooth;

      ctx.beginPath();

      // Top-left corner
      ctx.moveTo(0, r);
      ctx.bezierCurveTo(0, r / s, r / s, 0, r, 0);

      // Top-right corner
      ctx.lineTo(width - r, 0);
      ctx.bezierCurveTo(width - r / s, 0, width, r / s, width, r);

      // Bottom-right corner
      ctx.lineTo(width, height - r);
      ctx.bezierCurveTo(
        width,
        height - r / s,
        width - r / s,
        height,
        width - r,
        height
      );

      // Bottom-left corner
      ctx.lineTo(r, height);
      ctx.bezierCurveTo(r / s, height, 0, height - r / s, 0, height - r);

      ctx.closePath();
      ctx.fill();
    }
  }
);
