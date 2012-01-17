(function ($) {
    // For setOuterWidth and setOuterHeight, it might have been more
    // appropriate to override jQuery's own outer(Width|Height) functions. But
    // they have an optional includeMargin parameter and so the API would
    // become messy. So I went with setOuter* instead, even though it is
    // inconsistent with the rest of jQuery - e.g. width(), val(), attr(), you
    // name it.
    $.fn.setOuterWidth = function (width) {
        var fluff = this.outerWidth(true) - this.width();
        this.width(width - fluff);
        return this;
    }

    $.fn.setOuterHeight = function (height) {
        var fluff = this.outerHeight(true) - this.height();
        this.height(height - fluff);
        return this;
    }
    // Propagate the 'resize' event to the body too, if it has an event handler
    // for it
    $(window).resize(function() {
        $('body').triggerHandler('resize');
    }

    $.fn.xLayout = function (layout) {
    }

})(jQuery);


