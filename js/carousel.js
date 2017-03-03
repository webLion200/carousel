;(function ($) {
	var Carousel = function (poster) {
		// 保留旋转木马对象
		this.poster = poster;
		this.posterItemMain = this.poster.find('.poster-list');
		this.nextBtn = this.poster.find('.poster-prev-btn');
		this.prevBtn = this.poster.find('.poster-next-btn');
		this.posterItems = this.poster.find('.poster-item');
			// 判断偶数张图片的情况
			//if(this.posterItems.size() % 2 === 0) {
			//	this.posterItemMain.append(this.posterItems.first().clone());
			//	this.posterItems = this.poster.find('.poster-item');
			//}
		this.posterFirstItem = this.posterItems.first();
		this.posterLastItem = this.posterItems.last();
		// 默认配置参数
		this.setting = {
			"width": 1000,
			"height": 270,
			"posterWidth": 640,
			"posterHeight": 270,
			"scale": 0.8,
			"autoPlay": true,
			"delay": 2000,
			"speed": 300,
			"vericalAlign": "top"
		};
		$.extend(this.setting, this.getSetting());
		// 设置配置参数
		this.setSettingValue();
		this.setPosterPose();
		// 点击旋转按钮函数
		var self = this;
		this.rotateFlag = true;
		this.nextBtn.on('click', function () {
			if (self.rotateFlag === true) {
				self.rotateFlag = false;
				self.carouseRotate('left');
			} else {
				return;
			}
		});
		this.prevBtn.on('click', function () {
			if (self.rotateFlag === true) {
				self.rotateFlag = false;
				self.carouseRotate('right');
			} else {
				return;
			}
		});
		// 是否自动播放
		if (this.setting.autoPlay === true) {
			this.poster.hover(function () {
				window.clearInterval(self.timer);
			}, function () {
				self.autoPlay();
			});
			this.autoPlay();
		}
	};
	Carousel.prototype = {
		// 获取人工配置参数
		getSetting: function () {
			var setting = this.poster.attr('data-setting');
			return $.parseJSON(setting);
		},
		// 设置默认配置参数
		setSettingValue: function () {
			this.poster.css({
				width: this.setting.width,
				height: this.setting.height
			});
			this.posterItemMain.css({
				width: this.setting.posterWidth,
				height: this.setting.posterHeight
			});
			//计算上下切换按钮的宽度
			var w = (this.setting.width - this.setting.posterWidth) / 2;
			//设置切换按钮的宽高，层级关系
			this.nextBtn.css({
				width: w,
				height: this.poster.height,
				zIndex: Math.ceil(this.posterItems.size() / 2)
			});
			this.prevBtn.css({
				width: w,
				height: this.poster.height,
				zIndex: Math.ceil(this.posterItems.size() / 2)
			});
			this.posterFirstItem.css({
				width: this.setting.posterWidth,
				height: this.setting.posterHeight,
				left: w,
				top: 0,
				zIndex: Math.floor(this.posterItems.size() / 2)
			})
		},
		// 设置剩余的帧的位置关系
		setPosterPose: function () {
			var self = this;
			var sliceItems = this.posterItems.slice(1),
				sliceSize = sliceItems.size() / 2,
				rightSlice = sliceItems.slice(0, sliceSize),
				leftSlice = sliceItems.slice(sliceSize),
				level = Math.floor(this.posterItems.size() / 2);

			//设置右边帧的位置关系和宽度高度top
			var rw = this.setting.posterWidth,
				rh = this.setting.posterHeight,
				gap = (this.setting.width - this.setting.posterWidth) / 2 / level;
			var firstLeft = (this.setting.width - this.setting.posterWidth) / 2;
			var fixOffsetLeft = firstLeft + rw;
			//设置右边位置关系
			rightSlice.each(function (index, el) {
				level--;
				rw = rw * self.setting.scale;
				rh = rh * self.setting.scale;
				var j = index;
				$(this).css({
					zIndex: level,
					width: rw,
					height: rh,
					opacity: 1 / (++j),
					left: fixOffsetLeft + gap * (++index) - rw,
					top: self.setVerticalAlign(self.setting.verticalAlign)
				})
			});
			//设置左边位置关系
			var lw = rightSlice.last().width(),
				lh = rightSlice.last().height(),
				oloop = Math.floor(this.posterItems.size() / 2);
			leftSlice.each(function (index) {
				$(this).css({
					zIndex: index,
					width: lw,
					height: lh,
					opacity: 1 / oloop,
					left: index * gap,
					top: self.setVerticalAlign(self.setting.verticalAlign)
				});
				lw = lw / self.setting.scale;
				lh = lh / self.setting.scale;
				oloop--;
			})


		},
		// 设置旋转木马垂直对齐方式
		setVerticalAlign: function (height) {
			var verticalType = this.setting.vericalAlign,
				top = 0;
			if (verticalType === 'middle') {
				top = (this.setting.height - height) / 2;
			} else if (verticalType === 'top') {
				top = 0;
			} else {
				top = this.setting.height - this.setting.posterHeight;
			}
			return top;
		},
		// 旋转函数
		carouseRotate: function (dir) {
			var _this_ = this;
			var zIndexArr = [];
			// 左旋转
			if (dir === 'left') {
				this.posterItems.each(function () {
					var self = $(this),
						prev = self.prev().get(0) ? self.prev() : _this_.posterLastItem,
						width = prev.width(),
						height = prev.height(),
						zIndex = prev.css("zIndex"),
						opacity = prev.css("opacity"),
						left = prev.css("left"),
						top = prev.css("top");
					zIndexArr.push(zIndex);
					self.animate({
						width: width,
						height: height,
						opacity: opacity,
						left: left,
						top: top
					}, _this_.setting.speed, function () {
						_this_.rotateFlag = true;
					});
				});
				//zIndex需要单独保存再设置，防止循环时候设置再取的时候值永远是最后一个的zindex
				this.posterItems.each(function (i) {
					$(this).css({'zIndex': zIndexArr[i]});
				});
			} else if (dir === 'right') {     // 右旋转
				this.posterItems.each(function () {
					var self = $(this),
						next = self.next().get(0) ? self.next() : _this_.posterFirstItem,
						width = next.width(),
						height = next.height(),
						zIndex = next.css("zIndex"),
						opacity = next.css("opacity"),
						left = next.css("left"),
						top = next.css('top');
					zIndexArr.push(zIndex);
					self.animate({
						width: width,
						height: height,
						opacity: opacity,
						left: left,
						top: top
					}, _this_.setting.speed, function () {
						_this_.rotateFlag = true;
					});
				});
				//zIndex需要单独保存再设置，防止循环时候设置再取的时候值永远是最后一个的zindex
				this.posterItems.each(function (i) {
					$(this).css({'zIndex': zIndexArr[i]});
				});
			}
		},
		// 自动播放
		autoPlay: function () {
			var self = this;
			this.timer = window.setInterval(function () {
				self.nextBtn.click();
			}, this.setting.delay);
		}
	};
	Carousel.init = function (poster, index) {
		poster.each(function (i) {
			new Carousel(poster);
		})
	};

	window.Carousel = Carousel;
})(jQuery);