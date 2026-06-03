:root {
  color: #f8f2ea;
  background: #05070d;
  font-family: Inter, "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background:
    radial-gradient(circle at 18% 8%, rgba(255, 93, 120, .18), transparent 26%),
    radial-gradient(circle at 82% 4%, rgba(0, 194, 203, .16), transparent 30%),
    radial-gradient(circle at 54% 32%, rgba(255, 220, 90, .10), transparent 24%),
    linear-gradient(180deg, #05070d 0%, #091014 52%, #14120f 100%);
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input {
  font: inherit;
}
