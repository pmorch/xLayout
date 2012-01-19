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

    // In the layout of a particular element, there are either rows or columns. 
    //
    // If we're looking at rows, the 'A' direction is vertical. We're concerned
    // with heights, and in the 'B' direction, we're concerned with widths.
    //
    // For columns, it is the opposite. the 'A' direction is horizontal
    // (widths) and the 'B' direction is vertical (heights)
    //
    // That allows us to use the same algorithms for rows and columns.
    $.fn.xLayout = function (layout) {
        var here = layout.id && layout.id === "outerMain";

        var sizeA,     sizeB,
            outerA,    outerB,
            setOuterA, setOuterB,
            startA,    startB,
            endA,
            dimA,      dimB,
            minA,      minB;

        var elementArray, i, subElement;

        if (layout.rows) {
            outerA    = 'outerHeight';
            outerB    = 'outerWidth';
            setOuterA = 'setOuterHeight';
            setOuterB = 'setOuterWidth';
            startA    = 'top';
            startB    = 'left';
            endA      = 'bottom';
            dimA      = 'height';
            dimB      = 'width';
            minA      = 'minHeight';
            minB      = 'minWidth';
            elementArray = layout.rows;
        } else if (layout.columns) {
            outerA    = 'outerWidth';
            outerB    = 'outerHeight';
            setOuterA = 'setOuterWidth';
            setOuterB = 'setOuterHeight';
            startA    = 'left';
            startB    = 'top';
            endA      = 'right';
            dimA      = 'width';
            dimB      = 'height';
            minA      = 'minWidth';
            minB      = 'minHeight';
            elementArray = layout.columns;
        }

        function getFraction(size) {
            if (! size) {
                return null;
            }
            var matches;
            if (matches = size.match(/^(\d+)%$/)) {
                return parseInt(matches[1]) / 100;
            } else {
                return null;
            }
        }

        sizeA = this[dimA]();
        sizeB = this[dimB]();

        function getPxInt(px) {
            var matches;
            if (px === "") {
                return 0;
            } else if (matches = px.match(/^(\d+)px$/)) {
                return parseInt(matches[1]);
            } else {
                throw ("Expected (px) to be '<number>px' or '' here");
            }
        }

        // First calculate how much of sizeA is already allocated. Store that
        // in staticA.
        var staticA = 0;

        // For two divs that are below each other, both margins are not
        // applied, only the largest one.
        var prevMargin = 0;

        var fraction, subElementA;
        for (i = 0 ; i < elementArray.length; i++) {
            subElement = elementArray[i];
            if (! subElement['$']) {
                subElement['$'] = $('#' + subElement['id']);
            }

            // For some reason that I don't yet understand, rows behave
            // differently than columns
            if (layout.rows) {
                // The margins of rows are not both applied - only the largest
                // one.
                var newMargin =
                    getPxInt(subElement['$'].css('margin-' + startA));
                staticA += (newMargin > prevMargin) ? newMargin : prevMargin;
                prevMargin = getPxInt(subElement['$'].css('margin-' + endA));
            } else {
                // The margins of columns are both applied
                staticA +=
                    getPxInt(subElement['$'].css('margin-' + startA)) +
                    getPxInt(subElement['$'].css('margin-' + endA));
            }
            staticA +=
                getPxInt(subElement['$'].css('border-' + startA + '-width'));
            staticA += getPxInt(subElement['$'].css('padding-' + startA));
            if (! subElement[outerA]) {
                staticA += getPxInt(subElement['$'].css(dimA));
            }
            staticA += getPxInt(subElement['$'].css('padding-' + endA));
            staticA +=
                getPxInt(subElement['$'].css('border-' + endA + '-width'));
        }
        staticA += prevMargin;

        // Now, if some of the elements have a minHeight/Width, then fudge
        // the staticA appropriately, so that the remaining elements resize
        // properly in the remaining height/width.
        var remainingA = sizeA - staticA;
        for (i = 0 ; i < elementArray.length; i++) {
            subElement = elementArray[i];
            fraction = getFraction(subElement[outerA]);
            if (fraction) {
                subElementA = fraction * remainingA;
                if (subElement[minA] &&
                    subElementA < subElement[minA]) {
                    staticA += (subElement[minA] - subElementA)*1/fraction;
                }
            }
        }
        remainingA = sizeA - staticA;

        // Layout the guys
        for (i = 0 ; i < elementArray.length; i++) {
            subElement = elementArray[i];
            fraction = getFraction(subElement[outerA]);
            if (fraction) {
                subElementA = fraction * remainingA;
                if (subElement[minA] &&
                    subElementA < subElement[minA]) {
                    subElementA = subElement[minA];
                }
                subElement['$'][dimA](subElementA);
            }
            if (subElement[outerB]) {
                fraction = getFraction(subElement[outerB]);
                if (fraction) {
                    var subElementB = fraction * sizeB;
                    if (layout[minB] && subElementB < layout[minB]) {
                        subElementB = layout[minB];
                    }
                    subElement['$'][setOuterB](subElementB);
                }
            }
        }

        // Layout any subElements
        for (i = 0 ; i < elementArray.length; i++) {
            subElement = elementArray[i];
            if (subElement['rows'] || subElement['columns']) {
                subElement['$'].xLayout(subElement);
            }
        }
    }
})(jQuery);
