define(['$', 'c'], function ($, c) {

    var Application = new c.base.Class({
        _propertys_: function () {
            var _this = this;
            this.webRoot = ''; //应用根目录
            this.head = $('head');
            this.body = $('body');
            this.viewRoot = 'view/'; //视图所在目录
            this.defaultView ='index'; //默认加载视图
            this._url=decodeURIComponent(window.location.hash.replace(/^#+/i, '')).toLowerCase()||'index'; //当前hash//decodeURIComponent() 函数可对 encodeURIComponent() 函数编码的 URI 进行解码。//replace(/^#+/i, '') 把#开头去掉
            this._index=110;    //层级
            this.request; //请求对象
            this.viewPath; //当前请求视图路径，解析request得出
            this.viewPort; //视图框架
            this.firstload=true; //是否第一次加载
            this.views = new c.base.Hash(); //views保存浏览器存储的hash
            this.curView; //当前视图
            this.move='in';
            this.interface = {
                
            }; //提供给视图访问的接口，暂时不管

            this.lastHash = '';
            this.lastFullHash = '';
            this.isChangeHash = false; //hash是否发生变化
            this.stopListening = false; //是否停止监听url变化，用于跳转时，停止监听
        },
        init: function () {
            //事件绑定
            this.bindEvent(); 
        },
        setTitle: function (title) {
            document.title = title;
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
            
            //第一次加载 就是刷新的时候启用
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
            //加载index视图（必须）
            _this.onHashChange(this.defaultView);
            //加载其他视图
            if(_this._url!='index'){
                var _url_arr=_this.arrHash(_this._url);
                for(var i=0;i<_url_arr.length;i++){
                    _this.onHashChange(_url_arr[i]);
                    if(i==(_url_arr.length-1)){
                        _this.firstload=false;
                    }
                }
            }
        },
        //解析url
        arrHash:function(hash){
            return hash.split('/');
        },
        analysisHash:function(hash){
            //分析hash
            var o=[];
            //这个对象包含 页面对应的id，切换方式，start_in/start_out, index/start_in/detail_in
            var arr1=hash.split('/');
            for(var i=0;i<arr1.length;i++){
                o[i]={};
                o[i].page=arr1[i].split('_')[0];
                o[i].way=arr1[i].split('_')[1];
            }
            return o;
        },
        //获取最后一个hash值
        getLastHash:function(hash){
            return hash.split('/')[hash.split('/').length-1];
        },
        onHashChange: function (url) {
            //有时候会停止监听
            if (!this.stopListening){
                this.request = this.parseHash(url);
                this.swichView(this.request); //！！！重要的视图加载
            }
        },
        swichView: function (request) {
            //获得当前请求视图，可能已经存在
            var view = this.views.getItem(request.viewpath);
            var lastView, curView;
            //第一次必定为空
            if (!view) {
                //直接加载视图，执行方法会返回加载好的视图
                this.loadView(request.viewpath, function (View) {
                    //第一步判断当前是否具有视图，具有则需要进行切换操作，
                    //不具有则直接加载（判断当前视图是否存在）
                    if (this.curView) {

                        //设置隐藏的是最好访问的view
                        lastView = this.curView;
                        this.lastView = lastView;
                    }
                    //层级增加
                    this._index+=1;

                    //开始加载新的view

                    this.curView = new View(request, this.interface); 
                    

                    curView = this.curView;

                    //将当前视图压入hash

                    this.views.push(request.viewpath,curView);

                    this.curView.show(this._index,this.curView.request.way);

                    this.viewPort.append(this.curView.root);

                    this.goTop();
                });
            } else {//第二次加载，当前view以及被加载过
                if (this.curView) {
                    this._index+=1;
                    lastView = this.curView;
                    this.curView = view;
                    //将当前视图装入hash，并删除之前的

                    this.views.push(request.viewpath, view, true);
                    //改变运动方式
                    if(request.viewpath=='index'||request.viewpath=='booking'||request.viewpath=='my'){
                        this.curView.request.way="in";
                    }else{
                        this.way(this.curView.request.way);
                    }
                    
                    this.curView.show(this._index,this.curView.request.way);
                    this.goTop();
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
        way:function(_way){
            switch(_way){
                case 'normal':
                    
                break;
                case 'in':
                    this.curView.request.way='out';
                break;
                case 'out':
                    this.curView.request.way='in';
                break;
            }
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
            var 
                viewpath = hash.split('_')[0]||this.defaultView,
                way=hash.split('_')[1]||"normal";//普通表示没有什么动画
                
            return {
                viewpath: viewpath,
                way:way
            };
        }
    });

    return Application;
});