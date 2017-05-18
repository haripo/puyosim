


export function launchAnimation(func) {
  let quit = false;
  let steps = 0;

  return new Promise((resolve) => {
    const f = () => {
      if (quit) {
        resolve()
      } else {
        requestAnimationFrame(f)
      }
      quit = !func(steps);
      steps++;
    };
    f()
  });
}