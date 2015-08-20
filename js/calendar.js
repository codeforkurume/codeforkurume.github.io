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
        // その月の長さ
        this.day_long = new Date(this.year, this.month - 1, 0).getDate();
    }

    Calendar.prototype.render = function (element, area) {
        var calendar_element = Utility.html("table", {class: 'calendar'}),
            trash_list = area.trash;
        // 0-index
        var trash_day_list = new Array(this.day_long);
        for (var i = 0; i < trash_day_list.length; i++) {
            trash_day_list[i] = [];
        }

        trash_list.forEach(function(trash) {
            for(var i = 0; i < trash.dayList.length; i++) {
                var day = trash.dayList[i];
                if (day.getFullYear() != this.getYear() || day.getMonth() + 1 != this.getMonth()) {
                    continue;
                }
                trash_day_list[day.getDate() - 1].push(trash.name)
            }
        }.bind(this));

        var beginning_of_month = new Date(this.year, this.month -1, 1),
            end_of_month = new Date(this.year, this.month, 0);
        var _ = Utility;
        var row = _.html("tr", {});
        for (var day = 0; day < 7; day++) {
            var diff = day - beginning_of_month.getDay();
            var val = [], date = null;
            if (diff >= 0) {
                val = trash_day_list[diff];
                date = new Date(this.year, this.month - 1, diff + 1);
            }
            row.appendChild(createCalendarDayElement(val, date));
        }
        calendar_element.appendChild(row);

        var flg = false,
            first_date = 8 - beginning_of_month.getDay();
        for (var week = 1; ; week++) {
            if (flg) break;
            // 日曜から土曜まで
            row = _.html("tr", {});
            for (var day = 0; day < 7; day++) {
                var val = [], date = null;
                if (flg || first_date >= this.day_long) {
                    flg = true;
                    val = [];
                    date = null;
                } else {
                    val = trash_day_list[first_date - 1];
                    date = new Date(this.year, this.month - 1, first_date);
                }
                row.appendChild(createCalendarDayElement(val, date));
                first_date++;
            }
            calendar_element.appendChild(row);
        }
        element.append($(calendar_element));
    };

    function createCalendarDayElement(trash_list, date) {
        var option = {};
        if (date != null) {
            option['data-date'] = date.getDate();
        }
        var ret = Utility.html("ul", {});
        trash_list.forEach(function (trash_day) {
            var dom = Utility.html("li", {});
            dom.innerHTML = trash_day;
            ret.appendChild(dom);
        });
        return Utility.html('td', option, ret);
    }

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
