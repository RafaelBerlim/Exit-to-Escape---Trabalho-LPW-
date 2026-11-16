$(function () {
    const $menuItems = $(".menu-item");

    $menuItems.on("mouseenter focusin", function () {
        $(this).addClass("is-selected");
    });

    $menuItems.on("mouseleave focusout", function () {
        $(this).removeClass("is-selected");
    });

    $(".btn").on("click", function (event) {
        const destination = $(this).attr("href");

        if (!destination || destination === "#") {
            event.preventDefault();
            return;
        }

        const $item = $(this).closest(".menu-item");
        $item.addClass("is-selected");

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        event.preventDefault();
        $("body").addClass("screen-flicker");

        window.setTimeout(function () {
            window.location.href = destination;
        }, 180);
    });

    window.setInterval(function () {
        if (document.hidden || Math.random() > 0.16) {
            return;
        }

        $("body").addClass("screen-flicker");

        window.setTimeout(function () {
            $("body").removeClass("screen-flicker");
        }, 180);
    }, 4200);
});
