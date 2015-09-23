define(['jquery'],function($){
	function Msg(){
		this.msg=null;
		this.mask=null;
		this.settings={
			ele:null,
            title:'',
            type:'confirm',
            text :'',
            btnOkText : 'Ok',
            btnNoText : 'Cancel',
            mask : true,
            sure_close:true,
            auto_close:false,
            success:function(){},
            failed:function(){}
		};
	}
	Msg.prototype.init=function(options){
		var _this=this;
		$.extend(true,_this.settings,options);
		this.alertMsg();
	}

	Msg.prototype.alertMsg=function(){
		if($("div[name=mask]").length!=0||$("div[name=MsgDialog]").length!=0||$("div[name=loadstate]").length!=0){
            return false;
        }
        var dH=$(document).height(),wH=$(window).height(),sH=$(window).scrollTop(),bd=$('body');
        var oMask="<div class='mask' id='mask' name='mask' style='background:#000; opacity:0.36;display:block;overflow:hidden;position:fixed; left:0px; top:0px; width:100%; z-index:999; height:"+(wH+sH)+"px' ></div>";
        var msg="<div name='alertMsgDialog' class='msg' id='msg' style='position:fixed; z-index:1000;'></div>";
        
        //遮罩
        if(this.settings.mask){
            bd.append(oMask);
        }

        bd.append(msg);

        this.msg=$('#msg');
        this.mask=$('#mask');
        
        switch(this.settings.type){
            case "confirm":
                //确认框
                this.confirm();
                break;
            case "alert":
                //警告框
                this._alert();
                break;
            default:
                //文本编辑框
               	this._text();
                break;
        }
	}
	Msg.prototype.setstyle=function(){
		//设置弹出框居中
        var msgW = this.msg.width();
        var msgH = this.msg.height();
        this.msg.width($(window).width()-20).css({'top':($(window).height()-msgH)/2});
	}
	Msg.prototype._success=function(){
		var _this=this;
        _this.msg.find('.btnok').on('click',function(event){

            var event=event||window.event;
            if(event.stopPropagation){
                event.stopPropagation();
            }else{
                event.cancelBulle=true;
            }
            if(_this.settings.success && typeof(_this.settings.success) === 'function'){
                _this.settings.success(_this.msg,_this.mask);
            }
            if(_this.settings.sure_close){
                setTimeout(function(){
                    _this._hide();
                },300);
            }
        });
        
	}
	Msg.prototype._sure=function(){
		var _this=this;
		_this.msg.find('.sure').on('click',function(event){
            var event=event||window.event;
            if(event.stopPropagation){
                event.stopPropagation();
            }else{
                event.cancelBulle=true;
            }
            if(_this.settings.success && typeof(_this.settings.success) === 'function'){
               _this.settings.success(_this.msg,_this.mask);
            }
            setTimeout(function(){
                _this._hide();
            },300);
        });
	}
	Msg.prototype._failed=function(){
		var _this=this;
		_this.msg.find('.btnno').on('click',function(event){
            var event=event||window.event;
            if(event.stopPropagation){
                event.stopPropagation();
            }else{
                event.cancelBulle=true;
            }
            if(_this.settings.failed && typeof(_this.settings.failed) === 'function'){
                _this.settings.failed(_this.msg,_this.mask,_this._hide);
            }
            setTimeout(function(){
                _this._hide();
            },300);
        });
	}

	Msg.prototype.confirm=function(){
		var oConfirm="<div class='msg-content'><p>"+this.settings.text+"</p></div>"
            +"<div class='msg-btn'><button type='button'class='btnok' >"+this.settings.btnOkText+"</button><button type='button' class='btnno'>"+this.settings.btnNoText+"</button></div>";
        this.msg.append(oConfirm);
        this.setstyle();
        this._success();
        this._failed();
	}
	Msg.prototype._alert=function(){
		var oSure = "<div class='msg-content'><p>"+this.settings.text+"</p></div><div class='msg-btn'><button type='button' class='sure'>"+this.settings.btnOkText+"</button></div>";
        this.msg.append(oSure);
        this.setstyle();
        this._sure();
	}
	Msg.prototype._text=function(){
		var oText = "<div class='msg-header'>"+this.settings.title+"</div><div class='msg-content'><input type='text' value='' class='set-text' ></div>"
            +"<div class='msg-btn'><button type='button'class='btnok' >"+this.settings.btnOkText+"</button><button type='button' class='btnno'>"+optthis.settingsions.btnNoText+"</button></div>";
        this.msg.append(oText);
        this.setstyle();
        this._success();
        this._failed();
        this._text_box();
	}
	Msg.prototype._text_box=function(){
		var _this=this;
		$(window).keydown(function(event){
          if(event.keyCode==13) {
                if(_this.settings.success && typeof(_this.settings.success) === 'function'){
                    options.sucess(_this.msg,_this.mask);
                }
                setTimeout(function(){
	                _this._hide();
	            },300);
          }
        });
	}
	Msg.prototype._hide=function(){
        this.mask.remove();
        this.msg.remove();
        this.canmove();
	}
	Msg.prototype.nomove=function(){
		var _this=this;
		document.addEventListener('touchmove',function(event){
			_this.move(event);
		},false);
		bd.eq(0).css("overflow","hidden");
	}
	Msg.prototype.move=function(evnet){
		var event=event||window.event;
        event.preventDefault();
        event.cancelBubble = true;
	}
	Msg.prototype.canmove=function(){
		var _this=this;
		document.removeEventListener('touchmove',function(event){
			_this.move(event);
		},false);
        $("body").eq(0).css("overflow","auto");
	}

	$.extend({
		msg:function(options){
			var msg=new Msg();
			return msg.init(options);
		}
    });

	return {
		msg:Msg
	}

});