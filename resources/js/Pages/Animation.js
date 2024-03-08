import gsap from "gsap/all";

export default class Animation {
  animateAll = (clippingPosition, movingPosition, appearingPosition) => {
    this.elements.forEach((element) => {
      this.clippingTo.to(element, {}, clippingPosition);
      this.movingTo.to(element, {}, movingPosition);
      this.appearingTo.to(element, {}, appearingPosition);
    });
  };

  slideToRight(position) {
    this.elements.forEach((element) => {
      this.sliding.to(
        element,
        { xPercent: this.inReversingMode ? 0 : -100 },
        "<",
      );
    });
    if (this.elements.length > 1) {
      this.fadeOut.to(this.elements[this.inReversingMode ? 1 : 0], {}, "<");
      this.fadeIn.to(this.elements[this.inReversingMode ? 0 : 1], {}, position);
    }
  }

  slideToLeft(position) {
    this.elements.forEach((element) => {
      this.sliding.to(
        element,
        { xPercent: this.inReversingMode ? 0 : 100 },
        "<",
      );
    });
    if (this.elements.length > 1) {
      this.fadeOut.to(this.elements[this.inReversingMode ? 1 : 0], {}, "<");
      this.fadeIn.to(this.elements[this.inReversingMode ? 0 : 1], {}, position);
    }
  }

  animateModal = (appearingPosition, slidingPosition) => {
    this.sliding.to(
      this.elements[0],
      {
        y: "-7rem",
        onComplete: () => {
          setTimeout(() => {
            this.sliding.reverse();
            this.appearing.reverse();
          }, 2000);
        },
      },
      slidingPosition,
    );
    this.appearingTo.to(
      this.elements[0],
      {
        display: "flex",
      },
      appearingPosition,
    );
  };

  constructor(elements, inReversingMode = false, onComplete = () => {}) {
    this.defaults = {
      ease: "power3.inOut",
      duration: 1,
    };

    this.inReversingMode = inReversingMode;

    // before was 4rem?
    this.startingY = "-3rem"; //-translate-y-12

    this.sliding = gsap.timeline({
      onComplete: () => onComplete(),
      defaults: { ...this.defaults, duration: 1.5 },
    });

    this.fadeOut = gsap.timeline({
      defaults: {
        ...this.defaults,
        opacity: 0,
      },
    });

    this.fadeIn = gsap.timeline({
      defaults: {
        ...this.defaults,
        opacity: 1,
      },
    });

    this.clippingTo = gsap.timeline({
      onComplete: onComplete,
      defaults: {
        ...this.defaults,
        clipPath: this.inReversingMode
          ? "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
          : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        height: this.inReversingMode ? "0" : "auto",
      },
    });

    this.movingTo = gsap.timeline({
      onComplete: onComplete,
      defaults: {
        ...this.defaults,
        y: this.inReversingMode ? this.startingY : 0,
      },
    });

    this.appearingTo = gsap.timeline({
      onComplete: onComplete,
      defaults: {
        ...this.defaults,
        opacity: this.inReversingMode ? 0 : 1,
      },
    });

    this.elements = elements;
  }
}