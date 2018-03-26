$(function() {
    // String对象方法增强
    if (!''.contains) {
        String.prototype.contains = function(sequence) {
            return -1 < this.indexOf(sequence);
        };
    }

    if (![].contains) {
        Array.prototype.contains = function(element) {
            for (var idx = 0, len = this.length; idx < len; ++idx) {
                if (this[idx] === element) {
                    return true;
                }
            }
            return false;
        };
    }

    // 获取document节点，并清空custom命令空间上的所有事件（防止重复绑定）
    var $doc = $(document).off('.custom');
    // 为所有复选框绑定事件
    $doc.on('click.custom', '.ec-checkbox:not(.disable)', function() {
        var $this = $(this);
        // 由于当前Dom元素的disable class可能是在事件绑定结束后，
        // 被脚本修改加上的，所以此处还是需要判断当前Dom元素是否处于不可用状态
        if ($this.hasClass('disable') || $this.hasClass('read-only')) {
            return;
        }
        $this.toggleClass('checked changed');
    });
    // 为table 标题中的复选框绑定全选功能事件。
    $doc.on('click.custom', 'table th .ec-checkbox:not(.disable)', function() {
        // 当同一个Dom元素绑定多个相同类型的事件时，
        // 触发该类型的事件会按照绑定顺序顺序执行所绑定的回调函数，
        // 所以，执行到此回调函数时，此复选框已经完成了勾选/去勾选状态的改变
        var $this = $(this),
            $parent = $this.closest('table'),
            $selector = $parent.find('td .ec-checkbox').not('.disable');

        // 由于当前Dom元素的disable class可能是在事件绑定结束后，
        // 被脚本修改加上的，所以此处还是需要判断当前Dom元素是否处于不可用状态
        if ($this.hasClass('disable')) {
            return;
        }
        if ($this.hasClass('checked')) {
            $selector.addClass('checked');
        } else {
            $selector.removeClass('checked');
        }
    });
    // 为table body体中的复选框绑定级联事件，即
    // table body体中所有可用的复选框都被勾选时，级联更新使全选复选框也处于勾选状态
    // table body体中所有可用的复选框只要有1个处于去勾选状态，级联更新使全选复选框也处于去勾选状态
    $doc.on('click.custom', 'table td .ec-checkbox:not(.disable)', function() {
        // 当同一个Dom元素绑定多个相同类型的事件时，
        // 触发该类型的事件会按照绑定顺序顺序执行所绑定的回调函数，
        // 所以，执行到此回调函数时，此复选框已经完成了勾选/去勾选状态的改变
        var $this = $(this),
            $parent = $this.closest('table'),
            // th 中的复选框具有全选功能
            $allSelector = $parent.find('th .ec-checkbox'),
            $selector = $parent.find('td .ec-checkbox').not('.disable'),
            $uncheckedSelector = $selector.not('.checked');
        // 由于当前Dom元素的disable class可能是在事件绑定结束后，
        // 被脚本修改加上的，所以此处还是需要判断当前Dom元素是否处于不可用状态
        if ($this.hasClass('disable')) {
            return;
        }
        // 若全选复选框处于不可用状态，则无需级联更新
        if ($allSelector.hasClass('disable')) {
            return;
        }
        if (0 === $uncheckedSelector.length) {
            $allSelector.addClass('checked');
        } else {
            $allSelector.removeClass('checked');
        }
    });

    // 使用data-link属性，进行页面跳转
    $doc.on('click', '[data-link]', function(e) {
        if (chartCircle) {
            clearTimeout(chartCircle);
            chartCircle = undefined;
        }
        if (timer) {
            clearInterval(timer);
            timer = undefined;
        }
        if (destroyUcdWidgets) {
            destroyUcdWidgets();
        }

        var $this = $(this),
            link = $this.attr('data-link'),
            param = $this.attr('data-param'),
            urlReg = /\.sraction/i;
        if (param) {
          //  param = JSON.parse(param.replace(/'/g, '"'));
           param = JSON.parse(param);
        }
        if (urlReg.test(link)) {
            $(".frame-right-side").empty();
            if ($('.frame-right-side').siblings('.loading-tire').length < 1) {
                $('.frame-right-side').before('<div class="loading-tire"><i class="face"></i><i class="balls"></i><i class="balls"></i><i class="balls"></i></div>');
            }
            if ($('.frame-left-side').css('display') == 'none') {
                $('.loading-tire').css('left', '50%');
            }
            $(".frame-right-side")
                .empty()
                .load(link, param, function() {
                    $(".frame-right-side").css('visibility', 'hidden');
                    setTimeout(function() {
                        $('.loading-tire').remove();
                        $(".frame-right-side").css('visibility', 'visible');
                    }, 1);
                });
        } else {
            link = link.toLowerCase();
            switch (true) {
                case (link === 'dashboard'):
                    // 各级Portal 首页菜单项对应的id不同。但同一时间只有1个首页菜单项存在。
                    $("#menu-hostHome,#menu-spHome,#menu-corpHome,#menu_userHome").click();
                    break;
                default:
                    break;
            }
        }
        if ($(this).hasClass("icon-template")) {
            $(".frame-left-side").hide();
            $(".frame-right-side").css("left", "0");
        }
    });
        $(document).keydown(function(e) {
        var ev = e || window.event;
        var target = ev.target || ev.srcElement; // 这个可以处理firefox兼容性问题
        if (ev.keyCode == 8) {
            if (target.tagName.toUpperCase() != "INPUT" && target.tagName.toUpperCase() != "TEXTAREA" && target.tagName.toUpperCase() != "TEXT") {
                ev.preventDefault();
            }
        }
    });
    $(".pop-close").bind("click", function() {
        $("#mask_layer").hide();
        $("#mask_layer_cxsub").hide();
        $(this).parent().hide();
    });

    $(".pop-close-btn").bind("click", function() {
        $("#mask_layer").hide();
        $(this).parent().parent().hide();
    });

    $doc.off("click","#common-returnToLogin").on("click","#common-returnToLogin",function(){
    	logout();
    });
    
    // 初始化批量删除弹窗的拖拽事件与“确定”按钮点击事件
    // 批量分配设备失败详细信息弹出框“确定”按钮点击事件
    // 本文件在main.jsp的最后加载，此时页面元素都已经加载完毕
    // 批量删除弹窗在common.jsp中，id="mes-error"
    function initErrorMsgPop() {
        var moveable = true;

        function drag(_move, _popwin) {
            _move[0].addEventListener("mousedown", function(e) {
                e.preventDefault();
                e.stopPropagation();
                moveable = true;

                var diffX = e.clientX - _popwin[0].offsetLeft;
                var diffY = e.clientY - _popwin[0].offsetTop;
                if (typeof _popwin[0].setCapture != 'undefined') {
                    _popwin[0].setCapture();
                }
                document.addEventListener("mousemove", mousemove);

                function mousemove(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!moveable) {
                        return;
                    }
                    var left = e.clientX - diffX;
                    var top = e.clientY - diffY;
                    if (left < 0) {
                        left = 0;
                    } else if (left > getInner().width - _popwin[0].offsetWidth) {
                        left = getInner().width - _popwin[0].offsetWidth;
                    }
                    if (top < 0) {
                        top = 0;
                    } else if (top > getInner().height - _popwin[0].offsetHeight) {
                        top = getInner().height - _popwin[0].offsetHeight;
                    }
                    _popwin[0].style.left = left + 'px';
                    _popwin[0].style.top = top + 'px';
                }
                document.addEventListener("mouseup", mouseup);

                function mouseup(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    moveable = null;
                    document.removeEventListener("mousemove", mousemove);
                    document.removeEventListener("mouseup", mouseup);
                    // 配合上面的setCapture
                    if (typeof _popwin[0].releaseCapture != 'undefined') {
                        _popwin[0].releaseCapture();
                    }
                }
            });
        }

        // 跨浏览器获取视口大小
        function getInner() {
            if (typeof window.innerWidth != 'undefined') {
                return {
                    width: window.innerWidth,
                    height: window.innerHeight
                };
            } else {
                return {
                    width: document.documentElement.clientWidth,
                    height: document.documentElement.clientHeight
                };
            }
        }

        if ($('#mes-error-drag').length > 0 && $('#mes-error').length > 0) {
            drag($('#mes-error-drag'), $('#mes-error'));
        }

        $('#mes-error .close').off('click.closeErrorPop').on('click.closeErrorPop', function() {
            $('#mes-error #pop-close-btn').trigger('click');
        });
        resetPopPosition($('#mes-error'));
        $('#assign-error .close').off('click.closeErrorPop').on('click.closeErrorPop', function() {
            $('#assign-error #pop-close-btn').trigger('click');
        });
    }
    initErrorMsgPop();

    reloadImage();

    /**
     * [resetPopPosition 重置弹出框位置]
     * @param  {[jquery对象]} $popbox [要重置弹出窗的jquery对象]
     * @return {[type]}         [description]
     */
    function resetPopPosition($popbox) {
        var options = {};
        options.width = $popbox.width();
        options.height = $popbox.height();

        var left_offset = (window.innerWidth - options.width) / 2;
        var top_offset = (window.innerHeight - options.height) / 2;
        $popbox.css({
            'left': left_offset + 'px',
            'top': top_offset + 'px'
        });
    }
}); //End of $(function(){ ... })

