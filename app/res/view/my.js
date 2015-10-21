define(['$', '_', 'b', 'v','i', getViewPath('my')], function ($, _, b, v,i, html) {
    var View = b.Class(v.PageView, {
        _propertys_: function () {
            this.template = html;
            this.url = ''; //获取首页文章
            this.is=null;
        },
        init: function (superInit, request, interface) {
            superInit(request, interface);
        },
        createHtml: function () {
            return this.template;
        },
        attrs: {
            'data-id': 'my',
            className: 'page my'
        },
        events: {
            
        },
        onCreate: function () {
        },
        //dom创建后数据加载时执行，用于加载后执行我们的逻辑
        onLoad: function () {
            $.get(this.url, function (data) {

                var s = '';
            });
        },
        //dom创建后，未显示
        onShow: function (z) {
            var _this=this;
            _this.is = new IScroll('#my-content', { mouseWheel: true, tap: true,click: true });
            setTimeout(function(){
                _this.root.removeClass('r-next view in');
            },500);
        },
        //dom隐藏前
        onHide: function () {
        }
    });

    return View;
});