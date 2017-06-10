export function launchAnimation(func) {
  let quit = false;
  let steps = 0;

  return new Promise((resolve) => {
    const f = () => {
      if (quit) {
        resolve();
      } else {
        if (__DEV__)
          setTimeout(f, 0);
        else
          requestAnimationFrame(f);
      }
      quit = !func(steps);
      steps++;
    };
    requestAnimationFrame(f);
  });
}