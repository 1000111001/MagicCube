export class Debugger {
	constructor() {
		var uiPanel = document.querySelector('#ui')
		uiPanel.addEventListener('contextmenu', function (e) {
			e.preventDefault()
		}) //屏蔽右键菜单
	}

	renderFps(fps, drawcall) {
		const dpr = window.devicePixelRatio
		document.body.style.fontSize = `${15 / dpr}px`
		document.querySelector('#info').textContent = `Debug Info
---------+------------
fps      | ${fps}
drawcall | ${drawcall}`
	}
}
