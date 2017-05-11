/*
 For navbar, but not work..
 */

window.onload = function() {
	var aLi = document.getElementsByTagName('li');

	for (var i = 0; i < aLi.length; i++) {
		aLi[i].onclick = function() {
			for (var i = 0; i < ali.length; i++) {
				ali[i].className = '';
			}
			this.className = 'active';
		}
	}
	//alert(aLi.length);
}