var UPORTAL = {};
$(function(win, doc, $) {
    UPORTAL.RegExp = {};
    UPORTAL.RegExp.Date = /^(\d+)[-/](\d+)[-/](\d+)(\s+(\d+)([:](\d+)([:](\d+))?)?)?$/;

    UPORTAL.getDatetimeOfYear = function(date) {
        /^(\d+)[-/](\d+)[-/](\d+)(\s+(\d+)([:](\d+)([:](\d+))?)?)?$/.test(date);
        return Date.UTC(RegExp.$1);
    };

    UPORTAL.getDatetimeOfMonth = function(date) {
        /^(\d+)[-/](\d+)[-/](\d+)(\s+(\d+)([:](\d+)([:](\d+))?)?)?$/.test(date);
        return Date.UTC(RegExp.$1, RegExp.$2);
    };

    UPORTAL.getDatetimeOfDay = function(date) {
        /^(\d+)[-/](\d+)[-/](\d+)(\s+(\d+)([:](\d+)([:](\d+))?)?)?$/.test(date);
        return Date.UTC(RegExp.$1, RegExp.$2, RegExp.$3);
    };

    UPORTAL.getDatetimeOfHour = function(date) {
        /^(\d+)[-/](\d+)[-/](\d+)(\s+(\d+)([:](\d+)([:](\d+))?)?)?$/.test(date);
        return Date.UTC(RegExp.$1, RegExp.$2, RegExp.$3, RegExp.$5);
    };

    UPORTAL.getDatetimeOfMinute = function(date) {
        /^(\d+)[-/](\d+)[-/](\d+)(\s+(\d+)([:](\d+)([:](\d+))?)?)?$/.test(date);
        return Date.UTC(RegExp.$1, RegExp.$2, RegExp.$3, RegExp.$5, RegExp.$7);
    };

    UPORTAL.getDatetimeOfSecond = function(date) {
        /^(\d+)[-/](\d+)[-/](\d+)(\s+(\d+)([:](\d+)([:](\d+))?)?)?$/.test(date);
        return Date.UTC(RegExp.$1, RegExp.$2, RegExp.$3, RegExp.$5, RegExp.$7, RegExp.$9);
    };

    /**
     * 为控件绑定事件监听，并阻止短时间内事件的重复触发
     * @param {Object} options 参数对象
     * @detail {jQuery selector} parentTargetSelector 父元素选择器 非必填
     * @detail {jQuery selector} targetSelector 元素选择器
     * @detail {String} eventType 事件类型
     * @detail {Object} data 事件参数对象
     * @detail {Function} onEventTrigger 事件回调函数
     * @detail {Number} timeSegment 事件间隔
     */
    function PreventRepeatHandler(options) {

        var CLICK_COUNTER = 'click-counter';

        this._options = $.extend(true, {
            parentTargetSelector: undefined,
            targetSelector: undefined,
            eventType: 'click',
            data: undefined,
            onEventTrigger: null,
            timeSegment: 500
        }, options);

        var _parent = this._options.parentTargetSelector;
        var _target = this._options.targetSelector;
        var _event = this._options.eventType;
        var _data = this._options.data;
        var _onEvent = this._options.onEventTrigger;
        var _timeSegment = this._options.timeSegment;
        var _callback = function(event) {
            event.preventDefault();
            // eventType事件触发计数器
            var counter = $target.attr(CLICK_COUNTER);
            // 计数器数值大于0，
            // eventType事件在规定时间内已经被触发过
            //  不允许重复点击
            if (0 < counter) {
                return;
            }

            if (_onEvent && $.isFunction(_onEvent)) {
                _onEvent.call(this, event, _data);
                // 事件触发以后，计数器做加1操作
                $target.attr(CLICK_COUNTER, ++counter);
                // timeSegment以后清空计数器，使事件可以再次触发
                setTimeout(function() {
                    $target.attr(CLICK_COUNTER, '0');
                }, _timeSegment);
            }
        };

        var $target = $(_target);
        // 计数器初始化为0
        $target.attr(CLICK_COUNTER, 0);
        if (_parent) {
            // 事件监听绑定在父元素之上
            $(_parent).on(_event, _target, _callback);
        } else {
            // 事件鉴定绑定在元素本身上
            $target.on(_event, _callback);
        }
    }

    /**
     * 将搜索框container转换成可擦除数据的搜索框
     * @param {jQuery selector}   container 搜索框选择器
     * @param {Function} callback  擦除数据后执行的回调函数
     */
    function ErasableInput(container, callback) {
        var ERROR_UNKNOWCONTAINER = 'UnknowContainer';
        var isMouseOn = false;

        var _container = container;
        if (isBlank(_container)) {
            throw ERROR_UNKNOWCONTAINER;
        }
        var _$container = $(_container);

        var _$deleteIcon = _$container.find('.delete-value');
        var _$input = _$container.find('input').on('propertychange input keyup', function(e) {
            var $this = $(this);
            var content = $this.val();
            if (!isBlank(content) && isMouseOn) {
                _showDeleteIcon();
            } else {
                _hideDeleteIcon();
            }
        });
        if (0 === _$deleteIcon.length) {
            _$deleteIcon = $('<div class="delete-value">');
            _$input.after(_$deleteIcon);
        }

        _$container.hover(function(e) {
            isMouseOn = true;
            var iptContent = _$input.val();
            if (!isBlank(iptContent)) {
                _showDeleteIcon();
            }
        }, function(e) {
            isMouseOn = false;
            _hideDeleteIcon();
        }).on('click', '.delete-value', function(e) {
            _$input.val('');
            _$container.find('.search-tip').show();
            _hideDeleteIcon();
            callback.call(_$input, e);
        });

        function _showDeleteIcon() {
            _$deleteIcon.show();
            _$input.addClass('pr40');
        }

        function _hideDeleteIcon() {
            _$deleteIcon.hide();
            _$input.removeClass('pr40');
        }
    }
    UPORTAL.PreventRepeatHandler = PreventRepeatHandler;
    UPORTAL.ErasableInput = ErasableInput;

    UPORTAL.Observer = {
        subscribers: [],
        subscribe: function(subject, fn) {
            // 若观察者从未订阅过subject主题，则需创建消息订阅列表
            if (!this.subscribers[subject]) {
                this.subscribers[subject] = [];
            }
            // 将订阅消息加入消息订阅列表
            this.subscribers[subject].push(fn);
        },
        unsubscribe: function(subject, fn) {
            var fns = this.subscribers[subject];
            if (!fns) {
                return;
            }
            if (!fn) {
                // 若未传入特定回调函数（订阅消息的处理行为），则清空整个消息订阅列表
                this.subscribers[subject] = [];
            } else {
                // 若已传入特定回调函数（订阅消息的处理行为），则将该函数从消息订阅列表中移除
                this.subscribers[subject] = fns.filter(function(_fn) {
                    return _fn !== fn;
                });
            }
        },
        update: function() {
            var subject = Array.prototype.shift.call(arguments);
            if (!subject) {
                return;
            }
            var fns = this.subscribers[subject];
            if (!fns || 0 === fns.length) {
                return;
            }
            for (var idx = 0, len = fns.length; idx < len; ++idx) {
                fns[idx].apply(this, arguments);
            }
        }
    };
}(window, document, jQuery)); // End of  Immediate Functions: $(function(){ ... })

/**
 * 发送数据类型为HTML的Ajax请求
 * @param {Object} settings 请求参数
 */
