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

        var data = this.getCalendarData(area.trash);
        var height = window.innerHeight / data.length;
        var that = this;
        data.forEach(function (row) {
            var tr = Utility.html("tr", {style: "height: " + height + "px;"});
            row.forEach(function (col) {
                // col.dateが自然数の場合だけ8月になる
                var col_elm = createCalendarDayElement(col.trash, new Date(that.year, that.month - 1, col.date), that.month);
                tr.appendChild(col_elm);
            });
            calendar_element.appendChild(tr);
        });

        element.append($(calendar_element));
    };

    Calendar.prototype.getCalendarData = function(trash_list) {
        var ret = [],
            trash_day_list = this.getTrashList(trash_list);

        var beginning_of_month = new Date(this.year, this.month - 1, 1);

        var flg = false,
            first_date = 8 - beginning_of_month.getDay();
        for (var week = 0; week < 6; week++) {
            var push_data = [], day;
            if (flg) break;
            for (day = 0; day < 7; day++) {
                var insertion_value = {},
                    val = [], date = 0;
                if (week == 0) {
                    var diff = day - beginning_of_month.getDay();
                    // dateは日付なので1-index
                    insertion_value.date = diff + 1;
                    if (diff >= 0) {
                        val = trash_day_list[diff];
                    }
                    insertion_value.trash = val;
                    push_data.push(insertion_value);
                }
                else {
                    if (flg || first_date > this.day_long) {
                        flg = true;
                    } else {
                        val = trash_day_list[first_date - 1];
                        date = first_date;
                    }
                    insertion_value = {date: date, trash: val};
                    push_data.push(insertion_value);
                    first_date++;
                }
            }
            ret.push(push_data);
        }
        return ret;
    };

    /*
     * ごみのデータと，月の長さから，その日のゴミのデータを配列で一月分返す関数
     */
    Calendar.prototype.getTrashList = function (trash_list) {
        var trash_day_list = new Array(this.day_long);
        for (var i = 0; i < trash_day_list.length; i++) {
            trash_day_list[i] = [];
        }
        trash_list.forEach(function (trash) {
            for (var i = 0; i < trash.dayList.length; i++) {
                var day = trash.dayList[i];
                if (day.getFullYear() != this.year || day.getMonth() + 1 != this.month) {
                    continue;
                }
                trash_day_list[day.getDate() - 1].push(trash.name)
            }
        }.bind(this));
        return trash_day_list;
    };

    function createCalendarDayElement(trash_list, date, month) {
        var option = {};
        option.style = "width: " + (window.innerWidth / 7) + "px;";
        var date_label = Utility.html('h4');
        if (date.getMonth() + 1 == month) {
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
