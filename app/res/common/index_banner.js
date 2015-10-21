define(['jquery'],function($){
	function Banner(){
		this.settings={
			iNow:0,
			iX:0,
			num:0,
			timer:null,
			autotime:2000,
			_w:$(window).width(),
			_h:$(window).height(),
			tStart:{x:0,y:0},
            tMove:{x:0,y:0},
            tEnd:{x:0,y:0},
            tTouch:{x:0,y:0}
		};
		
	}

	Banner.prototype.init=function(ele,opt){
		this.ele=$(ele);
		$.extend(true,this.settings,opt);
		this._set();
	}
	Banner.prototype._set=function(){
		var _this=this;
		_this.oBt=_this.ele.find('.index-banner-btn'),_this.oTi=_this.oBt.find('li'),_this.oUl=_this.ele.find('.index-banner-img'),_this.oLi=_this.oUl.find('li');
		_this.settings.num=_this.oLi.length;
		_this.oUl.width(_this.settings.num*_this.settings._w);
		_this.oLi.width(_this.settings._w)
	    _this.oBt.width(15*_this.settings.num).css({'margin-left':-(15*_this.settings.num)/2});
	    _this.oTi.eq(_this.settings.iNow).addClass('active');
	    _this._change();
	}

	Banner.prototype._change=function(){
		var _this=this;

		_this.oUl[0].addEventListener('touchstart',function(ev){
			_this._start(ev);
		},false);
		_this.oUl[0].addEventListener('touchmove',function(ev){
			_this._move(ev);
		},false);
		_this.oUl[0].addEventListener('touchend',function(ev){
			_this._end(ev);
		},false);

		_this._auto();//自动滚动


	}
	Banner.prototype._start=function(ev){
		var _this=this;
		_this.oUl[0].style.transition="none";
		ev=ev.changedTouches[0];
		_this.settings.tStart.x=ev.pageX;
		_this.settings.tMove.x=_this.settings.iX;
		clearInterval(_this.settings.timer);
	}
	Banner.prototype._move=function(ev){
		var _this=this;
		ev=ev.changedTouches[0];
		var iDis=ev.pageX-_this.settings.tStart.x;
		_this.settings.iX=_this.settings.tMove.x+iDis;
		_this.oUl[0].style.WebkitTransform=_this.oUl[0].style.transform="translateX("+_this.settings.iX+"px)";
	}

	Banner.prototype._end=function(){
		var _this=this;
		_this.settings.iNow=_this.settings.iX/_this.settings._w;
		_this.settings.iNow=-Math.round(_this.settings.iNow);
		if(_this.settings.iNow<0)
		{
			_this.settings.iNow=0;
		}
		if(_this.settings.iNow>_this.settings.num-1)
		{
			_this.settings.iNow=_this.settings.num-1;
		}
		_this._tab();
		_this._auto();
	}

	Banner.prototype._auto=function(){
		var _this=this;
		_this.settings.timer=setInterval(function(){
			_this.settings.iNow++;	
			_this.settings.iNow=_this.settings.iNow%_this.settings.num;
			_this._tab();
		},_this.settings.autotime);
	}
	Banner.prototype._tab=function(){
		var _this=this;
		_this.settings.iX=-_this.settings.iNow*_this.settings._w;
		_this.oUl[0].style.transition="0.5s";
		_this.oUl[0].style.WebkitTransform=_this.oUl[0].style.transform="translateX("+_this.settings.iX+"px)";
		_this.oTi.removeClass('active');
		_this.oTi.eq(_this.settings.iNow).addClass('active');
	}

	$.fn.extend({
		banner:function(opt){
			var b=new Banner();
			return b.init(this,opt);
		}
	});

	return Banner	
});