function requestHtml(settings) {
    var validate = settings.validate,
        data = settings.data,
        success = settings.success,
        fail = settings.fail,
        error = settings.error,
        isLoding = settings.loding;

    if (validate && !validate()) {
        return;
    }

    if ($.isFunction(data)) {
        data = data(settings.param);
    }

    if (isLoding) {
        $(".loading-frame").addClass("appear");
        $(".loading-gif-con").addClass("appear");
    }
    $.ajax({
        type: settings.type || 'POST',
        url: settings.url,
        data: data,
        async: settings.async || false,
        dataType: 'html',
        timeout: 450000,
        success: function(html) {
            if (!html) {
                showErrorPop($("#error").val(), $("#failed").val());
                return;
            }

            if (isSessionTimeOut(html)) {
                renderRightSide(html);
                return;
            } else if (isNoRight(html)) {
                if (fail) {
                    fail(html, settings.param);
                } else {
                    showErrorPop($("#error").val(), $("#common-noRightError").val());
                }
                return;
            } else if (is404Page(html)) {
                if (fail) {
                    fail(html, settings.param);
                    return;
                }
            }
            var $target = $(settings.targetSelector).empty().html(html);
            var errorMessage = $target.find("#error-message").val();
            if (!isBlank(errorMessage)) {
                showErrorPop($("#error").val(), errorMessage);
                return;
            }
            if (success) {
                success(html, settings.param);
            }

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (error) {
                error(XMLHttpRequest, settings.param);
            } else {
                if ($(".loading-tire")) {
                    $(".loading-tire").remove();
                }
                var pageNotExit = $("#main-page-notExit").val(),
                $content404 = $("<div class='content-error'><div class='pageerror'></div></div>");
	            $content404.append("<p class='page-notExit'>" + pageNotExit + "</p>");
	            $content404.append("<p class='u-btn returnToLogin' id='common-returnToLogin'>"+ $("#main-returnToLoginButton").val() +"</p>");
                setTimeout(function() {
                    $(".frame-right-side").html($content404).css('visibility', 'visible');
                }, 1);
            }
        },
        complete: function(XMLHttpRequest, status) {
            if (isLoding) {
                $(".loading-frame").removeClass("appear");
                $(".loading-gif-con").removeClass("appear");
            }
        }
    });
}

/**
 * 更新分页信息
 * @param  {jQuery Object} widget     分页控件
 * @param  {Number} pageIndex  页码
 * @param  {Number} total      总记录数
 * @param  {jQuery selector} emptyPage  空状态页面的选择器
 * @param  {Boolean} isEmptyCondition  查询条件是否为空
 * @param  {jQuery selector} targetPage 查询结果显示区域的选择器
 * @return {Function}            Function
 */
function updatePaging(widget, pageIndex, total, emptyPage, isEmptyCondition, targetPage) {
    var container = widget._settings.container;
    pageIndex = convertToNumber(pageIndex);
    total = convertToNumber(total);
    widget.setSelection(pageIndex, null);
    widget.setTotal(total);
    if (0 >= total) {
        if (undefined === isEmptyCondition || isEmptyCondition) {
            $(emptyPage).show();
            $(targetPage).hide();
        } else {
            $(emptyPage).hide();
            $(targetPage).show();
        }
        $(container).hide();
    } else {
        $(emptyPage).hide();
        $(targetPage).show();
        $(container).show();
    }
}

/**
 * 发送数据类型为Json格式的Ajax请求
 * @param {Object} settings 请求参数
 */
