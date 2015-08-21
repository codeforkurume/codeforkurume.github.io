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
        var calendar_element = Utility.html("table", {class: 'calendar'});

        var data = getCalendarData(area.trash, this.year, this.month);
        var height = window.innerHeight / data.length;
        data.forEach(function (row) {
            var tr = Utility.html("tr", {style: "height: " + height + "px;"});
            row.forEach(function (col) {
                tr.appendChild(col);
            });
            calendar_element.appendChild(tr);
        });

        element.append($(calendar_element));
    };

    function getCalendarData(trash_list, year, month) {
        // 0-index
        var day_long = new Date(year, month - 1, 0).getDate();
        var trash_day_list = new Array(day_long);
        for (var i = 0; i < trash_day_list.length; i++) {
            trash_day_list[i] = [];
        }
        trash_list.forEach(function(trash) {
            for(var i = 0; i < trash.dayList.length; i++) {
                var day = trash.dayList[i];
                if (day.getFullYear() != year || day.getMonth() + 1 != month) {
                    continue;
                }
                trash_day_list[day.getDate() - 1].push(trash.name)
            }
        }.bind(this));

        var beginning_of_month = new Date(year, month -1, 1);
        var ret = [];

        ret.push((function() {
            var row = [];
            for (var day = 0; day < 7; day++) {
                var diff = day - beginning_of_month.getDay();
                var val = [], date = null;
                if (diff >= 0) {
                    val = trash_day_list[diff];
                    date = new Date(year, month - 1, diff + 1);
                }
                row.push(createCalendarDayElement(val, date));
            }
            return row;
        })());

        var flg = false,
            first_date = 8 - beginning_of_month.getDay();
        for (var week = 1; ; week++) {
            if (flg) break;
            // 日曜から土曜まで
            ret.push((function() {
                var row = [];
                for (var day = 0; day < 7; day++) {
                    var val = [], date = null;
                    if (flg || first_date >= day_long) {
                        flg = true;
                        val = [];
                        date = null;
                    } else {
                        val = trash_day_list[first_date - 1];
                        date = new Date(year, month - 1, first_date);
                    }
                    row.push(createCalendarDayElement(val, date));
                    first_date++;
                }
                return row;
            })());
        }
        return ret;
    }

    function createCalendarDayElement(trash_list, date) {
        var option = {};
        option.style = "width: " + (window.innerWidth / 7) + "px;";
        var date_label = Utility.html('h4');
        if (date != null) {
            option['data-date'] = date.getDate();
            date_label.innerHTML = date.getDate();
        }
        var ret = Utility.html("ul", {});
        trash_list.forEach(function (trash_day) {
            var dom = Utility.html("li", {});
            dom.innerHTML = trash_day;
            ret.appendChild(dom);
        });
        return Utility.html('td', option,
            date_label,
            ret);
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
