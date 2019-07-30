var workbench = null
function createWorkbench() {
    workbench = new Workbench(3000, 3000)
}

function Workbench (width, height, zoom) {
    var _canvas, _svg, _element, _children, _width, _height, _zoom, _cuttingBoard, _view, _viewport, _dpmm, _zoomText
    function construct(self) {
        _width = width
        _height = height
        _zoom = (zoom !== undefined && zoom !== null) ? clamp(zoom, 1) : 1
        _view = {x: _width / 2, y: _height / 2}
        _dpmm = Math.sqrt(3440 ** 2 + 1440 ** 2) / 34 / 25.4 // dots per mm
        console.log(_dpmm);

        _children = []

        draw(self)
    }
    function draw(self) {
        _canvas = SVG('viewport')
            .attr('id', 'Canvas')
            .attr('class', 'canvas')

        _svg = _canvas.nested()
            .attr('id', 'Workbench')
            .attr('class', 'workbench')

        drawCuttingBoard(self)

        var canvasWidth = document.getElementById('Canvas').clientWidth
        var canvasHeight = document.getElementById('Canvas').clientHeight
        var zx = _view.x * (1 - (canvasWidth / (_dpmm / _zoom * _width)))
        var zy = _view.y * (1 - (canvasHeight / (_dpmm / _zoom * _height)))
        var zw = canvasWidth / _dpmm * _zoom
        var zh = canvasHeight / _dpmm * _zoom

        _viewport = _svg.viewbox(zx, zy, zw, zh)

        _element = document.getElementById('Workbench')

        drawGUI(self)
    }
    function drawCuttingBoard(self) {
        //var bgColor = '#1c6306'
        var bgColor = '#DDD'

        _cuttingBoard = _svg.group()
            .attr('id', 'Cuttingboard')

        _cuttingBoard
            .rect(_width, _height)
            .fill(bgColor)

        //var lineColor = '#ccdbc8'
        var lineColor = '#AAA'
        var d = 10
        var o = 0.75

        for (var i = 0; i * d <= _width; i++) {
            var x = i * d
            var t = (i % 10 == 0) ? 1.5 : (i % 10 == 5) ? 0.75 : 0.5
            _cuttingBoard
                .line(x, 0, x, _height)
                .stroke({ color: lineColor, opacity: o, width: t })
        }

        for (var i = 0; i * d <= _height; i++) {
            var y = i * d
            var t = (i % 10 == 0) ? 1.5 : (i % 10 == 5) ? 0.75 : 0.5
            _cuttingBoard
                .line(0, y, _width, y)
                .stroke({ color: lineColor, opacity: o, width: t })
        }
    }
    function drawGUI(self) {
        var canvasWidth = document.getElementById('Canvas').clientWidth
        var canvasHeight = document.getElementById('Canvas').clientHeight

        var d = 'M 0,0 l 20,20 h-10 v20 h-20 v-20 h-10 z'
        var pad = 25

        var gui = _canvas.group()
            .attr('id', 'GUI')
        gui.path(d)
            .attr('id', 'UpArrow')
            .attr('class', 'arrow button')
            .fill('white')
            .center(canvasWidth / 2, pad)
            .stroke({ color: '#666', width: 2 })
            .click(function() {
                _view.y -= 10
                self.redraw()
            })
        gui.path(d)
            .attr('id', 'downArrow')
            .attr('class', 'arrow button')
            .fill('white')
            .center(canvasWidth / 2, canvasHeight - pad)
            .rotate(180)
            .stroke({ color: '#666', width: 2 })
            .click(function() {
                _view.y += 10
                self.redraw()
            })
        gui.path(d)
            .attr('id', 'rightArrow')
            .attr('class', 'arrow button')
            .fill('white')
            .center(canvasWidth - pad, canvasHeight / 2)
            .rotate(90)
            .stroke({ color: '#666', width: 2 })
            .click(function() {
                _view.x += 100
                self.redraw()
            })
        gui.path(d)
            .attr('id', 'leftArrow')
            .attr('class', 'arrow button')
            .fill('white')
            .center(pad, canvasHeight / 2)
            .rotate(-90)
            .stroke({ color: '#666', width: 2 })
            .click(function() {
                _view.x -= 100
                self.redraw()
            })

        var ziX = 20
        var zoX = 100
        var cd = zoX - ziX
        var cx = cd / 2 + ziX
        var cy = 20
        var d = 20
        var r = d / 2
        var b = d + 10

        var zb = gui.group()
            .attr('id', 'zoomButtons')

        zb.circle(b)
            .fill('#666')
            .center(ziX, cy)

        zb.circle(b)
            .fill('#666')
            .center(zoX, cy)

        zb.rect(cd, b)
            .fill('#666')
            .center(cx, cy)

        _zoomText = zb.text(`${Math.round(1 / _zoom * 100)}%`)
            .attr('id', 'zoomText')
            .center(cx, cy)
            .fill('white')

        var t = d * 0.15
        var s = d * 0.5

        var zi = zb.group()
            .attr('id', 'zoomIn')
            .addClass('button')
            .click(function() {
                _zoom *= 1.61803399 / 2
                changeZoom(self, cx, cy)
            })

        zi.circle(d)
            .fill('white')

        zi.rect(s, t)
            .fill('#666')
            .center(r, r)

        zi.rect(t, s)
            .fill('#666')
            .center(r, r)

        zi.center(ziX, cy)

        var zo = zb.group()
            .attr('id', 'zoomOut')
            .addClass('button')
            .click(function() {
                _zoom /= 1.61803399 / 2
                changeZoom(self, cx, cy)
            })

        zo.circle(d)
            .fill('white')

        zo.rect(s, t)
            .fill('#666')
            .center(r, r)

        zo.center(zoX, cy)
    }
    function changeZoom(self, cx, cy) {
        _zoomText.text(`${Math.round(1 / _zoom * 100)}%`)
            .center(cx, cy)
        self.redraw()

        for (const [id, point] of Object.entries(_children['point'])) {
            point.fixZoom()
        }
    }

    this.getWidth = function() {
        return _width
    }
    this.getHeight = function() {
        return _height
    }

    this.setZoom = function(zoom) {
        _zoom = clamp(zoom, 0, null, 1)

        this.redraw()
    }
    this.getZoom = function() {
        return _zoom
    }

    this.setView = function(x, y) {
        _view = {x: _width / 2, y: _height / 2}

        this.redraw()
    }
    this.getViewX = function() {
        return _view.x
    }
    this.getViewY = function() {
        return _view.y
    }

    this.getTypeList = function(type) {
        return (type in _children) ? _children[type] : null
    }
    this.getChild = function(type, id) {
        var typeList = getTypeList(type)

        return (typeList !== null && id in typeList) ? typeList[id] : null
    }
    this.addChild = function(child) {
        var type = child.getType()
        var typeList = this.getTypeList(type)
        if (typeList == null) {
            typeList = _children[type] = {}
        }

        var id = child.getID()
        if (!(id in typeList)) {
            typeList[id] = child
        } else {
            throw new Error('Could not add child to workbench because child id is not unique.')
        }
    }
    this.removeChild = function(child) {
        var type = child.getType()
        var typeList = getTypeList(type)
        if (typeList == null) {
            typeList = _children[type] = {}
        }

        var id = child.getID()
        if (id in typeList) {
            delete typeList[id]
        } else {
            throw new Error('Could not remove child from workbench because child id is not found.')
        }
    }

    this.getCanvas = function() {
        return _canvas
    }
    this.getSVG = function() {
        return _svg
    }

    this.redraw = function() {
        var canvasWidth = document.getElementById('Canvas').clientWidth
        var canvasHeight = document.getElementById('Canvas').clientHeight
        var zx = _view.x * (1 - (canvasWidth / (_dpmm / _zoom * _width)))
        var zy = _view.y * (1 - (canvasHeight / (_dpmm / _zoom * _height)))
        var zw = canvasWidth / _dpmm * _zoom
        var zh = canvasHeight / _dpmm * _zoom

        _viewport.animate(100).viewbox(zx, zy, zw, zh)
    }

    construct(this)
}
