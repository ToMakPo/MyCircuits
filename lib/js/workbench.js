var workbench = null
function createWorkbench() {
    workbench = new Workbench(3000, 3000)
}

function Workbench (width, height, zoom) {
    var _canvas, _svg, _element, _children, _width, _height, _zoom, _cuttingBoard, _view, _viewport, _dpmm, _zoomText, _canvasWidth, _canvasHeight
    function construct(self) {
        _width = width
        _height = height
        _zoom = (zoom !== undefined && zoom !== null) ? clamp(zoom, 1) : 1
        _view = {x: _width / 2, y: _height / 2}
        _dpmm = Math.sqrt(3440 ** 2 + 1440 ** 2) / 34 / 25.4 // dots per mm

        _children = []

        draw(self)
    }
    function draw(self) {
        _canvasWidth = document.getElementById('viewport').clientWidth
        _canvasHeight = document.getElementById('viewport').clientHeight
        var zx = _view.x * (1 - (_canvasWidth / (_dpmm / _zoom * _width)))
        var zy = _view.y * (1 - (_canvasHeight / (_dpmm / _zoom * _height)))
        var zw = _canvasWidth / _dpmm * _zoom
        var zh = _canvasHeight / _dpmm * _zoom

        _canvas = SVG('viewport')
            .attr('id', 'Canvas')
            .attr('class', 'canvas')

        _svg = _canvas.nested(zx, zy, zw, zh)
            .attr('id', 'Workbench')
            .attr('class', 'workbench')

        _viewport = _svg.viewbox(zx, zy, zw, zh)

        _element = document.getElementById('Workbench')

        drawCuttingBoard(self)
        drawGUI(self)
    }
    function drawCuttingBoard(self) {
        var bgColor = '#DDD'

        _cuttingBoard = _svg.group()
            .attr('id', 'Cuttingboard')

        _cuttingBoard
            .rect(_width, _height)
            .fill(bgColor)

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
        var d = 'M 0,0 l 20,20 h-10 v20 h-20 v-20 h-10 z'
        var pad = 25

        var gui = _canvas.group()
            .attr('id', 'GUI')
        gui.path(d)
            .attr('id', 'GUI_upArrow')
            .attr('class', 'arrow button')
            .fill('white')
            .center(_canvasWidth / 2, pad)
            .stroke({ color: '#666', width: 2 })
            .click(function() {
                _view.y -= 10
                self.redraw()
            })
        gui.path(d)
            .attr('id', 'GUI_downArrow')
            .attr('class', 'arrow button')
            .fill('white')
            .center(_canvasWidth / 2, _canvasHeight - pad)
            .rotate(180)
            .stroke({ color: '#666', width: 2 })
            .click(function() {
                _view.y += 10
                self.redraw()
            })
        gui.path(d)
            .attr('id', 'GUI_rightArrow')
            .attr('class', 'arrow button')
            .fill('white')
            .center(_canvasWidth - pad, _canvasHeight / 2)
            .rotate(90)
            .stroke({ color: '#666', width: 2 })
            .click(function() {
                _view.x += 100
                self.redraw()
            })
        gui.path(d)
            .attr('id', 'GUI_leftArrow')
            .attr('class', 'arrow button')
            .fill('white')
            .center(pad, _canvasHeight / 2)
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
            .attr('id', 'GUI_zoomButtons')

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
            .attr('id', 'GUI_zoomText')
            .center(cx, cy)
            .fill('white')

        var t = d * 0.15
        var s = d * 0.5

        var zi = zb.group()
            .attr('id', 'GUI_zoomIn')
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
            .attr('id', 'GUI_zoomOut')
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

        for (const [type, typeList] of Object.entries(_children)) {
            for (const [id, obj] of Object.entries(typeList)) {
                obj.fixZoom()
            }
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

    this.getDPMM = function() {
        return _dpmm
    }

    this.redraw = function() {
        var oldWidth = _canvasWidth
        var oldHeight = _canvasHeight
        _canvasWidth = document.getElementById('viewport').clientWidth
        _canvasHeight = document.getElementById('viewport').clientHeight
        var zx = _view.x * (1 - (_canvasWidth / (_dpmm / _zoom * _width)))
        var zy = _view.y * (1 - (_canvasHeight / (_dpmm / _zoom * _height)))
        var zw = _canvasWidth / _dpmm * _zoom
        var zh = _canvasHeight / _dpmm * _zoom

        _svg.viewbox(zx, zy, zw, zh)

        var dw = oldWidth - _canvasWidth
        var dh = oldHeight - _canvasHeight
        SVG.get('GUI_upArrow')
            .dx(-dw / 2)
        SVG.get('GUI_downArrow')
            .dx(dw / 2)
            .dy(dh)
        SVG.get('GUI_leftArrow')
            .dx(dh / 2)
        SVG.get('GUI_rightArrow')
            .dx(-dh / 2)
            .dy(dw)
    }

    construct(this)
}
