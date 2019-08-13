Component.prototype = Object.create(Asset.prototype)
Component.prototype.constructor = Component
function Component (width, height, x, y, rotation, type, name, discription, displayName, displayDiscription, displayXY, id, elmID, visible, opacity, draggable, parent) {
    Asset.call(this, x, y, getValue(type, 'component'), name, discription, displayName, displayDiscription, displayXY, id, elmID, visible, opacity, getValue(draggable, true), parent)

    var _width, _height, _rotation, _nodes, _bounds, _boundsBox, _rotateHandle, _moveHandle
    function construct(self) {
        _width = clamp(width, 0, null, 1)
        _height = clamp(height, 0, null, 1)
        _rotation = getValue(rotation, 0)

        _nodes = {}

        draw(self)
    }
    function draw(self) {
        var svg = self.getSVG()

        var x = self.getX(), y = self.getY()
        var sr = Math.min(_width, _height) * 0.2
        var r = sr / 2
        var nodeOpacity = 0.5

        var nodeColor = '#fcba03'
        NodeBuilder(self, 'Center', self.getX(), self.getY())
            .setColor(nodeColor)
            .setOpacity(nodeOpacity)
            .setSnapRadius(-1)
            .setRadius(clamp(r, 2, 10))
            .build()

        nodeColor = '#6cad7d'
        NodeBuilder(self, 'CornerTL', -_width / 2, -_height / 2)
            .setColor(nodeColor)
            .setOpacity(nodeOpacity)
            .setSnapRadius(sr)
            .setRadius(r)
            .build()
        NodeBuilder(self, 'CornerTR', _width / 2, -_height / 2)
            .setColor(nodeColor)
            .setOpacity(nodeOpacity)
            .setSnapRadius(sr)
            .setRadius(r)
            .build()
        NodeBuilder(self, 'CornerBL', -_width / 2, _height / 2)
            .setColor(nodeColor)
            .setOpacity(nodeOpacity)
            .setSnapRadius(sr)
            .setRadius(r)
            .build()
        NodeBuilder(self, 'CornerBR', _width / 2, _height / 2)
            .setColor(nodeColor)
            .setOpacity(nodeOpacity)
            .setSnapRadius(sr)
            .setRadius(r)
            .build()

        nodeColor = '#6c97ad'
        NodeBuilder(self, 'SideT', 0, -_height / 2)
            .setColor(nodeColor)
            .setOpacity(nodeOpacity)
            .setSnapRadius(sr)
            .setRadius(r)
            .build()
        NodeBuilder(self, 'SideB', 0, _height / 2)
            .setColor(nodeColor)
            .setOpacity(nodeOpacity)
            .setSnapRadius(sr)
            .setRadius(r)
            .build()
        NodeBuilder(self, 'SideL', -_width / 2, 0)
            .setColor(nodeColor)
            .setOpacity(nodeOpacity)
            .setSnapRadius(sr)
            .setRadius(r)
            .build()
        NodeBuilder(self, 'SideR', _width / 2, 0)
            .setColor(nodeColor)
            .setOpacity(nodeOpacity)
            .setSnapRadius(sr)
            .setRadius(r)
            .build()

        _bounds = svg
            .group()
            .attr('id', self.getElmID() + '_bounds')

        _boundsBox = _bounds
            .rect(_width, _height)
            .attr('id', self.getElmID() + '_boundsBox')
            .center(x, y)
            .fill('transparent')
        self.fixBoundsBox()

        var d = 'm 3,-10 v -1 l 2,2 -2,2 v -1 c -1,0 -2,0.8 -2,2 h 1 l -2,2 -2,-2 h 1 c 0,-2.175 1.75,-4 4,-4 z'
        _rotateHandle = _bounds.path(d)
            .attr('id', self.getElmID() + '_handle-rotate')
            .move(x - _width / 2 - 5, y - _height / 2 - 5)
            .addClass('handle')
            .fill('#6BB1C77F')
            .stroke({color: '#666', width: 0.25})

        d = 'm -5,0 2,-2 v 1 h 2 v -2 h -1 l 2,-2 2,2 h -1 v 2 h 2 v -1 l 2,2 -2,2 v -1 h -2 v 2 h 1 l -2,2 -2,-2 h 1 v -2 h -2 v 1 z'
        _moveHandle = _bounds.path(d)
            .attr('id', self.getElmID() + '_handle-move')
            .move(x + _width / 2 - 2, y - _height / 2 - 8)
            .addClass('handle')
            .fill('#6BB1C77F')
            .stroke({color: '#666', width: 0.25})

        self.getLabel()
            .move(x + self.getWidth() / 2, y + self.getHeight() / 2)
            .front()
    }

    this.getWidth = function() {
        return _width
    }
    this.getHeight = function() {
        return height
    }

    this.move = function(x, y) {
        var dist = Math.sqrt(x ** 2 + y ** 2)
        var spd = animationSpeed * dist / 100

        var xy = this.getXY()
        xy.setX(xy.getX() + x)
        xy.setY(xy.getY() + y)

        this.getSVG()
            .animate(spd)
            .dmove(x, y)

        this.setLabel()

        this.fixNodeLabels()
    }

    this.rotate = function(degrees) {
        var spd = animationSpeed * Math.abs(degrees) / 5

        _rotation += degrees

        this.getSVG()
            .animate(spd)
            .rotate(_rotation)

        this.fixNodeLabels()
    }
    this.setRotation = function(degrees) {
        this.rotate(_rotation - degrees)
    }
    this.getRotation = function() {
        return _rotation
    }

    this.getNodes = function() {
        return _nodes
    }
    this.showNodes = function() {
        for (const [name, node] of Object.entries(_nodes)) {
            node.show()
        }
    }
    this.hideNodes = function() {
        for (const [name, node] of Object.entries(_nodes)) {
            node.hide()
        }
    }

    this.fixZoom = function() {
        this.fixLabelSize()
        this.fixBoundsBox()
    }
    this.fixBoundsBox = function() {
        var dashes = round(_width * _height / 1.5 / workbench.getZoom())

        _boundsBox
            .stroke({width: workbench.getZoom() * 0.25, dasharray: _width * _height / dashes})
    }
    this.fixNodeLabels = function() {
        for (const [name, node] of Object.entries(_nodes)) {
            node.setLabel()
        }
    }

    this.delete = function() {
        for (const [name, node] of Object.entries(_nodes)) {
            node.delete()
        }

        workbench.removeChild(this)
        this.getElement().parentNode.removeChild(this.getElement())
    }

    construct(this)
}

