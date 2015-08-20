var Calendar;
Calendar = (function () {
    function Calendar(year, month) {
        var now = new Date();
        this.year = now.getFullYear();
        this.month = now.getMonth() + 1;
        if (year) {
            this.year = year;
        }
        if (month) {
            this.month = month;
        }
    }

    Calendar.prototype.render = function (element, trash) {
        var calendar_element = Utility.html("div", {class: 'calendar'});
        element.appendChild(calendar_element);
    };

    Calendar.prototype.setYear = function (year) {
        this.year = parseInt(year);
    };

    Calendar.prototype.setMonth = function (month) {
        this.month = parseInt(month);
    };

    Calendar.prototype.getYear = function () {
        return this.year;
    };

    Calendar.prototype.getMonth = function () {
        return this.month;
    };

    return Calendar;
})();
