const header = document.querySelector(".site-header");
const canvas = document.querySelector("#systemsCanvas");
const ctx = canvas.getContext("2d");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector("#contactForm");
const formNote = document.querySelector("#formNote");

const nodes = [
  { x: 0.18, y: 0.24, r: 9, color: "#1251a3", label: "data" },
  { x: 0.36, y: 0.16, r: 6, color: "#0f766e", label: "eval" },
  { x: 0.55, y: 0.27, r: 10, color: "#bd7d10", label: "llm" },
  { x: 0.77, y: 0.19, r: 7, color: "#a43b31", label: "api" },
  { x: 0.24, y: 0.52, r: 8, color: "#0f766e", label: "rag" },
  { x: 0.48, y: 0.55, r: 13, color: "#1251a3", label: "agent" },
  { x: 0.72, y: 0.55, r: 8, color: "#0f766e", label: "aws" },
  { x: 0.35, y: 0.78, r: 7, color: "#a43b31", label: "ops" },
  { x: 0.62, y: 0.82, r: 9, color: "#bd7d10", label: "ship" },
];

const links = [
  [0, 1],
  [1, 2],
  [2, 3],
  [0, 4],
  [4, 5],
  [5, 6],
  [3, 6],
  [4, 7],
  [7, 8],
  [5, 8],
  [2, 5],
];

function sizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function point(node, width, height, tick) {
  const drift = Math.sin(tick * 0.0016 + node.x * 10) * 9;
  const lift = Math.cos(tick * 0.0013 + node.y * 10) * 7;
  return {
    x: node.x * width + drift,
    y: node.y * height + lift,
  };
}

function draw(tick = 0) {
  const rect = canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
  ctx.fillRect(0, 0, width, height);

  links.forEach(([from, to], index) => {
    const a = point(nodes[from], width, height, tick);
    const b = point(nodes[to], width, height, tick);
    const pulse = (Math.sin(tick * 0.002 + index) + 1) / 2;
    ctx.strokeStyle = `rgba(16, 24, 32, ${0.14 + pulse * 0.16})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();

    const px = a.x + (b.x - a.x) * pulse;
    const py = a.y + (b.y - a.y) * pulse;
    ctx.fillStyle = "rgba(16, 24, 32, 0.5)";
    ctx.beginPath();
    ctx.arc(px, py, 2.4, 0, Math.PI * 2);
    ctx.fill();
  });

  nodes.forEach((node) => {
    const current = point(node, width, height, tick);
    ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
    ctx.beginPath();
    ctx.arc(current.x, current.y, node.r + 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.arc(current.x, current.y, node.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "700 12px JetBrains Mono, monospace";
    ctx.fillStyle = "rgba(16, 24, 32, 0.7)";
    ctx.textAlign = "center";
    ctx.fillText(node.label, current.x, current.y + node.r + 24);
  });

  requestAnimationFrame(draw);
}

function updateHeader() {
  header.dataset.elevated = window.scrollY > 12 ? "true" : "false";
}

function sendContactMessage(event) {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name")?.toString().trim() || "Portfolio visitor";
  const email = formData.get("email")?.toString().trim() || "";
  const message = formData.get("message")?.toString().trim() || "";
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

  window.location.href = `mailto:prashantmisraai@gmail.com?subject=${subject}&body=${body}`;

  if (formNote) {
    formNote.textContent = "Opening your email app now. If it does not open, use the email button beside it.";
  }
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

window.addEventListener("resize", sizeCanvas);
window.addEventListener("scroll", updateHeader, { passive: true });
contactForm?.addEventListener("submit", sendContactMessage);

sizeCanvas();
updateHeader();
revealItems.forEach((item) => revealObserver.observe(item));
requestAnimationFrame(draw);
