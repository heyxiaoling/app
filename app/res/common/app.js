define(['$', 'c'], function ($, c) {

    var Application = new c.base.Class({
        _propertys_: function () {
            var scope = this;
            this.webRoot = ''; //应用跟目录
            this.head = $('head');
            this.body = $('body');
            this.viewRoot = 'view/'; //视图所在目录
            this.defaultView = 'addr'; //默认加载视图

            this.request; //请求对象
            this.viewPath; //当前请求视图路径，解析request得出
            this.mainFrame; //主框架
            this.viewPort; //视图框架
            this.stateDom; //状态栏

            this.views = new c.base.Hash(); //views保存浏览器存储的hash
            this.curView; //当前视图
            this.interface = {
                forward: function (url) {
                    scope.forward.call(scope, url);
                },
                back: function (url) {
                    scope.back.call(scope, url);
                },
                setTitle: function (title) {
                    scope.setTitle.call(scope, title);
                }

            }; //提供给视图访问的接口，暂时不管
            this.history = []; //历史记录

            this.lastHash = '';
            this.lastFullHash = '';
            this.isChangeHash = false; //hash是否发生变化
            this.stopListening = false; //是否停止监听url变化，用于跳转时，停止监听
        },
        init: function (opts) {
            console.log('app init');
            //为属性赋值
            opts = opts || {};
            for (var k in opts) {
                this[k] = opts[k];
            }
            this.createViewPort();
            this.bindEvent(); //事件绑定
            //将页面导向初始页
            this.forward(this.defaultView);
        },
        forward: function (url, replace) {
            var scope = this;
            url = url.toLowerCase();
            this.stopListen();
            if (replace) {
                window.location.replace(('#' + url).replace(/^#+/, '#'));
            } else {
                window.location.href = ('#' + url).replace(/^#+/, '#');
            }
            scope.stopListening = false;
            this.onHashChange(url);
        },
        back: function (url) {
            var referrer = this.lastUrl();
            if (url && (!referrer || referrer.indexOf(url) == -1)) {
                window.location.hash = url;
            } else {
                window.history.back(); //???
            }
        },
        setTitle: function (title) {
            document.title = title;
        },
        lastUrl: function () {
            if (this.history.length < 2) {
                return document.referrer;
            } else {
                return this.history[this.history.length - 2];
            }
        },
        //创建app页面基本框架，此处不能使用id，因为。。。
        createViewPort: function () {
            var htm = [
                ''
            ].join('');
            this.mainframe = $(htm);
            this.viewPort = this.mainframe.find('.main-viewport');
            this.stateDom = this.mainframe.find('.main-state');
            this.body.append(this.mainframe);
        },
        //！！！！！！非常重要哦！！！！！！
        bindEvent: function () {
            var scope = this;
            requirejs.onError = function (e) {
                if (e && e.requireModules) {
                    for (var i = 0; i < e.requireModules.length; i++) {
                        console.error((e.requireModules[i] || '').replace(self.viewRootPath, '') + '页面不存在!');
                    }
                }
            };
            $(window).bind('hashchange', function () {
                scope.onHashChange.call(scope);
            });
        },
        onHashChange: function (url) {
            this.history.push(window.location.href);
            //有时候会停止监听
            if (!this.stopListening) {
                url = url || decodeURIComponent(window.location.hash.replace(/^#+/i, '')).toLowerCase();
                url = url.replace(/^#+/i, '');
                this.request = this.parseHash(url);
                this.viewPath = this.request.viewpath || this.defaultView;
                this.swichView(this.viewPath); //！！！重要的视图加载
            }
        },
        swichView: function (viewPath) {
            //获得当前请求视图，可能已经存在
            var view = this.views.getItem[viewPath];
            var lastView, curView;
            //第一次必定为空
            if (!view) {
                //直接加载视图，执行方法会返回加载好的视图
                this.loadView(viewPath, function (View) {
                    //第一步判断当前是否具有视图，具有则需要进行切换操作，
                    //不具有则直接加载（判断当前视图是否存在）
                    if (this.curView) {
                        //设置隐藏的是最好访问的view
                        lastView = this.curView;
                        //this.views.each(function (k, v) {
                        //  v.hide();
                        //});
                        this.lastView = lastView;
                        this.lastView.hide();
                    }

                    //开始加载新的view
                    this.curView = new View(this.request, this.interface);

                    curView = this.curView;
                    //将当前视图压入hash

                    this.views.push(viewPath, curView);
                    //呈现当前视图，并会调用onCreate与onShow事件与onLoad
                    this.curView.show();

                    this.viewPort.append(this.curView.root);

                    this.goTop();
                });
            } else {//第二次加载，当前view以及被加载过
                //若是当前视图存在（话说必须存在！！！）

                if (this.curView && this.curView != view) {
                    lastView = this.curView;
                    lastView.hide();
                    this.curView = view;
                    //将当前视图装入hash，并删除之前的
                    this.views.push(viewPath, view, true);

                    this.curView.show();
                    //                    this.viewPort.append(this.curView.root);
                    this.goTop();
                } else {
                    //若是视图没变，但是后面参数有变化
                    if (this.isChangeHash) {
                        this.curView.show();
                        this.goTop();
                    }
                }
            }
        },
        //!!!非常重要
        loadView: function (viewPath, callback) {
            var scope = this;
            var path = this.buildUrl(viewPath);

            requirejs([path], function (View) {
                callback && callback.call(scope, View);
            });
        },
        buildUrl: function (path) {
            return this.viewRoot + path;
        },
        stopListen: function () {
            this.stopListening = true;
        },
        //回到顶部
        goTop: function (sec) {
            sec = sec || 10;
            $('body,html').animate({ scrollTop: 0 }, sec);
        },
        //该方法慢慢看吧。。。
        parseHash: function (hash) {
            var fullhash = hash,
                hash = hash.replace(/([^\|]*)(?:\|.*)?$/img, '$1'),
                h = /^([^?&|]*)(.*)?$/i.exec(hash),
                vp = h[1] ? h[1].split('!') : [],
                viewpath = (vp.shift() || '').replace(/(^\/+|\/+$)/i, ''),
                path = vp.length ? vp.join('!').replace(/(^\/+|\/+$)/i, '').split('/') : [],
                q = (h[2] || '').replace(/^\?*/i, '').split('&'),
                query = {}, y;
            this.isChangeHash = !!(!this.lastHash && fullhash === this.lashFullHash) || !!(this.lastHash && this.lastHash !== hash);
            if (q) {
                for (var i = 0; i < q.length; i++) {
                    if (q[i]) {
                        y = q[i].split('=');
                        y[1] ? (query[y[0]] = y[1]) : (query[y[0]] = true);
                    }
                }
            }

            this.lastHash = hash;
            this.lashFullHash = fullhash;
            return {
                viewpath: viewpath,
                path: path,
                query: query,
                root: location.pathname + location.search
            };
        }
    });

    return Application;
});