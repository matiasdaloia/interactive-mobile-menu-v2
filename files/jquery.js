module.exports = `
jQuery(".matias-navigation__upperMenuSlider")
  .find(".slick-slide")
  .on("click", function () {
    $(".matias-navigation__upperMenuSlider").slick("slickPrev");
  });

// Function to hide the menu when X is clicked
jQuery(".matias-navigation__logoCloseMobile").click(function () {
  $(".matias-navigation").toggleClass("hide");
  $("html").removeClass("shifter-open");
  $("body").removeClass("shifter-open");
  $(".js-mobile-nav-toggle").attr("aria-expanded", "false");
  $(".js-mobile-nav-toggle").removeClass("mobile-nav--close");
  $(".js-mobile-nav-toggle").addClass("mobile-nav--open");
});

// Function to add class with numbering to each slick using data-content-index and also add event listener to scale and show/hide content on click
jQuery(document).ready(function addCurrentSlideNumber() {
  $(".link").each(function () {
    const contentIndex = $(this).data("contentIndex"); //find the index based on data-slick-index attribute
    $(this).addClass("no-active" + contentIndex); // add no-activeX class

    // add on click event listener to show/hide content
    $(".no-active" + contentIndex).click(function () {
      $(".link").css({ transform: "unset" });
      $(".accordion-content").hide();
      $(".accordion-content1" + contentIndex).show();
      $(".no-active" + contentIndex).css({ transform: "scale(1.24)" });
    });
  });
});

jQuery(document).ready(function () {
  $(".accordion-row").addClass("animate__animated animate__fadeInLeft");
  $(".js-mobile-nav-toggle").click(function () {
    $(".matias-navigation").toggleClass("hide");
    $("body").addClass("shifter-open");
    $("html").addClass("shifter-open");
    $(".mobile-nav").remove();
  });
});
`;