function requestJson(settings) {
    var validate = settings.validate,
        param = settings.param,
        data = settings.data,
        success = settings.success,
        successResults = settings.successResults || ['success'],
        fail = settings.fail,
        error = settings.error,
        isLoding = settings.loding;

    if (validate && !validate()) {
        // showErrorPop($("#error").val(), $("#invalidParam").val());
        return;
    }

    if ($.isFunction(data)) {
        data = data(param);
    }

    if (isLoding) {
        $(".loading-frame").addClass("appear");
        $(".loading-gif-con").addClass("appear");
    }

    $.ajax({
        type: settings.type || 'POST',
        url: settings.url,
        data: data,
        async: settings.async || false,
        dataType: 'json',
        timeout: 450000,
        success: function(msg) {
            if (!msg) {
                return;
            }

            if (msg.text && -1 === $.inArray(msg.text, successResults)) {
                if (isLoding) {
                    $(".loading-frame").removeClass("appear");
                    $(".loading-gif-con").removeClass("appear");
                }
                if (fail) {
                    fail(msg, param);
                } else {
                    showErrorPop($("#error").val(), msg.text);
                }
            } else {
                if (success) {
                    success(msg, param);
                }
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            $(".loading-frame").removeClass("appear");
            $(".loading-gif-con").removeClass("appear");
            var html = XMLHttpRequest.responseText;
            if (isSessionTimeOut(html)) {
                renderRightSide(html);
            } else if (isNoRight(html)) {
                showErrorPop($("#error").val(), $("#common-noRightError").val());
            } else if (is404Page(html)){
            	$(".loading-tire").remove();
                var pageNotExit = $("#main-page-notExit").val(),
                    $content404 = $("<div class='content-error'><div class='pageerror'></div></div>");
                $content404.append("<p class='page-notExit'>" + pageNotExit + "</p>");
                $content404.append("<p class='u-btn returnToLogin' id='common-returnToLogin'>"+ $("#main-returnToLoginButton").val() +"</p>");
                setTimeout(function() {
                    $(".frame-right-side").html($content404).css('visibility', 'visible');
                }, 1);
            } else{
                if (error) {
                    error(XMLHttpRequest, param);
                } else {
                    showErrorPop($("#error").val(), $("#failed").val());
                }
            }
        },
        complete: function(XMLHttpRequest, textStatus) {
            if (isLoding) {
                $(".loading-frame").removeClass("appear");
                $(".loading-gif-con").removeClass("appear");
            }
        }
    });
}

/**
 * 阻止事件短时间内重复触发
 * @param  {JQuery}   context  上下文
 * @param  {Function} callback 回调函数
 * @return {Function}            Function
 */
function preventRepeatHandler(context, callback) {
    if (callback) {
        var $this = $(context).prop('disabled', true);

        callback();

        setTimeout(function() {
            $this.prop('disabled', false);
        }, 500);
    }
}

/**
 * 根据html内容判断是否超时
 * @param {DOM} html html内容
 * @return {Boolean} 判断结果
 */
function isSessionTimeOut(html) {
    if (html && (-1 !== html.toString().indexOf('pop-sessiontimeoutSelf'))) {
        sessionStorage.setItem("hasTopnoteShow", "no"); // 登陆后顶部浏览器版本提示是否显示
        return true;
    }
    return false;
}

/**
 * 根据html内容判断是否无权限
 * @param  {DOM}  html html内容
 * @return {Boolean}      判断结果
 */
function isNoRight(html) {
    return (html && (-1 !== html.toString().indexOf('pop-noRightSelf')));
}

/**
 * 判断后台返回的html片段是否为404页面
 * @param  {DOM} html html内容
 * @return {Boolean}      判断结果
 */
function is404Page(html) {
    if (html && (-1 !== html.toString().indexOf('content-error'))) {
        return true;
    }
    return false;
}

/**
 * 更新主内容
 * @param {DOM} html 待更新的内容
 */
function renderRightSide(html) {
    $('.frame-right-side').empty().html(html);
}

/**
 * 获取页面元素的value值，并去除value值前后的空白符
 * @param {[type]} selector 页面元素选择器
 * @return {String} 元素value值
 */
function getElementValue(selector) {
    return $.trim($(selector).val());
}

/**
 * 获取页面元素的text内容，并去除text内容前后的空白符
 * @param {[type]} selector 页面元素选择器
 * @return {String} 元素text内容
 */
function getElementText(selector) {
    return $.trim($(selector).text());
}

/**
 * 获取页面元素的key-value值，并去除key-value值前后的空白符
 * @param {[type]}selector 页面元素选择器
 * @return {String} 元素key-value值
 */
function getElementKeyValue(selector) {
    return $.trim($(selector).attr('key-value'));
}

/**
 * 对str进行html编码。作用：HTML 实体会编码。例如：< 会被编码成&lt;
 * @param  {String} str 待编码的字符串
 * @return {String}     编码后的字符串
 */
function escapeHtml(str) {
    return $('<span>').text(str).html().toString();
}

/**
 * 对str进行html解码
 * @param  {String} str 待解码的字符串
 * @return {String}     解码后的字符串
 */
function unescapeHtml(str) {
    return $('<span>').html(str).text().toString();
}

/**
 * 获取页面元素经过HTML编码的value内容
 * @param  {String} selector 页面元素选择器
 * @return {String}          元素value内容
 */
function getEscapedValue(selector) {
    return escapeHtml(getElementValue(selector));
}

/**
 * 获取页面元素经过HTML编码的text内容
 * @param  {String} selector 页面元素选择器
 * @return {String}          元素text内容
 */
function getEscapedText(selector) {
    return escapeHtml(getElementText(selector));
}

/**
 * 获取页面元素经过HTML编码的attr属性值
 * @param  {String} selector 页面元素选择器
 * @return {String}          元素attr属性值
 */
function getEscapedAttr(selector, attr) {
    return escapeHtml($.trim($(selector.attr(attr))));
}

/**
 * 获取页面元素的attr属性值，并去除前后的空白符
 * @param  {jQuery selector} selector 页面元素选择器
 * @param  {String} attr     属性名称
 * @return {String}          元素attr属性值
 */
function getElementAttribute(selector, attr) {
    return $.trim($(selector).attr(attr));
}

/**
 * 将日期格式格式化成yyyy-MM-dd hh:mm:ss
 * @param {Date} date 需要格式化的Date数据
 * @return {String} 格式化后的日期
 */
function formateDate(date) {
    if (!isDate(date)) {
        return;
    }
    var years = date.getFullYear(),
        month = fillNumber(date.getMonth() + 1, 2),
        day = fillNumber(date.getDate(), 2),
        hour = fillNumber(date.getHours(), 2),
        minute = fillNumber(date.getMinutes(), 2),
        second = fillNumber(date.getSeconds(), 2);

    return [years, month, day].join('-') + ' ' + [hour, minute, second].join(':');
}

/**
 * 将日期格式格式化成yyyy-MM-dd hh:mm
 * @param {Date} date 需要格式化的Date数据
 * @return {String} 格式化后的日期
 */
function formateDateUntilMinutes(date) {
    if (!isDate(date)) {
        return;
    }
    var years = date.getFullYear(),
        month = fillNumber(date.getMonth() + 1, 2),
        day = fillNumber(date.getDate(), 2),
        hour = fillNumber(date.getHours(), 2),
        minute = fillNumber(date.getMinutes(), 2);

    return [years, month, day].join('-') + ' ' + [hour, minute].join(':');
}

/**
 * 将日期格式格式化成yyyy-MM-dd
 * @param {Date} date 需要格式化的Date数据
 * @return {String} 格式化的日期
 */
function formateDateOnly(date) {
    if (!isDate(date)) {
        return;
    }
    var years = date.getFullYear(),
        month = fillNumber(date.getMonth() + 1, 2),
        day = fillNumber(date.getDate(), 2);

    return [years, month, day].join('-');
}

/**
 * 用0补齐正整数长度
 * @param {[type]} number 需要补齐长度的正整数
 * @param {Number} length 长度
 * @return {String} 补齐长度以后的数字字符串
 */
function fillNumber(number, length) {
    number = +number;
    length = +length;

    if (isNaN(number) || isNaN(length)) {
        return;
    }

    var numberStr = number.toString(),
        numLength = numberStr.length,
        diffLength = length - numLength;

    for (var idx = 0; idx < diffLength; ++idx) {
        numberStr = "0" + numberStr;
    }
    return numberStr;
}

/**
 * 判断选择态组件是否被勾选
 * @param {String|JQuery Object} selector 控件选择器
 * @return {Boolean} 判断结果
 */
function isChecked(selector) {
    return $(selector).hasClass("checked");
}

/**
 * 判断选择态组件是否被选中
 * @param {String|JQuery Object} selector 控件选择器
 * @return {Boolean} 判断结果
 */
function isSelected(selector) {
    return $(selector).hasClass("selected");
}

/**
 * 时间大小比较
 * @param  {String} one      待比较的时间1
 * @param  {String} other    待比较的时间2
 * @param  {String} accuracy 对比精准度（可选，默认为'Second'。'Year'：精确到年，'Month'：精确到月，'Day'：精确到日，'Hour'：精确到小时，'Minute'：精确到分钟，'Second'：精确到秒）
 * @return {Number}          比较结果。小于0：one小于other；等于0；one等于other；大于0：one大于0
 */
function compareDate(one, other, accuracy) {
    var fn = null;
    switch (true) {
        case accuracy === 'Year':
            fn = UPORTAL.getDatetimeOfYear;
            break;
        case accuracy === 'Month':
            fn = UPORTAL.getDatetimeOfMonth;
            break;
        case accuracy === 'Day':
            fn = UPORTAL.getDatetimeOfDay;
            break;
        case accuracy === 'Hour':
            fn = UPORTAL.getDatetimeOfHour;
            break;
        case accuracy === 'Minute':
            fn = UPORTAL.getDatetimeOfMinute;
            break;
        default:
            fn = UPORTAL.getDatetimeOfSecond;
    }
    return fn(one) - fn(other);
}

/**
 * 将UTC时间转换成本地时间
 * @param {String} date 需要转换的时间
 * @return {Date} 转换后的时间
 */
function convertFromUtcDate(date) {
    var regexp = /^(\d+)[-/](\d+)[-/](\d+)\s+(\d+)[:](\d+)([:](\d+))*$/;
    regexp.test(date);
    var year = RegExp.$1;
    var month = RegExp.$2;
    var day = RegExp.$3;
    var hours = RegExp.$4;
    var minutes = RegExp.$5;
    var second = RegExp.$7;

    var convertedDate = new Date();
    convertedDate.setUTCFullYear(year);
    convertedDate.setUTCMonth(month - 1);
    convertedDate.setUTCDate(day);
    convertedDate.setUTCHours(hours);
    convertedDate.setUTCMinutes(minutes);
    convertedDate.setUTCSeconds(second);
    convertedDate.setUTCMilliseconds(0);

    return convertedDate;
}

/**
 * 将本地时间转换成UTC时间
 * @param {[type]} date [description]
 * @return {[type]} [description]
 */
function convertToUtcDate(date, formatType) {
    // IE下，以String类型数据作为参数创建1个Date类型的对象时，
    // 只支持"yyyy/MM/dd hh:mm:ss"的格式
    date = date.replace(/[-]/g, '/');
    var dateObj = new Date(date);
    var year = dateObj.getUTCFullYear();
    var month = dateObj.getUTCMonth();
    var day = dateObj.getUTCDate();
    var hours = dateObj.getUTCHours();
    var minutes = dateObj.getUTCMinutes();
    var seconds = dateObj.getUTCSeconds();

    var convertedDate = new Date();

    convertedDate.setFullYear(year);
    convertedDate.setMonth(month);
    convertedDate.setDate(day);
    if (!formatType) {
        convertedDate.setHours(hours);
        convertedDate.setMinutes(minutes);
        convertedDate.setSeconds(0);
        convertedDate.setMilliseconds(0);
    } else if (formatType == 'seconds') {
        convertedDate.setHours(hours);
        convertedDate.setMinutes(minutes);
        convertedDate.setSeconds(seconds);
    } else if (formatType == 'day') {
        return convertedDate;
    } else {
        throw 'InvalidParameter';
    }

    return convertedDate;
}

/**
 * 将yyyy-MM-dd hh:mm:ss格式的时间转换成yyyy-MM-dd hh:mm格式
 *
 * @param {String} date 待转换的时间
 * @return {String} 转换后的时间
 */
function getDateUtilMinute(date) {
    return $.trim(date.match(/(\d+)-(\d+)-(\d+)\s(\d+):(\d+)/)[0]);
}

/**
 * 将yyyy-MM-dd hh:mm:ss格式的时间转换成yyyy-MM-dd格式
 * @param  {String} date 待转换的时间
 * @return {String}      转换后的时间
 */
function getDateOnly(date) {
    return $.trim(date.match(/\d+-\d+-\d+/)[0]);
}

/**
 * 构造表单，并提交请求
 * @param  {String} url    请求路径
 * @param  {Object} params 参数对象
 * @return {Function}        Function
 */
function submitFormPost(url, params) {
    var $form = $("<form>").attr({
        "method": "post",
        "action": url
    });
    // 遍历params的每个属性
    for (var param in params) {
        // 只遍历params本身的属性（非原型链上）
        if (params.hasOwnProperty(param)) {
            var $hidden = $('<input type="hidden">').attr({
                "name": param,
                "value": params[param]
            }).appendTo($form);
        }
    }

    addCsrfTokenBeforeSubmit($form);

    // 提交请求
    $form.appendTo("body").submit().remove();
}

/**
 * 获取输入框控件的光标位置
 * @param  {String | JQuery Object} selector 控件选择器
 * @return {Number}          光标位置
 */
function getSelectionIndex(selector) {
    var _self = $(selector).get(0);
    var pos = 0;
    if ('selectionStart' in _self) {
        pos = _self.selectionStart;
    } else if ('selection' in document) {
        _self.focus();
        var Sel = document.selection.createRange();
        var SelLength = document.selection.createRange().text.length;
        Sel.moveStart('character', -_self.value.length);
        pos = Sel.text.length - SelLength;
    }
    return pos;
}

/**
 * 设置输入框控件的光标位置
 * @param {String | JQuery Object} selector 控件选择器
 * @param {Number} pos    光标位置
 */
function setSelectionIndex(selector, pos) {
    var _self = $(selector).get(0);
    if (_self.setSelectionRange) {
        _self.focus();
        _self.setSelectionRange(pos, pos);
    } else if (_self.createTextRange) {
        var range = _self.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
}

/**
 * 创建下拉框
 * @param  {Array| Object} options 下拉选项
 * @param  {String| Object} defaultValue 默认值
 * @return {Function}         Function
 */
function createSelector(options, defaultValue) {
    var $selector = $('<div class="ec-droplist">');
    var $selectedText = $('<p class="ec-droplist-select">').appendTo($selector);
    var $options = $('<ul class="ec-droplist-option" style="display: none;">').appendTo($selector);
    if (isArray(options)) {
        for (var idx = 0, len = options.length; idx < len; ++idx) {
            var $option = $('<li>').text(options[idx]).appendTo($options);
        }
        $selectedText.text(options[idx]);
    } else if (isObject(options)) {
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                var $option2 = $('<li>').text(options[key]).attr('key-value', key).appendTo($options);
            }
        }
        if (defaultValue) {
            if (isString(defaultValue)) {
                $selectedText.attr("key-value", defaultValue);
                $selectedText.text(options[defaultValue]);
            } else if (isObject(defaultValue)) {
                $selectedText.attr("key-value", defaultValue.key);
                $selectedText.text(defaultValue.value);
            } else {
                throw "InvaidDefaultValueException";
            }
        } else {
            $selectedText.attr("key-value", key);
            $selectedText.text(options[key]);
        }
    }
    return $selector;
}

