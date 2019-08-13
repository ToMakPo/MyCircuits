var workbench = null
function createWorkbench() {
    workbench = new Workbench(300, 300)
}

function Workbench (width, height, zoom) {
    var _canvas, _svg, _element, _children, _width, _height, _zoom, _cuttingBoard, _view, _viewport, _dpmm, _zoomText, _canvasWidth, _canvasHeight
    function construct(self) {
        _width = width
        _height = height

        _zoom = clamp(zoom, 0, 10, 1)
        _view = new Coordinate(_width / 2, _height / 2)
        self.setDPMM(3440, 1440, 34)

        _children = []

        draw(self)
    }
    function draw(self) {
        _canvasWidth = document.getElementById('viewport').clientWidth
        _canvasHeight = document.getElementById('viewport').clientHeight
        var zx = _view.getX() * (1 - (_canvasWidth / (_dpmm / _zoom * _width)))
        var zy = _view.getY() * (1 - (_canvasHeight / (_dpmm / _zoom * _height)))
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

        var moveDistance = 10 * _zoom

        var gui = _canvas.group()
            .attr('id', 'GUI')
        gui.path(d)
            .attr('id', 'GUI_upArrow')
            .attr('class', 'arrow button')
            .fill('white')
            .center(_canvasWidth / 2, pad)
            .stroke({ color: '#666', width: 2 })
            .click(function() {
                _view.setY(_view.getY() - moveDistance)
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
                _view.setY(_view.getY() + moveDistance)
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
                _view.setX(_view.getX() + moveDistance)
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
                _view.setX(_view.getX() - moveDistance)
                self.redraw()
            })

        var ziX = 20 // zoom in x
        var zoX = 100 // zoom out x
        var cd = zoX - ziX // center difference
        var cx = cd / 2 + ziX // cender x
        var cy = 20 // center y
        var d = 20 // diameter
        var r = d / 2 // radius
        var br = r + 5 // box radius
        var bh = br * 2 // box width
        var bw = cd + bh // box width
        var bx = ziX - br // box x
        var by = cy - br // box y

        var zb = gui.group() // zoom box
            .attr('id', 'GUI_zoomButtons')
            .data('level', _zoom)

        var zr = zb.rect(bw, bh)
            .attr('id', 'GUI_zoomRect')
            .move(bx, by)
            .fill('#666')
            .radius(br)

        var mo = [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5] // menu optins
        var ml = mo.length // menu length
        var moh = bh * 0.7

        var zmn = zb.group() // zoom menu
            .move(bx, by + bh)
            .hide()

        var zmb = zb.path(`M 0,0 h 30 l-15,10 z`)
            .attr('id', 'GUI_zoomMenu')
            .addClass('button')
            .center(cx, by + bh)
            .fill('white')
            .stroke({width: 4, color: '#666'})
            .data('opened', 'false')
            .click(function() {
                if (zmb.data('opened')) {
                    zr.height(bh)
                    zmb.dy(-moh * ml - 10)
                    .data('opened', 'false')
                    zmn.hide()
                } else {
                    zr.height(bh + moh * ml + 10)
                    zmb.dy(moh * ml + 10)
                    .data('opened', 'true')
                    zmn.show()
                }
            })

        _zoomText = zb.text(`${round(1 / _zoom * 100)}%`)
            .attr('id', 'GUI_zoomText')
            .center(cx, cy)
            .fill('white')

        zmn.line(5, 0, bw - 5, 0)
            .stroke({color: 'white', width: 2, linecap: 'round', opacity: 0.5})

        for (var i = 0, h = 5; i < ml; i++, h += moh) {
            var t = zmn.group()
                .attr('id', 'GUI_zoomOption-' + (mo[i] * 100))
                .addClass('button')
                .addClass('zoomOption')
                .move(bx, h)
                .data('option', mo[i] * 100)
                .click(function(a) {
                    var n = 1
                    for (var j = 0; j < a.path.length; j++) {
                        var opt = a.path[j].dataset.option
                        if (opt > 0) {
                            n = opt / 100
                            break
                        }
                    }
                    _zoom = 1 / n
                    changeZoom(self, cx, cy)
                    zr.height(bh)
                    zmb.dy(-moh * ml - 10)
                    .data('opened', 'false')
                    zmn.hide()
                })
            t.rect(bw - 10, moh - 2)
                .fill('transparent')
                .addClass('zoomOption-box')
            var tt = t.text(`${mo[i] * 100}%`)
                .fill('white')
            tt.dmove(bw - tt.node.clientWidth - 15, -6)
        }

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
        return _view.getX()
    }
    this.getViewY = function() {
        return _view.getY()
    }

    this.getTypeList = function(type) {
        return (type in _children) ? _children[type] : null
    }
    this.getChild = function(type, id) {
        var typeList = getTypeList(type)

        return getValue(typeList[id], null)
    }
    this.addChild = function(child) {
        /**
         * Add a child asset to the workbench
         *
         * @param {Asset} child the child to be added
         */
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
        if (typeList !== null) {
            var id = child.getID()

            if (id in typeList) {
                delete typeList[id]
            } else {
                throw new Error(`Could not remove child from workbench because child id [${id}] is not found.`)
            }
        } else {
            throw new Error(`Could not remove child from workbench because child type [${type}] is not found.`)
        }
    }

    this.getCanvas = function() {
        return _canvas
    }
    this.getSVG = function() {
        return _svg
    }

    this.setDPMM = function(pxWidth, pxHeight, diagonalInch) {
        _dpmm = Math.sqrt(pxWidth ** 2 + pxHeight ** 2) / diagonalInch / 25.4 // dots per mm
    }
    this.getDPMM = function() {
        return _dpmm
    }

    this.redraw = function() {
        var oldWidth = _canvasWidth
        var oldHeight = _canvasHeight
        _canvasWidth = document.getElementById('viewport').clientWidth
        _canvasHeight = document.getElementById('viewport').clientHeight
        var zx = _view.getX() * (1 - (_canvasWidth / (_dpmm / _zoom * _width)))
        var zy = _view.getY() * (1 - (_canvasHeight / (_dpmm / _zoom * _height)))
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
