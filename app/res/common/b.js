define([], function () {

    var base = {}; //base
    var slice = [].slice;
    var indexOf = function (k, arr) {
        if (!arr) {
            return -1;
        }
        //若是对象本身便居然indexof，便使用自身的，比如字符串
        if (arr.indexOf) {
            return arr.indexOf(k);
        }
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] == k) {
                return i;
            }
        }
        return -1;
    };

    base.Class = function (s, c) {
        //若是传了第一个类，便继承之；否则实现新类
        //s 
        //c 属性
        if (typeof s === 'object') {
            c = s;
            s = function () { };
        }

        //var supProto = s.prototype;
        //n 新类
        var n = function () {
            this._propertys_ && this._propertys_();
            this.init && this.init.apply(this, arguments);
        };
        n.prototype = new s();

        var supInit = n.prototype.init || function () { };
        var childInit = c.init || function () { };
        var _supAttr = n.prototype._propertys_ || function () { };
        var _childAttr = c._propertys_ || function () { };

        for (var k in c) {
            //_propertys_中作为私有属性
            c.hasOwnProperty(k) && (n.prototype[k] = c[k]);
        }

        //继承的属性有可能重写init方法
        if (arguments.length && arguments[0].prototype && arguments[0].prototype.init === supInit) {
            //重写新建类，初始化方法，传入其继承类的init方法
            n.prototype.init = function () {
                var scope = this;
                var args = [function () {
                    supInit.apply(scope, arguments);
                } ];
                childInit.apply(scope, args.concat(slice.call(arguments)));
            };
        }

        //内部属性赋值
        n.prototype._propertys_ = function () {
            _supAttr.call(this);
            _childAttr.call(this);
        };

        //成员属性
        for (var k in s) {
            s.hasOwnProperty(k) && (n[k] = s[k]);
        }
        return n;
    };

    base.Hash = base.Class({
        _propertys_: function () {
            this.keys = [];
            this.values = [];
        },
        init: function (obj) {
            (typeof obj == 'object') || (obj = {}); //???
            for (var k in obj) {
                if (obj.hasOwnProperty(k)) {
                    this.keys.push(k);
                    this.values.push(obj[k]);
                }
            }
        },
        length: function () {
            return this.keys.length;
        },
        getItem: function (k) {
            var index = indexOf(k, this.keys);
            if (index < 0) {
                return null;
            }
            return this.keys[index];
        },
        getKey: function (i) {
            return this.keys[i];
        },
        getValue: function (i) {
            return this.values[i];
        },
        add: function (k, v) {
            return this.push(k, v);
        },
        del: function (k) {
            var index = indexOf(k, this.keys);
            return this.delByIndex(index);
        },
        delByIndex: function (index) {
            if (index < 0) return this;
            this.keys.splice(index, 1);
            this.vaules.splice(index, 1);
            return this;
        },
        //移除栈顶hash，并返回
        pop: function () {
            if (!this.keys.length) return null;
            this.keys.pop();
            return this.values.pop();
        },
        push: function (k, v, order) {
            if (typeof k == 'object' && !v) {
                for (var i in k) {
                    if (k.hasOwnProperty(i)) {
                        this.push(i, k[i], order);
                    }
                }
            } else {
                var index = indexOf(k, this.keys);
                if (index < 0 || order) {
                    if (order) this.del(k);
                    this.keys.push[k];
                    this.values.push[v];
                } else {
                    this.values[index] = v;
                }
            }
        },
        //查找hash表，返回key
        indexOf: function (v) {
            var index = indexOf(v, this.vaules);
            if (index >= 0) {
                return this.keys[index];
            }
            return -1;
        },
        each: function (handler) {
            if (typeof handler == 'function') {
                for (var i = 0, len = this.length(); i < len; i++) {
                    handler.call(this, this.keys[i], this.vaules[i]);
                }
            }
        },
        getObj: function () {
            var obj = {};
            for (var i = 0, len = this.length(); i < len; i++) {
                obj[this.keys[i]] = this.values[i];
            }
            return obj;
        }
    });

    base.Date = new base.Class({
        init: function (d) {
            d = d ? new Date(d) : new Date();
            this.date = d;
        },
        //添加小时等自己扩展
        addDay: function (d) {
            d = d || 0;
            this.date.setDate(this.date.getDate() + d);
        },
        addSeconds: function (n) {
            n = n || 0;
            this.date.setSeconds(this.date.getSeconds() + n);
            return this;
        },
        getDate: function () {
            return this.date;
        },
        format: function (format) {
            typeof format != 'string' && (format = '');
            for (var k in this.MAPS) {
                format = this.MAPS[k].call(this, format, this.date, k);
            }
            return format;
        },
        MAPS: {
            D: function (str, date, k) {
                var d = date.getDate().toString();
                d.length < 2 && (d = '0' + d);
                return str.replace(new RegExp(k, 'mg'), d);
            },
            d: function (str, date, k) {
                return str.replace(new RegExp(k, 'mg'), date.getDate());
            },
            M: function (str, date, k) {
                var d = (date.getMonth() + 1).toString();
                d.length < 2 && (d = '0' + d);
                return str.replace(new RegExp(k, 'mg'), d);
            },
            m: function (str, date, k) {
                return str.replace(new RegExp(k, 'mg'), (date.getMonth() + 1));
            },
            Y: function (str, date, k) {
                return str.replace(new RegExp(k, 'mg'), date.getFullYear());
            },
            y: function (str, date, k) {
                return str.replace(new RegExp(k, 'mg'), date.getYear());
            },
            H: function (str, date, k) {
                var d = date.getHours().toString();
                d.length < 2 && (d = '0' + d);
                return str.replace(new RegExp(k, 'mg'), d);
            },
            h: function (str, date, k) {
                return str.replace(new RegExp(k, 'mg'), date.getHours());
            },
            I: function (str, date, k) {
                var d = date.getMinutes().toString();
                d.length < 2 && (d = '0' + d);
                return str.replace(new RegExp(k, 'mg'), d);
            },
            i: function (str, date, k) {
                return str.replace(new RegExp(k, 'mg'), date.getMinutes());
            }, 
            S: function (str, date, k) {
                var d = date.getSeconds().toString();
                d.length < 2 && (d = '0' + d);
                return str.replace(new RegExp(k, 'mg'), d);
            },
            s: function (str, date, k) {
                return str.replace(new RegExp(k, 'mg'), date.getSeconds());
            }
        }
    });

    return base;

});