/**
 * 判断obj是不是数组
 * @param  {Object}  obj 待判断的对象
 * @return {Boolean}     判断结果
 */
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

/**
 * 判断obj是不是Object类型的数据
 * @param  {object}  obj 待判断的对象
 * @return {Boolean}     判断结果
 */
function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * 判断obj是不是String类型的数据
 * @param  {Object}  obj 待判断的对象
 * @return {Boolean}     判断结果
 */
function isString(obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
}

/**
 * 判断obj是不是Date类型的数据
 * @param  {Object}  obj 待判断的对象
 * @return {Boolean}     判断结果
 */
function isDate(obj) {
    return Object.prototype.toString.call(obj) === '[object Date]';
}

/**
 * 限制只读输入框鼠标点击事件
 * @param  {jQuery slelctor} selector 控件选择器
 * @return {Function}          Function
 */
function limitMouseDown(selector) {
    var $selector = $(selector);
    $selector.on('mousedown', 'input[readOnly]', function(e) {
        e.preventDefault();
        return false;
    });
}

/**
 * 计算字符串长度，其中中文字符占wordBytes个字节长度
 * @param  {String} str 需要判断的字符串
 * @param  {String} wordBytes 中文字符所占字节数
 * @return {Number}     字符串长度
 */
function calcStrLength(str, wordBytes) {
    var replacedStr = "**";
    if (wordBytes) {
        replacedStr = repeatString("*", parseInt(wordBytes, 10));
    }
    return str.replace(/[^\x00-\xff]/g, replacedStr).length;
}

/**
 * 创建str重复times次的字符串
 * @param  {String} str   重复的字符
 * @param  {Number} times 重复次数
 * @return {String}       字符串
 */
function repeatString(str, times) {
    return new Array(times + 1).join(str);
}

/**
 * 将String类型的数据转换成Number类型的数据
 * 空字符串会被转成0
 * @param  {String} number String类型的数据
 * @return {Number}        转换后的数据
 */
function convertToNumber(number) {
    number = parseInt(number, 10);
    return isNaN(number) ? 0 : number;
}

/**
 * 判断时间date是否早于当前时间
 * @param  {String|Date} date 需要判断的时间
 * @return {Boolean}      判断结果
 */
function isBeforeNow(date) {
    var convertedDate = new Date(date);
    if (!isDate(convertedDate)) {
        throw date + "can not convert to Date class";
    }
    var now = new Date();
    return 0 < (now - convertedDate);
}

/**
 * 判断时间date是否晚于当前时间
 * @param  {String|Date}  date 需要判断的时间
 * @return {Boolean}      判断结果
 */
function isLaterNow(date) {
    var convertedDate = new Date(date);
    if (!isDate(convertedDate)) {
        throw date + "can not convert to Date class";
    }
    var now = new Date();
    return 0 > (now - convertedDate);
}

/**
 * 判断时间date是否早于今天
 * @param  {String|Date}  date 需要判断的时间
 * @return {Boolean}      判断结果
 */
function isBeforeToday(date) {
    var comparedDate = new Date(date);
    if (!isDate(comparedDate)) {
        throw date + "can not convert to Date class";
    }
    var today = new Date();
    comparedDate = parseInt(comparedDate / 86400000);
    today = parseInt(today / 86400000);
    return 0 < (today - comparedDate);
}

/**
 * 获取datetime在目的时区下对应的时间
 * @param  {Number} datetime       目标时间距离1970 年 1 月 1 日的毫秒数。
 * @param  {Number} timezoneOffset 目标时区距离0时区的偏移量
 * @return {String}                datetime在目的时区下对应的时间
 */
function getDateOnTimezone(datetime, timezoneOffset) {
    // 获取浏览器所在时区偏移量，且将单位换算到毫秒
    var browserOffset = (new Date()).getTimezoneOffset() * 60000;
    // 获取两个时区之间偏移量的差值
    var diffOffset = browserOffset + timezoneOffset;

    return formateDate(new Date(datetime + diffOffset));
}

/**
 * 判断时间date是否处于当前时区的夏令时中
 * @param  {Date}  date 待判断的时间类型
 * @return {Boolean}      判断结果
 */
function isInDst(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    if ("Invalid Date" === date) {
        return false;
    }
    var dateOffset = date.getTimezoneOffset(),
        year = date.getFullYear(),
        januaryOffset = new Date(year, 1, 1).getTimezoneOffset(),
        aprilOffset = new Date(year, 4, 1).getTimezoneOffset(),
        julyOffset = new Date(year, 7, 1).getTimezoneOffset(),
        octoberOffset = new Date(year, 10, 1).getTimezoneOffset(),
        offsets = [
            januaryOffset,
            aprilOffset,
            julyOffset,
            octoberOffset
        ],
        dstOffset = offsets[0],
        undstOffset = offsets[0];
    for (var idx = 0, len = offsets.length; idx < len; ++idx) {
        var offset = offsets[idx];
        if (dstOffset > offset) {
            dstOffset = offset;
        }
        if (undstOffset < offset) {
            undstOffset = offset;
        }
    }
    var now = new Date();
    if (octoberOffset === -180 && julyOffset === -240 && now.getFullYear === 2014) {
        dstOffset = undstOffset;
    }
    if (dstOffset === undstOffset) {
        return false;
    }
    return (dateOffset === dstOffset);
}

/**
 * 格式化字符串
 * @param  {String} sequence    待格式化的字符串
 * @param  {String} replacement 参数列表
 * @return {String}             格式化以后的字符串
 */
function formateStr() {
    if (!arguments.length) {
        return '';
    } else if (1 == arguments.length) {
        return arguments[0];
    }

    var result = Array.prototype.shift.call(arguments);
    for (var idx = 0, len = arguments.length; idx < len; ++idx) {
        result = result.replace(new RegExp("[{]" + idx + "[}]", "g"), arguments[idx]);
    }
    return result;
}

/**
 * 左侧查出的号码，如果在右侧列表中已经存在，那么该左侧的号码应该被勾选上
 */
