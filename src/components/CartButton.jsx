import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import {
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

// ─────────────────────────────────────────────────────────
// 🎯 ANIMATION (UNCHANGED)
// ─────────────────────────────────────────────────────────
function launchFlyOrb(fromEl, toEl, onDone) {
  if (!fromEl || !toEl) return;

  const fromRect = fromEl.getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();

  const startX = fromRect.left + fromRect.width / 2;
  const startY = fromRect.top + fromRect.height / 2;

  const bagTopX = toRect.left + toRect.width / 2;
  const bagTopY = toRect.top - 10;
  const bagInsideY = toRect.top + toRect.height / 2;

  const bagSize = Math.min(toRect.width, toRect.height);
  const targetScale = bagSize / fromRect.width;

  const clone = fromEl.cloneNode(true);

  clone.style.cssText = `
    position: fixed;
    left: ${fromRect.left}px;
    top: ${fromRect.top}px;
    width: ${fromRect.width}px;
    height: ${fromRect.height}px;
    z-index: 99999;
    pointer-events: none;
    border-radius: 12px;
    overflow: hidden;
    transform-origin: center;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    will-change: transform;
  `;

  document.body.appendChild(clone);

  const cpX = startX + (bagTopX - startX) * 0.5;
  const cpY = Math.min(startY, bagTopY) - 180;

  const DURATION = 1100;
  const t0 = performance.now();

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  function step(now) {
    const raw = Math.min((now - t0) / DURATION, 1);

    let currentX, currentY, scale;

    if (raw < 0.75) {
      const t = easeOutQuart(raw / 0.75);

      currentX =
        (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * cpX + t * t * bagTopX;

      currentY =
        (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * cpY + t * t * bagTopY;

      scale = 1 - t * (1 - targetScale);
    } else if (raw < 0.9) {
      currentX = bagTopX;
      currentY = bagTopY;
      scale = targetScale;
    } else {
      const t = (raw - 0.9) / 0.1;
      const gravity = smoothstep(t);

      currentX = bagTopX;
      currentY = bagTopY + (bagInsideY - bagTopY) * gravity;
      scale = targetScale * (1 - t * 0.5);
    }

    const translateX = currentX - startX;
    const translateY = currentY - startY;

    clone.style.transform = `
      translate(${translateX}px, ${translateY}px)
      scale(${scale})
    `;

    if (raw < 1) {
      requestAnimationFrame(step);
    } else {
      clone.remove();

      toEl.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.2)" },
          { transform: "scale(1)" },
        ],
        { duration: 200 },
      );

      onDone?.();
    }
  }

  requestAnimationFrame(step);
}

// ─────────────────────────────────────────────────────────
// 🛒 CART BUTTON (PREMIUM UI)
// ─────────────────────────────────────────────────────────
const CartButton = forwardRef(({ itemCount = 0 }, ref) => {
  const bagRef = useRef(null);

  useImperativeHandle(ref, () => ({
    triggerFly(fromEl, onDone) {
      launchFlyOrb(fromEl, bagRef.current, onDone);
    },
  }));

  return (
    <Link
      className="nav-action-btn"
      ref={bagRef}
      to="/cart"
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: "0",
        borderRadius: "50%",
        overflow: "visible",

        // ✨ base look
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(6px)",
        // border: "1px solid rgba(255,255,255,0.0)",

        // 🎯 transition
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px) scale(0.9)";
        e.currentTarget.style.boxShadow =
          "0 8px 20px rgba(0,0,0,0.25)";
        e.currentTarget.style.border =
          "1px solid rgba(255,255,255,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.border =
          "1px solid rgba(255,255,255,0.1)";
      }}
    >
      {/* ICON */}
      <ShoppingBag size={24} style={{ color: "#fff" }} />

      {/* 🔥 BADGE */}
      <span
        style={{
          // overflow: "visible",
          position: "absolute",
          top: "-6px",
          right: "-6px",
          minWidth: "20px",
          height: "20px",
          padding: "0 6px",
          borderRadius: "9999px",
          background: "linear-gradient(135deg, #ff6b6b, #e24b4a)",
          border: "2px solid #2a4c4b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "11px",
          fontWeight: "600",
          color: "#fff",
          letterSpacing: "0.3px",
          boxShadow: "0 0 8px rgba(226, 75, 74, 0.7)",

          // 🎯 smooth pop
          transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          transform: itemCount === 0 ? "scale(0.6)" : "scale(1)",
          opacity: itemCount === 0 ? 0 : 1,
        }}
      >
        {itemCount > 99 ? "99+" : itemCount}
      </span>
    </Link>
  );
});

export default CartButton;