import Animation from "@/Pages/Animation.js";

export const useObserver = (
  reference,
  clippingPosition,
  movingPosition,
  appearingPosition,
) => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      let animation = new Animation([reference.current]);
      animation.animateAll(clippingPosition, movingPosition, appearingPosition);
    }
  });
  observer.observe(
    reference.current.length > 1 ? reference.current[0] : reference.current,
  );
};