(function(window, document) {
	var w = window,
		doc = document,

		//新增自动补全CSS3前缀
		rdashAlpha = /-([\da-z])/gi,
		cssPrefixes = ["Webkit", "O", "Moz", "ms"],

		fcamelCase = function(all, letter) {
			return letter.toUpperCase();
		},

		camelCase = function(string) {
			return string.replace(rdashAlpha, fcamelCase);
		};

	function vendorPropName(style, name) {
			if (name in style) {
				return name;
			}

			var capName = name.charAt(0).toUpperCase() + name.slice(1),
				origName = name,
				i = cssPrefixes.length;

			while (i--) {
				name = cssPrefixes[i] + capName;
				if (name in style) {
					return name;
				}
			}

			return origName;
		}
		//新增自动补全CSS3前缀

	var Kodo = function(selector, context) {
		return new Kodo.prototype.init(selector, context);
	}
	Kodo.prototype = {
		constructor: Kodo,
		length: 0,
		splice: [].splice,
		selector: '',
		init: function(selector, context) { //dom选择的一些判断
			if (!selector) {
				return this;
			}

			if (typeof selector == 'object') {
				this[0] = selector;
				this.length = 1;
				return this;
			} else if (typeof selector == 'function') {
				Kodo.ready(selector);
				return;
			}

			var context = context || doc,
				elm;

			if (selector.charAt(0) == '#' && !selector.match('\\s')) {
				this.selector = selector;

				selector = selector.substring(1);
				elm = doc.getElementById(selector);

				this[0] = elm;
				this.context = context;
				this.length = 1;
				return this;
			} else {
				elm = context.querySelectorAll(selector);
				for (var i = 0; i < elm.length; i++) {
					this[i] = elm[i];
				}

				this.selector = selector;
				this.context = context;
				this.length = elm.length;
				return this;
			}
		},
		css: function(attr, val) { //链式测试
			var getAttr = vendorPropName(this[0].style, camelCase(attr));

			for (var i = 0; i < this.length; i++) {
				if (typeof attr == 'string') {
					if (arguments.length == 1) {
						console.log(getAttr);
						return getComputedStyle(this[0], null)[getAttr];
					}
					this[i].style[getAttr] = val;
				} else {
					var _this = this[i];
					f.each(attr, function(attr, val) {
						_this.style.cssText += '' + attr + ':' + val + ';';
					});
				}
			}
			return this;
		},
		html: function(value) {
			if (value === undefined) {
				return this[0].innerHTML;
			} else {
				for (var i = 0; i < this.length; i++) {
					this[i].innerHTML = value;
				}
			}
			return this;
		},
		append: function(str) {
			for (var i = 0; i < this.length; i++) {
				domAppend(this[i], 'beforeend', str);
			}
			return this;
		},
		before: function(str) {
			for (var i = 0; i < this.length; i++) {
				domAppend(this[i], 'beforeBegin', str);
			}
			return this;
		},
		after: function(str) {
			for (var i = 0; i < this.length; i++) {
				domAppend(this[i], 'afterEnd', str);
			}
			return this;
		},
		remove: function() { //只能删除自身
			for (var i = 0; i < this.length; i++) {
				this[i].parentNode.removeChild(this[i]);
			}
			return this;
		},

		attr: function(attr, val) {
			for (var i = 0; i < this.length; i++) {
				if (typeof attr == 'string') {
					if (arguments.length == 1) {
						return this[i].getAttribute(attr);
					}
					this[i].setAttribute(attr, val);
				} else {
					var _this = this[i];
					f.each(attr, function(attr, val) {
						_this.setAttribute(attr, val);;
					});
				}
			}
			return this;
		},
		data: function(attr, val) {
			for (var i = 0; i < this.length; i++) {
				if (typeof attr == 'string') {
					if (arguments.length == 1) {
						return this[i].getAttribute('data-' + attr);
					}
					this[i].setAttribute('data-' + attr, val);
				} else {
					var _this = this[i];
					f.each(attr, function(attr, val) {
						_this.setAttribute('data-' + attr, val);;
					});
				}
			}
			return this;
		},
		hasClass: function(cls) {
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			if (this[0].className.match(reg)) return true;
			else return false;
			return this;
		},
		addClass: function(cls) {
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			for (var i = 0; i < this.length; i++) {
				if (!this[i].className.match(reg))
					this[i].className += ' ' + cls;
			}
			return this;
		},
		removeClass: function(cls) {
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			for (var i = 0; i < this.length; i++) {
				if (this[i].className.match(reg))
					this[i].className = this[i].className.replace(' ' + cls, '');
			}
			return this;
		},
		find: function(selector) {
			if (!selector) return;
			var context = this.selector;
			return new Kodo(context + ' ' + selector);
		},
		first: function() {
			return new Kodo(this[0])
		},
		last: function() {
			var num = this.length - 1;
			return new Kodo(this[num]);
		},
		eq: function(num) {
			var num = num < 0 ? (this.length - 1) : num;
			return new Kodo(this[num]);
		},
		get: function(num) {
			var num = num < 0 ? (this.length - 1) : num;
			return this[num];
		},
		next: function() {
			return sibling(this[0], "nextSibling");
		},
		prev: function() {
			return sibling(this[0], "previousSibling");
		},
		parent: function() {
			var parent = this[0].parentNode;
			parent && parent.nodeType !== 11 ? parent : null;
			var a = Kodo();
			a[0] = parent;
			a.selector = parent.tagName.toLocaleLowerCase();
			a.length = 1;
			return a;
		},
		parents: function() {
			var a = Kodo(),
				i = 0;
			while ((this[0] = this[0]['parentNode']) && this[0].nodeType !== 9) {
				if (this[0].nodeType === 1) {
					a[i] = this[0];
					i++;
				}
			}
			a.length = i;
			return a;
		},
		//////////////////////
		///////新增事件部分////
		//////////////////////
		on: function(type, selector, fn) {
			if (typeof selector == 'function') {
				fn = selector;
				for (var i = 0; i < this.length; i++) {
					if (!this[i].fguid) {
						this[i].fguid = ++Kodo.fguid;

						Kodo.Events[Kodo.fguid] = {};
						Kodo.Events[Kodo.fguid][type] = [fn];

						bind(this[i], type, this[i].fguid);

					} else {
						var id = this[i].fguid;
						if (Kodo.Events[id][type]) {
							Kodo.Events[id][type].push(fn);
						} else {
							Kodo.Events[id][type] = [fn];
							bind(this[i], type, id);
						}
					}
				}
			} else {
				for (var i = 0; i < this.length; i++) {
					if (!this[i].fdid) {
						this[i].fdid = ++Kodo.fdid;

						Kodo.deleEvents[Kodo.fdid] = {};
						Kodo.deleEvents[Kodo.fdid][selector] = {};
						Kodo.deleEvents[Kodo.fdid][selector][type] = [fn];

						delegate(this[i], type, selector, fn);
					} else {
						var id = this[i].fdid;

						if (Kodo.deleEvents[id][selector][type]) {
							Kodo.deleEvents[id][selector][type].push(fn);
						} else {
							Kodo.deleEvents[id][selector][type] = [fn];
							delegate(this[i], type, selector, fn);
						}
					}
				}
			}
		},
		off: function(type, selector) {
			if (arguments.length == 0) {
				//如果没传参数，清空所有事件
				for (var i = 0; i < this.length; i++) {
					var id = this[i].fguid;
					for (var j in Kodo.Events[id]) {
						Kodo.Events[id][j] = [];
					}
				}
				return;
			} else if (arguments.length == 1) {
				//指定一个参数，则清空对应的事件
				for (var i = 0; i < this.length; i++) {
					var id = this[i].fguid;
					Kodo.Events[id][type] = [];
				}
				return;
			} else {
				for (var i = 0; i < this.length; i++) {
					var id = this[i].fdid;
					Kodo.deleEvents[id][selector][type] = [];
				}
			}
		}
	}
	Kodo.prototype.init.prototype = Kodo.prototype;

	Kodo.Events = []; //事件绑定存放的事件
	Kodo.fguid = 0; //事件绑定的唯一标识

	Kodo.deleEvents = []; //事件委托存放的事件
	Kodo.fdid = 0; //事件委托的唯一标识 
	function delegate(agent, type, selector, fn) {
		var id = agent.fdid;
		agent.addEventListener(type, function(e) {
			var target = e.target;
			var ctarget = e.currentTarget;
			var bubble = true;

			while (bubble && target != ctarget) {
				if (filiter(agent, selector, target)) {
					for (var i = 0; i < Kodo.deleEvents[id][selector][type].length; i++) {
						bubble = Kodo.deleEvents[id][selector][type][i].call(target, e);
					}
				};
				target = target.parentNode;
				return bubble;
			}
		}, false);

		function filiter(agent, selector, target) {
			var nodes = agent.querySelectorAll(selector);
			for (var i = 0; i < nodes.length; i++) {
				if (nodes[i] == target) {
					return true;
				}
			}
		}
	}

	function bind(dom, type, fguid) {
		dom.addEventListener(type, function(e) {
			for (var i = 0; i < Kodo.Events[fguid][type].length; i++) {
				Kodo.Events[fguid][type][i].call(dom, e); //正确的dom回调
			}
		}, false);
	}
		//////////////////////
		///////新增事件部分////
		//////////////////////
		
	//工具方法
	Kodo.ready = function(fn) {
		doc.addEventListener('DOMContentLoaded', function() {
			fn && fn();
		}, false);
		doc.removeEventListener('DOMContentLoaded', fn, true);
	}
	Kodo.each = function(obj, callback) {
		var len = obj.length,
			constru = obj.constructor,
			i = 0;

		if (constru === window.f) {
			for (; i < len; i++) {
				var val = callback.call(obj[i], i, obj[i]);
				if (val === false) break;
			}
		} else if (isArray(obj)) {
			for (; i < len; i++) {
				var val = callback.call(obj[i], i, obj[i]);
				if (val === false) break;
			}
		} else {
			for (i in obj) {
				var val = callback.call(obj[i], i, obj[i]);
				if (val === false) break;
			}
		}
	}
	Kodo.get = function(url, sucBack, complete) {
		var options = {
			url: url,
			success: sucBack,
			complete: complete
		}
		ajax(options);
	}
	Kodo.post = function(url, data, sucback, complete) {
		var options = {
			url: url,
			type: "POST",
			data: data,
			success: sucback,
			complete: complete
		}
		ajax(options);
	}

	function ajax(options) {
		var defaultOptions = {
			url: false, //ajax 请求地址
			type: "GET",
			data: false,
			success: false, //数据成功返回后的回调方法
			complete: false //ajax完成后的回调方法
		};
		for (i in defaultOptions) {
			if (options[i] === undefined) {
				options[i] = defaultOptions[i];
			}
		}

		var xhr = new XMLHttpRequest();
		var url = options.url;
		var params = formatParams(options.data);
		xhr.open(options.type, url);
		xhr.onreadystatechange = onStateChange;
		if (options.type === 'POST') {
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}
		xhr.send(params ? params : null);

		function onStateChange() {
			if (xhr.readyState == 4) {
				var result,
					status = xhr.status;

				if ((status >= 200 && status < 300) || status == 304) {
					result = xhr.responseText;
					ajaxSuccess(result, xhr)
				} else {
					console.log("ERR", xhr.status);
				}
			}
		}

		function ajaxSuccess(data, xhr) {
			var status = 'success';
			options.success && options.success(data, options, status, xhr)
			ajaxComplete(status)
		}

		function ajaxComplete(status) {
			options.complete && options.complete(status);
		}

		function formatParams(data) {
			var arr = [];
			for (var name in data) {
				arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
			}
			arr.push(("v=" + Math.random()).replace("."));
			return arr.join("&");
		}
	}

	function sibling(cur, dir) {
		while ((cur = cur[dir]) && cur.nodeType !== 1) {}
		return cur;
	}

	function domAppend(elm, type, str) { //实现append、after、before操作
		elm.insertAdjacentHTML(type, str);
	}

	function isArray(obj) {
		return Array.isArray(obj);
	}
	window.f = Kodo;
})(window, document);