function choosepagechangecheck(leftside, rightside, lefthead) {
    var $existItems = $(rightside);
    var $queryItems = $(leftside);
    var queryLength = $queryItems.length;
    if ($existItems && $existItems.length > 0 && $queryItems && queryLength > 0) {
        var existArr = [];
        $.each($existItems, function() {
            existArr.push($(this).find('td:nth-child(2)').text());
        });

        $.each($queryItems, function() {
            var data = $(this).find('td:nth-child(2)').text();
            if (existArr.indexOf(data) !== -1) {
                $(this).find('span').addClass('checked');
            } else {
                $(this).find('span').removeClass('checked');
            }
        });

    }
    // 如果左侧表中全部勾选，那么表头也得勾选
    if (($queryItems.find('.checked').length === queryLength) && (queryLength != 0)) {
        $(lefthead).addClass('checked');
    } else {
        $(lefthead).removeClass('checked');
    }
}

//放号
function choosepagenumber(leftside, rightside) {
    var $existItems = $(rightside);
    var $queryItems = $(leftside);
    var queryLength = $queryItems.length;
    if ($existItems && $existItems.length > 0 && $queryItems && queryLength > 0) {
        var existArr = [];
        $.each($existItems, function() {
            existArr.push($(this).find('td:nth-child(1)').text());
        });

        $.each($queryItems, function() {
            var data = $.trim($(this).find('td:nth-child(1)').text());
            if (existArr.indexOf(data) !== -1) {
                $(this).find('.number-add-btn').addClass('unable');
            } else {
                $(this).find('.number-add-btn').removeClass('unable');
            }
        });

    }
}

//给textarea绑定限制输入多少位
$(document).on('input propertychange', 'textarea', function() {
    var $this = $(this);
    var maxLength = $this.attr('maxLength');
    var value = $this.val();
    if (maxLength < value.length) {
        $this.val(value.substr(0, maxLength));
    }
});
/**
 * common 公共函数-- start
 */
function logout() {

    $("#logoutForm").remove();
    var $form = $("<form id='logoutForm' action='logout.sraction' method='post'></form>");

    var $input = $("<input name='para' type='hidden' value='1'></input>");
    $input.appendTo($form);

    addCsrfTokenBeforeSubmit($form);

    $form.appendTo($("body"));
    $form.submit();
}

// 确认弹出框
function showConfirmPop(title, popWinMsg, func, candelFn) {
    var $doc = $(document);
    UCD.checkUnits.addWarn(title, popWinMsg, 2);
    var b = 1;
    var a = 1;
    $('#warn-message')
        .off("click")
        .on("click", ".ok", function() {
            // $(this).next('.close').trigger('click');
            $('#warn-message').hide();
            $('#mask_layer').hide();
            if (func && a == b) { // 规避经过ivr页面func被保存并执行导致错误的问题
                func();
                a++;
            }
        })
        .on("click", ".close", function() {
            $doc.off('.deleteYesButton');
            if (candelFn && a == b) {
                candelFn();
                a++;
            }
        });

    if ($('#mask_layer').css("display") != 'none') {
        $doc.off('.deleteYesButton').on('keyup.deleteYesButton', function(event) {
            if (event.keyCode === 13) {
                $('#warn-message').find(".ok").trigger("click");
            }
        });
    }
}

function showLoginSuccessPop(popWinMsg, func) {
    $("#mask_layer").show();
    $("#pop-success").show().css("left",
        (document.body.clientWidth - $("#pop-success").width()) / 2);
    if (popWinMsg) {
        $("#pop-success").find("p").text(popWinMsg);
    } else {
        $("#pop-success").find("p").text($("#successMsg").val());
    }
    window.setTimeout(function() {
        $("#mask_layer").hide();
        $("#pop-success").hide();
        if (func) {
            func();
        }
    }, 1000);
}

// 确认弹出框
function showAdvisePop(title, popWinMsg, func) {
    UCD.checkUnits.addWarn(title, popWinMsg, 1);
    var b = 1;
    var a = 1;
    var $this = $(this);
    $('#warn-message').find('.ok,.pop-close.close').on('click', function() {
        if (func && a == b) {
            func();
        }
        $('#warn-message').hide();
    });
}

// 操作成功
function showSuccessPop(popWinMsg, func) {
    UCD.checkUnits.addResult(popWinMsg);
    window.setTimeout(function() {
        if (func) {
            func();
        }
    }, 1000);
}

// 警告、错误、失败弹出框
function showErrorPop(title, popWinMsg, func) {
    var $doc = $(document);
    UCD.checkUnits.addWarn(title, popWinMsg, 1, error);
    $('#warn-message').find('.close').on('click', function() {
        if (func) {
            func();
        }
        $doc.off('.showErrorPop');
        $('#warn-message').hide();
    });
    if ($('#mask_layer').css("display") != 'none') {
        $doc.off('.showErrorPop').on('keyup.showErrorPop', function(event) {
            if (event.keyCode === 13) {
                $('#warn-message .ok').trigger("click");
            }
        });
    }
}

// 显示页面遮罩
function showPopWinWrapper() {
    $("#mask_layer").show();

}

// 隐藏页面遮罩
function hidePopWinWrapper() {
    $("#mask_layer").hide();
}

// 设置当前位置
function setLocationText() {
    $("#currentLoacation")
        .text($("#sunriseMenuContent li.usn-curr > a").text());
}

// 只允许输入数字
function bindDigitCheck(input) {
    $(input).unbind("propertychange").bind("propertychange", function() {
        var reg = /^\d+$/;
        if (this.value == "" || reg.test(this.value)) {
            return;
        } else {
            this.value = this.value.replace(/\D/g, "");
        }
    });
    $(input).unbind("input").bind("input", function() {
        var reg = /^\d+$/;
        if (this.value == "" || reg.test(this.value)) {
            return;
        } else {
            this.value = this.value.replace(/\D/g, "");
        }
    });
}

// 只允许输入"+"和数字
function bindDigitCheck1(input) {
    var reg = /^(\+)?\d+$/;
    $(input).blur(function() {
        if (this.value == "" || reg.test(this.value)) {
            $(input).removeClass("inputError");
        } else {
            $(input).addClass("inputError");
        }
    }).keyup(function() {
        if (this.value == "" || reg.test(this.value)) {
            $(input).removeClass("inputError");
        } else {
            $(input).addClass("inputError");
        }
    });
}

function bindEmailCheck(input) {
    var reg = /^[\w-+]+(\.[\w-+]+)*@[\w-]+(\.[\w-]+)*(\.[\w-]{1,})$/;
    $(input).blur(function() {
        if (this.value == "" || reg.test(this.value)) {
            $(input).removeClass("inputError");
        } else {
            $(input).addClass("inputError");
        }
    }).keyup(function() {
        if (this.value == "" || reg.test(this.value)) {
            $(input).removeClass("inputError");
        } else {
            $(input).addClass("inputError");
        }
    });
}

function bindDomainCheck(input) {
    var reg = /^[A-Za-z0-9]{1,}(\.[A-Za-z0-9]{1,})*$/;
    $(input).blur(function() {
        if (reg.test(this.value)) {
            $(input).removeClass("inputError");
        } else {
            $(input).addClass("inputError");
        }
    }).keyup(function() {
        if (reg.test(this.value)) {
            $(input).removeClass("inputError");
        } else {
            $(input).addClass("inputError");
        }
    });
}

/*
 * 根据关键字段的hash值重新加载图片 图片路径要求遵守.../hd/hdXX.png，并且携带key和range属性 在每次页面刷新时调用
 */
function reloadImage() {
    if($(this).attr("src")!==undefined){
    $("img").one("load", function() {

        if ($(this).attr("src").indexOf("/hd/") > -1 && $(this).attr("key") && $(this).attr("range") && !$(this).attr("done")) {
            var key = $(this).attr("key");
            var hashCode = key.hashCode(); // 关键字段（不可修改）的hash值，保证头像不变
            var range = $(this).attr("range");
            var ranges = range.split("-"); // 图片范围，如1-20，包括20
            var min = Number(ranges[0]);
            var max = Number(ranges[1]) + 1;

            var newVal = hashCode % (max - min) + min;
            if (newVal < 10) {
                newVal = "0" + newVal;
            }
            var src = $(this).attr("src");
            var idx = src.lastIndexOf("/");
            src = src.substring(0, idx + 1) + "hd" + newVal + ".png";

            $(this).attr("done", "done"); // 标识已经加载完成
            $(this).attr("src", src);
        }
    }).each(function() {
        if (this.complete) {
            $(this).load();
        }
    });
    }

}