function ComponentBuilder(width, height, x, y, type) {
    var _width, _height, _x, _y, _rotation, _type, _name, _discription, displayName, _displayDiscription, _displayXY, _id, _elmID, _visible, _opacity, _draggable, _parent

    this.setWidthHeight = function(width, height) {_width = width; _height = height; return this}
    this.setXY = function(x, y) {_x = x; _y = y; return this}
    this.setRotation = function(value) {_rotation = value; return this}
    this.setType = function(value) {_type = value; return this}
    this.setName = function(value) {_name = value; return this}
    this.setDiscription = function(value) {_discription = value; return this}
    this.setDisplayName = function(value) {_displayName = value; return this}
    this.setDisplayDiscription = function(value) {_displayDiscription = value; return this}
    this.setDisplayXY = function(value) {_displayXY = value; return this}
    this.setID = function(value) {_id = value; return thisCoor
    this.setElmID = function(value) {_elmID = value; return this}
    this.setVisibility = function(value) {_visible = value; return this}
    this.setOpacity = function(value) {_opacity = value; return this}
    this.setDraggable = function(value) {_draggable = value; return this}
    this.setParent = function(value) {_parent = value; return this}

    this.build = function() {
        return new Component(_width, _height, _x, _y, _rotation, _type, _name, _discription, _displayName, _displayDiscription, _displayXY, _id, _elmID, _visible, _opacity, _draggable, _parent)
        }
    }

    return this.setWidthHeight(width, height).setXY(x, y).setType(type)
}
