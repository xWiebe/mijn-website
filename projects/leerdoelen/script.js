const boxes = document.querySelectorAll(".box");

boxes.forEach((box) => {
  const images = box.querySelectorAll(".content img");

  images.forEach((image) => {
    image.addEventListener("click", (event) => {
      event.stopPropagation();
      image.classList.toggle("expanded");
    });
  });

  box.addEventListener("click", () => {
    box.classList.toggle("expanded");
  });
});
