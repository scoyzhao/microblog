/*
 For navbar, but not work..
 */

window.onload = function() {
	var oUl = document.getElementsByTagName('ul')[0];
	var aLi = oUl.getElementsByTagName('li');

	for (var i = 0; i < aLi.length; i++) {
		aLi[i].onclick = function() {
			for (var i = 0; i < aLi.length; i++) {
				aLi[i].className = '';
			}
			this.className = 'active';
		}
	}
}
