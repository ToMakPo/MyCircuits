Node.prototype = Object.create(Point.prototype)
Node.prototype.constructor = Node
function Node (parent, name, u, v, color, label, snapRadius, snapList, diameter, radius, id, visible, opacity, draggable) {
    var id = getUniqueID('point', (id < 0) ? 0 : id)
    var name = (name === undefined || name === null || name in parent.getNodes()) ? `Node${id}` : name.replace(' ', '')
    var s = (name.charAt(0).toLowerCase() + name.slice(1)).replace(' ', '')
    var elmID = `${parent.getElmID()}_${s}-node`
    var color = (color !== undefined && color !== null) ? color : '#CF540C'
    Point.call(this, parent.getX() + u, parent.getY() + v, color, label, snapRadius, snapList, diameter, radius, id, elmID, name, visible, opacity, draggable, parent)

    var _u, _v

    function construct(self) {
        _u = u
        _v = v

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

        var distance = Math.sqrt(_u ** 2 + _v ** 2)

        var degrees = parent.r + Math.atan2(_v, _u) * 180 / Math.PI // range (-180, 180]
        var radians = degrees * (Math.PI / 180)

        return {
            x: parent.x + (Math.cos(radians) * distance),
            y: parent.y + (Math.sin(radians) * distance)
        }
    }
    this.getX = function() {
        return this.getXY().x
    }
    this.getY = function() {
        return this.getXY().y
    }
    this.setU = function(u) {
        this.move(u - _u, 0)
    }
    this.getU = function() {
        return _u
    }
    this.setV = function(v) {
        this.move(0, v - _v)
    }
    this.getV = function() {
        return _v
    }
    this.setUV = function(u, v) {
        this.move(u - _u, v - _v)
    }
    this.move = function(u, v) {
        var dist = Math.sqrt(u ** 2 + v ** 2)
        var spd = animationSpeed * dist / 100

        _u += u
        _v += v

        this.getSVG().animate(spd)
            .dmove(u, v)
    }

    this.fixMove = function() {
        var str = ((this.getLabel() != '') ? this.getLabel() + '\n' : '') + `(${Math.round(this.getX() * 100) / 100}, ${Math.round(this.getY() * 100) / 100})`
        SVG.get(this.getElmID() + '_text')
            .text(str)
    }

    this.toString = function() {
        return `NODE['${this.getParent().getElmID()}_${this.getName()}'] {label: '${this.getLabel()}', xy: (${this.getX()}, ${this.getY()}), uv: (${this.getU()}, ${this.getV()})}`
    }

    construct(this)
}

function NodeBuilder(parent, name, u, v) {
    var _parent, _name, _u, _v, _color, _label, _snapRadius, _snapList, _diameter, _radius, _id, _visible, _opacity, _draggable

    this.setParent = function(value) {_parent = value; return this}
    this.setName = function(value) {_name = value; return this}
    this.setU = function(value) {_u = value; return this}
    this.setV = function(value) {_v = value; return this}
    this.setColor = function(value) {_color = value; return this}
    this.setLabel = function(value) {_label = value; return this}
    this.setSnapRadius = function(value) {_snapRadius = value; return this}
    this.addSnapAsset = function(value) {_snapList.push(value); return this}
    this.setDiameter = function(value) {_diameter = value; return this}
    this.setRadius = function(value) {_radius = value; return this}
    this.setID = function(value) {_id = value; return this}
    this.setVisibility = function(value) {_visible = value; return this}
    this.setOpacity = function(value) {_opacity = value; return this}
    this.setDraggable = function(value) {_draggable = value; return this}

    _snapList = []

    this.build = function() {
        return new Node(_parent, _name, _u, _v, _color, _label, _snapRadius, _snapList, _diameter, _radius, _id, _visible, _opacity, _draggable)
    }

    return this.setName(name).setParent(parent).setU(u).setV(v)
}
