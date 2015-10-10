define(['$', 'c'], function ($, c) {

    var Application = new c.base.Class({
        _propertys_: function () {
            var _this = this;
            this.webRoot = ''; //应用根目录
            this.head = $('head');
            this.body = $('body');
            this.viewRoot = 'view/'; //视图所在目录
            this.defaultView ='index'; //默认加载视图
            this._url=window.location.hash.substring(1)||'index'; //当前hash
            this._index=110;    //层级
            this.request; //请求对象
            this.viewPath; //当前请求视图路径，解析request得出
            this.viewPort; //视图框架
            this.firstload=true; //是否第一次加载
            this.views = new c.base.Hash(); //views保存浏览器存储的hash
            this.curView; //当前视图
            this.interface = {
                forward: function (url) {
                    _this.forward.call(_this, url);
                },
                back: function (url) {
                    _this.back.call(_this, url);
                },
                setTitle: function (title) {
                    _this.setTitle.call(_this, title);
                }
            }; //提供给视图访问的接口，暂时不管
            this.history = []; //历史记录

            this.lastHash = '';
            this.lastFullHash = '';
            this.isChangeHash = false; //hash是否发生变化
            this.stopListening = false; //是否停止监听url变化，用于跳转时，停止监听
        },
        init: function () {

            //事件绑定
            this.bindEvent();
            
        },
        back: function (url) {
            //函数作用？
            var referrer = this.lastUrl();
            if (url && (!referrer || referrer.indexOf(url) == -1)) {
                window.location.hash = url;
            } else {
                window.history.back(); 
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
        //！！！！！！非常重要哦！！！！！！
        bindEvent: function () {
            var _this = this;
            requirejs.onError = function (e) {
                if (e && e.requireModules) {
                    for (var i = 0; i < e.requireModules.length; i++) {
                        console.error((e.requireModules[i] || '').replace(self.viewRootPath, '') + '页面不存在!');
                    }
                }
            };

            window.location.hash = this._url;
            
            //第一次加载
            _this.firstLoad();

            $(window).bind('hashchange', function () {
                if(_this.firstload){
                    //第一次加载不需监控
                    _this.firstload=false;
                }else{
                    _this._url=_this.getLastHash(window.location.hash.substring(1));
                    _this.onHashChange(_this._url);
                }
            });

        },
        firstLoad:function(){
            var _this=this;
            //加载index视图
            _this.onHashChange(this.defaultView);
            //加载其他视图
            if(_this._url!='index'){
                var _url_arr=_this._url.split('/');
                for(var i=0;i<_url_arr.length;i++){
                    _this.onHashChange(_url_arr[i]);
                }
            }
        },
        //获取最后一个hash值
        getLastHash:function(hash){
            return hash.split('/')[hash.split('/').length-1];
        },
        onHashChange: function (url) {
            this.history.push(window.location.href);
            //有时候会停止监听
            if (!this.stopListening) {
                
                //decodeURIComponent() 函数可对 encodeURIComponent() 函数编码的 URI 进行解码。
                //replace(/^#+/i, '') 把#开头去掉
                url = url || decodeURIComponent(window.location.hash.replace(/^#+/i, '')).toLowerCase();
                url = url.replace(/^#+/i, '');
                this.request = this.parseHash(url);
                this.viewPath = this.request.viewpath || this.defaultView;
                this.swichView(this.viewPath); //！！！重要的视图加载
            }
        },
        swichView: function (viewPath) {
            //获得当前请求视图，可能已经存在
            var view = this.views.getItem(viewPath);
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
                        this.lastView = lastView;
                        this.lastView.hide();
                    }
                    //层级增加
                    this._index+=1;
                    //开始加载新的view

                    this.curView = new View(this.request, this.interface);

                    curView = this.curView;
                    //将当前视图压入hash
                    this.views.push(viewPath, curView);
                    //呈现当前视图，并会调用onCreate与onShow事件与onLoad
                    this.curView.show(this._index);

                    this.viewPort.append(this.curView.root);

                    this.goTop();
                });
            } else {//第二次加载，当前view以及被加载过

                if (this.curView && this.curView != view) {
                    this._index+=1;
                    lastView = this.curView;
                    lastView.hide();
                    this.curView = view;
                    //将当前视图装入hash，并删除之前的
                    this.views.push(viewPath, view, true);
                    this.curView.leftin();
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
            var _this = this;
            var path = this.buildUrl(viewPath);
            requirejs([path], function (View) {
                callback && callback.call(_this, View);
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
        //该方法?
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