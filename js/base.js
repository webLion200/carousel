;(function () {
	var $carousel = $('[data-role="carousel"]');
	var $imgList = $carousel.find('[data-role="img-list"]');
	var $imgs = $imgList.find('li');
	var imgs_length = $imgs.length;
	var $indexList = $carousel.find('[data-role="index-list"]');
	var $arrowLeft = $carousel.find('[data-role="arrow-left"]');
	var $arrowRight = $carousel.find('[data-role="arrow-right"]');
	window.onload = function () {
		var left = $imgList.position().left;
		var timer = setInterval(run_carousel, 1000);

		function run_carousel() {
			run_left();
		}

		$arrowLeft.on('click', run_left);
		$arrowRight.on('click', run_right);

		function run_left() {
			left -= 640;
			console.log('left1', left);
			if (left <= -640 * imgs_length) {
				left = 0;
			}
			run_img();
		}

		function run_right() {
			left += 640;
			if (left > 0) {
				left = -640 * (imgs_length - 1);
			}
			run_img();
		}

		function run_img() {
			$imgList.animate({
				left: left + 'px'
			}, 500);

		}
	}
})();