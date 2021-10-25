module.exports = `<nav class='matias-navigation hide'>
<div class='matias-navigation__logo'>
    <a href='/'>
        <img src='{{ logo | img_url }}' alt='logo'/>
    </a>
</div>
<div class='matias-navigation__logoCloseMobile'>
    <img alt='close' src='https://cdn.shopify.com/s/files/1/0165/1887/3152/t/31/assets/close_mobile.png?v=2825400362796858655'/>
</div>
<div class='matias-navigation__upperMenu'>
    <ul class='matias-navigation__upperMenuSlider'>
        {% for link in linklists.mobile-menu.links %}

            {%- assign outerLoopIndex = forloop.index -%}
            {%- assign contentIndex = 1 | append: outerLoopIndex -%}
            {%- assign collection = collections[link.handle] -%}

            <li class='link' data-content-index={{ outerLoopIndex }}>
                <img src='{{ collection.image | img_url: 'medium' }}' alt='{{ collection.title }}'/>
                <span>
                    <a href='#'>{{ link.title }}</a>
                </span>
            </li>
        {%- endfor -%}
    </ul>
</div>
{% for link in linklists.mobile-menu.links %}
    {%- assign outerLoopIndex = forloop.index -%}
    {%- assign contentIndex = 1 | append: outerLoopIndex -%}
    <div class='accordion-content accordion-content{{ contentIndex }}' role='navigation'>
        {% for childlink in link.links %}

            {% assign childLinkHandle = childlink.handle %}
            {% assign collection = collections[childLinkHandle] %}

            <div class='accordion-row'>
                <a href='{{ collection.url }}'>{{ collection.title }}</a>
                <a href='{{ collection.url}}'>
                    <img src='{{ collection.image | img_url: 'medium' }}'/>
                </a>
            </div>
        {% endfor %}

    </div>
{%- endfor -%}
</nav>
<script>
    $(".matias-navigation__upperMenuSlider").slick({
        dots: false,
        infinite: false,
        arrows: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: "60px",
        focusOnSelect: true,
        variableWidth: true,
        variableHeight: true,
    });
  
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

</script>

`;
