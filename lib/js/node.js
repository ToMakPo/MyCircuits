Node.prototype = Object.create(Point.prototype)
Node.prototype.constructor = Node
function Node (parent, name, u, v, color, snapRadius, snapList, diameter, radius, discription, displayName, displayDiscription, displayXY, displayUV, id, elmID, visible, opacity, draggable) {
    var elmID = `${parent.getElmID()}_${lowerFirst(name).replace(' ', '')}-node`
    var color = getValue(color, '#CF540C')
    var x = parent.getX() + u, y = parent.getY() + v
    Point.call(this, x, y, color, snapRadius, snapList, diameter, radius, discription, name, displayName, displayDiscription, displayXY, id, elmID, visible, opacity, draggable, parent)

    var _uv, _displayUV

    function construct(self) {
        _uv = new Coordinate(u, v, 'u', 'v')

        parent.getNodes()[name] = self

        var cls = (name !== 'Node') ? name.replace(' ', '').toLowerCase() : ''

        self.getSVG()
            .addClass('node')
            .addClass(cls)
            .attr('id', self.getElmID())

        self.hideLabel()
    }

    this.getXY = function() {
        var parent = getXY(this.getParent())
        parent.r = this.getParent().getRotation()

        var distance = Math.sqrt(_uv.getU() ** 2 + _uv.getV() ** 2)

        var degrees = parent.r + Math.atan2(_uv.getV(), _uv.getU()) * 180 / Math.PI // range (-180, 180]
        var radians = degrees * (Math.PI / 180)

        return new Coordinate(
            parent.getX() + (Math.cos(radians) * distance),
            parent.getY() + (Math.sin(radians) * distance)
        )
    }
    this.getX = function() {
        return this.getXY().getX()
    }
    this.getY = function() {
        return this.getXY().getY()
    }
    this.setU = function(u) {
        this.move(u - _uv.getU(), 0)
    }
    this.getU = function() {
        return _uv.getU()
    }
    this.setV = function(v) {
        this.move(0, v - _uv.getV())
    }
    this.getV = function() {
        return _uv.getV()
    }
    this.setUV = function(u, v) {
        this.move(u - _uv.getU(), v - _uv.getV())
    }
    this.getUV = function() {
        return _uv
    }
    this.move = function(u, v) {
        var dist = Math.sqrt(u ** 2 + v ** 2)
        var spd = animationSpeed * dist / 100

        _uv.setU(_uv.getU() + u)
        _uv.setV(_uv.getV() + v)

        this.getSVG().animate(spd)
            .dmove(u, v)
    }

    this.setLabel = function() {
        var line1 = []
        if (this.displayName()) line1.push(this.getName())
        if (this.displayDiscription()) line1.push(this.getDiscription())
        line1 = label.join(': ')

        var label = []
        if (line1 !== '') label.push(line1)
        if (this.displayXY()) label.push(this.getXY().toString(true))
        var text = label.join('\n')

        _label.text(array.join('\n'))

        if (text !== '') {
            _label.show()
        } else {
            _label.hide()
        }
    }
    this.displayUV = function(display) {
        if (isNull(display)) {
            return _displayUV
        } else {
            if (display === true) _displayUV = true
            if (display === false) _displayUV = false

            this.setLabel()
        }
    }

    this.fixMove = function() {
        this.setLabel()
    }

    this.toString = function() {
        return `NODE['${this.getElmID()}'] {discription: '${this.getDiscription()}', xy: ${this.getXY().toString()}, uv: ${this.getUV().toString()}}`
    }

    construct(this)
}

function NodeBuilder(parent, name, u, v) {
    var _parent, _name, _u, _v, _color, _snapRadius, _snapList, _diameter, _radius, _name, _discription, _displayName, _displayDiscription, _displayXY, _displayUV, _id, _elmID, _visible, _opacity, _draggable

    this.setParent = function(value) {_parent = value; return this}
    this.setName = function(value) {_name = value; return this}
    this.setUV = function(u, v) {_u = u; _v = v; return this}
    this.setColor = function(value) {_color = value; return this}
    this.setDiameter = function(value) {_diameter = value; _radius = value / 2; return this}
    this.setRadius = function(value) {_radius = value; _diameter = value * 2; return this}
    this.setSnapRadius = function(value) {_snapRadius = value; return this}
    this.addSnapPoint = function(value) {_snapList.push(value); return this}
    this.setDiscription = function(value) {_discription = value; return this}
    this.setDisplayName = function(value) {_displayName = value; return this}
    this.setDisplayDiscription = function(value) {_displayDiscription = value; return this}
    this.setDisplayXY = function(value) {_displayXY = value; return this}
    this.setDisplayUV = function(value) {_displayUV = value; return this}
    this.setID = function(value) {_id = value; return this}
    this.setElmID = function(value) {_elmID = value; return this}
    this.setVisibility = function(value) {_visible = value; return this}
    this.setOpacity = function(value) {_opacity = value; return this}
    this.setDraggable = function(value) {_draggable = value; return this}

    _snapList = []

    this.build = function() {
        return new Node(_parent, _name, _u, _v, _color, _snapRadius, _snapList, _diameter, _radius, _discription, _displayName, _displayDiscription, _displayXY, _displayUV, _id, _elmID, _visible, _opacity, _draggable)
    }

    return this.setParent(parent).setName(name).setUV(u, v)
}
