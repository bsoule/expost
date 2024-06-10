import { Window } from "happy-dom";
import memoize from "./memoize.js";

const { error } = console;

console.error = (...args: unknown[]) => {
  if (String(args[0]).includes("Failed to load external script")) return;
  error(...args);
};

const getDom = memoize((html: string) => {
  const window = new Window({
    settings: {
      disableJavaScriptFileLoading: true,
      disableJavaScriptEvaluation: true,
      disableCSSFileLoading: true,
      disableIframePageLoading: true,
      disableComputedStyleRendering: true,
    },
  });

  window.document.body.innerText = html;

  return window;
});

export default getDom;