// 计算字符串的hash值
String.prototype.hashCode = function() {
    var hash = 0,
        i, chr, len;
    if (this.length === 0) {
        return hash;
    }
    for (i = 0, len = this.length; i < len; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
        if (hash < 0) {
            hash = -hash;
        }
    }
    return hash;
};

// 验证是否需要跳转error页面
function toErrorSunPage(html) {
    if (html && (html + "").indexOf("operate-fail") != -1) {
        $("#sunriseContent").html("").html(html);
        hidePopWinWrapper();
        return false;
    } else {
        return true;
    }
}
// 创建account的校验 空格<>()\/&[],;:"
function bindAccountCheck(input) {
    input.on({
        "input propertychange": function() {
            var $this = $(this),
                value = $this.val();
            var accountCharacter = $("#main-activeccountCharacter").val();
            var regex = /[\u4E00-\u9FA5\@\s\<\>\(\)\\\/\&*|`~!#$%\^=\[\]\,\;\:\"\'\?\《\》\，\；\：\“\”\‘\【\】\（\）\、\/\\©®\ ]/g;
            var fullWidthRegex = /[^\x00-\xff]/;
            var commonChar = /[\u4E00-\u9FA5<>\\:\/"\?*|@©®\ ]+/;
            var matchStr = value.match();
            var pos = getSelectionIndex($this);

            switch (accountCharacter) {
                case "0":
                    if (regex.test(value)) {
                        $this.val(value.replace(regex, ""));
                        setSelectionIndex(this, pos - 1);
                    }
                    if (fullWidthRegex.test(value)) {
                        $this.val(value.replace(/[^\x00-\xff]/g, ""));
                        setSelectionIndex(this, pos - 1);
                    }
                    break;
                case "1":
                    // if (commonChar.test(value)) {
                    //     $this.val(value.replace(/[\u4E00-\u9FA5<>\\:\/"\?*|]+/g, ""));
                    //     setSelectionIndex(this, pos - 1);
                    // }
                    // break;
                case "2":
                    if (commonChar.test(value)) {
                        $this.val(value.replace(/[\u4E00-\u9FA5<>\\:\/"\?*|@©®\ ]+/g, ""));
                        setSelectionIndex(this, pos - 1);
                    }
                    if (/^'/.test(value) && value.length > 1) {
                        //$this.val(value.replace(/'$/, ""));
                    }
                    break;
                default:
                    if (regex.test(value)) {
                        $this.val(value.replace(regex, ""));
                        setSelectionIndex(this, pos - 1);
                    }
                    if (fullWidthRegex.test(value)) {
                        $this.val(value.replace(/[^\x00-\xff]/g, ""));
                        setSelectionIndex(this, pos - 1);
                    }
                    break;
            }

        },
        "keydown": function(event) {
            var eventObj = event || e;
            var keyCode = eventObj.keyCode || eventObj.which;
            if (keyCode === 229) {
                return false;
            }
        }
    });
}

// 批量删除失败详细信息弹出框
function showErrorMes(data) {
    var errDel = [];
    var errMsg = '';
    $("#mes-error").show();
    $("#mask_layer_cxsub").show();
    for (var i = 0; i < data.length; i++) {
        if (data[i] != 0) {
            errDel.push(data[i]);
            errMsg += ("<tr><td>" + htmlEncodeJQ(data[i][Object.keys(data[i])[1]]) + "</td><td>" + htmlEncodeJQ(data[i][Object.keys(data[i])[0]]) + "</td></tr>");
        }
    }
    if (null != errDel && errDel.length > 0) {
        $('#mes-error table tbody').html(errMsg);
    } else {
        showErrorPop($("#error").val(), data);
    }
    resetPopPosition($('#mes-error'));
}

// 防止js注入
function htmlEncodeJQ(str) {
    return $('<span/>').text(str).html();
}
/**
 * common 公共函数-- end
 */
/**
 * validate 校验函数-- start
 */

/**
 * 判断字符串是否为空
 * @param  {String}  str 需要判断的字符串
 * @return {Boolean}     判断结果
 */
function isBlank(str) {
    return (undefined === str) || (null === str) || ('' === $.trim(str.toString()));
}

/**
 * 为控件列表中的每个元素添加错误样式，此方法的入参为控件选择器列表
 * @return {Function} Function
 */
function makeupError() {
    for (var idx = 0, len = arguments.length; idx < len; ++idx) {
        var $container = $(arguments[idx]).addClass('error');
        var help = $container.attr("data-help");
        if (help) {
            $(help).show();
        }
    }
}

/**
 * 为控件列表中的每个元素清除错误样式，此方法的入参为控件选择器列表
 * @return {Function} Function
 */
function clearError() {
    for (var idx = 0, len = arguments.length; idx < len; ++idx) {
        var $container = $(arguments[idx]).removeClass('error');
        var help = $container.attr("data-help");
        if (help) {
            $(help).hide();
        }
    }
}

/**
 * 为控件绑定校验规则
 * @param  {String|jQuery selector}   selector 控件选择器
 * @param  {Function} callback 回调函数，在此函数中完成校验
 * @return {Function}            Function
 */
function bindValidator(selector, callback) {
    if (!selector || !callback) {
        return;
    }
    $(selector).on('propertychange input blur check', callback);
}

/**
 * 在父元素控件上添加监听，监听控件的校验规则
 * @param  {jQuery selector}   parent   父元素控件选择器
 * @param  {jQuery selector}   selector 控件选择器
 * @param  {Function} callback 回调函数，在此函数中实现校验
 * @return {Function}            Function
 */
function bindValidatorOnParent(parent, selector, callback) {
    if (!parent || !selector || !callback) {
        throw 'InvalidFunctionParameterException';
    }
    $(parent).on('propertychange input blur check', selector, callback);
}

/**
 * 利用正则表达式校验控件值
 * @param  {String|jQuery selector} selector 控件选择器
 * @param  {Regexp} regexp   正则表达式
 * @param  {Boolean} require  必填标识
 * @return {Function}          Function
 */
function validateValue(selector, regexp, require) {
    bindValidator(selector, function(event) {
        var $this = $(this);
        var value = $this.val();

        if (isBlank(value)) {
            if (require) {
                makeupError($this);
            } else {
                clearError($this);
            }
        } else {
            if (regexp) {
                if (regexp.test(value)) {
                    clearError($this);
                } else {
                    makeupError($this);
                }
            }
        }
    });
}

/**
 * 监控控件值有效性
 * @param  {Object} options 参数对象
 * @return {Function}         Function
 */
function watchValidityOfValue(options) {
    var _parent = options.parent;
    var _selector = options.selector;
    var _regexp = options.regexp;
    var _require = options.require;
    if (!_selector || !_regexp) {
        throw 'InvalidFunctionParameterException';
    }
    if (!_parent) {
        bindValidator(_selector, _checkValidityByRegexp);
    } else {
        bindValidatorOnParent(_parent, _selector, _checkValidityByRegexp);
    }

    /**
     * 通过正则表达式校验控件值
     * @param  {Event} e 事件
     * @return {Function}   Function
     */
    function _checkValidityByRegexp(e) {
        var $this = $(this);
        var value = $this.val();

        if (isBlank(value)) {
            if (_require) {
                makeupError($this);
            } else {
                clearError($this);
            }
        } else {
            if (_regexp) {
                if (_regexp.test(value)) {
                    clearError($this);
                } else {
                    makeupError($this);
                }
            }
        }
    }
}

/**
 * 校验控件值是否满足IPv4格式
 * @param  {String|jQuery selector} selector 控件选择器
 * @param  {Boolean} require  必填标识
 * @return {Function}          Function
 */
function validateIPv4(selector, require) {
    validateValue(selector, /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/, require);
}

/**
 * 校验控件值是否满足邮件格式
 * @param  {String|jQuery selector} selector 控件选择器
 * @param  {Boolean} require  必填标识
 * @return {Function}          Function
 */
function validateEmail(selector, require) {
    validateValue(
        selector,
        /^[\w-+]+(\.[\w-+]+)*@[\w-]+(\.[\w-]+)*(\.[\w-]{1,})$/,
        require);
}

/**
 * 校验控件值是否满足号码格式（号码格式为：加号+数字。其中加号可选，但存在加号时，加号必须打头。）
 * @param  {String|jQuery selector} selector 控件选择器
 * @param  {Boolean} require  必填标识
 * @return {Function}          Function
 */
function validateNumber(selector, require) {
    validateValue(selector, /^[+]?[0-9]+$/, require);
}

/**
 * 校验控件值是否满足数字格式
 * @param  {String|jQuery selector} selector 控件选择器
 * @param  {Boolean} require  必填标识
 * @return {Function}          Function
 */
function validateDigit(selector, require) {
    validateValue(selector, /^[0-9]+$/, require);
}

/**
 * 校验控件值是否落在区间[minValue, maxValue]中
 * @param  {String| jQuery selector} selector 控件选择器
 * @param  {Number} minValue 最小值
 * @param  {Number} maxValue 最大值
 * @return {Function}          Function
 */
function validateNumberRange(selector, minValue, maxValue) {
    bindValidator(selector, function() {
        var $this = $(this),
            value = $this.val();

        if (matchNumberRange(value, minValue, maxValue)) {
            clearError($this);
        } else {
            makeupError($this);
        }
    });
}

/**
 * 检验控件值长度是否落在区间[minLength, maxLength]中
 * @param  {String| jQuery selector} selector  控件选择器
 * @param  {Number} minLength 最小长度
 * @param  {Number} maxLength 最大长度
 * @return {Function}           Function
 */
function validateLengthRange(selector, minLength, maxLength) {
    bindValidator(selector, function() {
        var $this = $(this),
            value = $this.val(),
            length = value.length;

        if (minLength <= length && length <= maxLength) {
            clearError(selector);
        } else {
            makeupError(selector);
        }
    });
}

/**
 * 检验控件值非空
 * @param  {String| jQuery selector} selector 控件选择器
 * @return {Function}          Function
 */
function validateNotEmpty(selector) {
    validateValue(selector, /.+/, true);
}

/**
 * 限制控件值只允许输入号码格式数据
 * @param  {String|JQuery} selector 控件选择器
 * @param  {String|JQuery} parent 父控件选择器
 * @return {Function}          Function
 */
function onlyNumber(selector, parent) {
    limitValidator({ parent: parent, selector: selector, regexp: /[^\+0-9]/g });
}

/**
 * 限制控件值只允许输入数字格式数据
 * @param  {String|JQuery} selector 控件选择器
 * @param  {String|JQuery} parent 父控件选择器
 * @return {Function}          Function
 */
function onlyDigit(selector, parent) {
    limitValidator({ parent: parent, selector: selector, regexp: /[^0-9]/g });
}

/**
 * 限制输入
 * @param  {Object} options   参数
 * @return {jQuery selector}          控件
 */
function limitValidator(options) {
    var parent = options.parent;
    var selector = options.selector;
    var regexp = options.regexp;
    var eventMsg = {
        "keydown": function(e) {
            var $this = $(this);
            var value = $this.val();
            var eventObj = e || window.event;
            var keyCode = eventObj.keyCode || eventObj.which;
            // End键
            if (35 === keyCode) {
                $this.data("pos", value.length);
            }
            // Home键
            else if (36 === keyCode) {
                $this.data("pos", 0);
            }
            // 左向方向键
            else if (37 === keyCode) {
                $this.data("pos", getSelectionIndex($this) - 1);
            }
            // 右向方向键
            else if (39 === keyCode) {
                $this.data("pos", getSelectionIndex($this) + 1);
            }
            // 上下方向键
            else if (38 === keyCode || 40 === keyCode) {
                return false;
            }
        },
        "focus": function(e) {
            var $this = $(this);
            $this.data("value", $this.val());
            $this.data("pos", $this.val().length);
        },
        "click": function(e) {
            var $this = $(this);
            $this.data("value", $this.val());
            $this.data("pos", getSelectionIndex($this));
        },
        "propertychange input": function(e) {
            var $this = $(this);
            var value = $this.val();
            if ("" === value) {
                $this.data("value", "");
                $this.data("pos", 0);
                return;
            }
            var lastValue = $this.data("value") || '';
            var validValue = value.replace(regexp, '');
            var lengthDiff = validValue.length - lastValue.length;
            var pos = $this.data("pos") || 0;
            if (value === validValue) {
                $this.data("value", value);
                $this.data('pos', getSelectionIndex($this));
                return;
            } else if (lengthDiff > 0) {
                pos = pos + lengthDiff;
            } else {
                pos = getSelectionIndex($this) - 1;
            }
            $this.val(validValue);
            $this.data("value", validValue);
            $this.data('pos', pos);
            setSelectionIndex($this, pos);
        }
    };

    if (parent) {
        return $(parent).on(eventMsg, selector);
    } else {
        return $(selector).on(eventMsg);
    }
}

/**
 * 判断value是否落在区间[minValue, maxValue]
 * @param  {Number} value    需要进行判断的数值
 * @param  {Number} minValue 区间最小值
 * @param  {Number} maxValue 区间最大值
 * @return {Boolean}          判断结果
 */
function matchNumberRange(value, minValue, maxValue) {
    value = parseInt(value);
    minValue = parseInt(minValue);
    maxValue = parseInt(maxValue);
    if (isNaN(value)) {
        return false;
    }
    var hasMinValue = !isNaN(minValue),
        hasMaxValue = !isNaN(maxValue);

    if (hasMinValue && hasMaxValue) {
        return minValue <= value && value <= maxValue;
    } else if (hasMinValue) {
        return value >= minValue;
    } else if (hasMaxValue) {
        return value <= maxValue;
    }

    return isMatch;
}

/**
 * 判断date是否满足日期格式（yyyy-MM-dd）
 * @param  {String} date 需要判断的日期
 * @return {Boolean}      判断结果
 */
function matchDate(date) {
    if (isBlank(date)) {
        return false;
    }
    var dateRegx = new RegExp("^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$");

    return dateRegx.test(date);
}

/**
 * 限制控件只允许输入数字
 * @param  {String|jQuery selector} selector 控件选择器
 * @return {Function}          Function
 */
function bindInputNumCheck(selector) {
    bindValidator(selector, function() {
        var $this = $(this),
            value = $this.val();
        $this.val(value.replace(/[^0-9+]/g, ""));
    });
}

/**
 * 检查必填Input输入框是否为空
 * @param  {String|jQuery selector} selector Input输入框控件选择器
 * @return {Boolean}          检查结果
 */
function notEmptyValue(selector) {
    return notEmpty(selector, function(selector) {
        return getElementValue(selector);
    });
}

/**
 * 判断控件的文本节点内容是否为空
 * @param  {String|jQuery selector} selector 控件选择器
 * @return {Boolean}          检查结果
 */
function notEmptyText(selector) {
    return notEmpty(selector, function(selector) {
        return getElementText(selector);
    });
}

/**
 * 判断控件的key-value属性内容是否为空
 * @param  {String|jQuery selector} selector 控件选择器
 * @return {Boolean}          检查结果
 */
function notEmptyKeyValue(selector) {
    return notEmpty(selector, function(selector) {
        return getElementKeyValue(selector);
    });
}

/**
 * 检查控件值是否为空
 * @param  {String|jQuery selector}   selector 控件选择器
 * @param  {Function} fn 获取控件绑定值的方法
 * @return {Boolean}            检查结果
 */
function notEmpty(selector, fn) {
    if (!selector || !fn || !$.isFunction(fn)) {
        throw 'InvalidParameterException';
    }
    var value = fn(selector);
    if (isBlank(value)) {
        makeupError(selector);
        return true;
    }
    return false;
}

/**
 * 限制不允许输入中文和特殊字符
 * @param  {String | jQuery selector} selector 控件选择器
 * @return {Function}          Function
 */
function limitSpecialCharacter(selector) {
    limitValidator(selector, /[\u4E00-\u9FA5\s<>\(\)\\\/\&\[\]\,\;\:\"\《\》\，\；\：\“\”\【\】\（\）\、\/\\]/g);
}

/**
 * 使用正则表达式进行参数校验
 * @param  {String}  value   待校验的参数
 * @param  {RegExp}  regexp  正则表达式
 * @param  {Boolean} require 是否必填
 * @return {Boolean}         校验结果
 */
function isValidValue(value, regexp, require) {
    if (!value) {
        if (require) {
            return false;
        }
        return true;
    }
    if (!(regexp instanceof RegExp)) {
        throw 'Invalid Parameter: ' + regexp + ' only accept a RegExp class';
    }
    return regexp.test(value);
}
/**
 * validate 校验函数-- end
 */
