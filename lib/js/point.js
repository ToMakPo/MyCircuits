function Point (x, y, color, label, snapRadius, snapList, diameter, radius, id, elmID, name, visible, opacity, draggable, parent) {
    var _x, _y, _color, _label, _snapRadius, _snapList, _diameter, _radius, _id, _name, _svg, _element, _elmID, _visible, _opacity, _draggable, _parent, _displayLabel
    function construct(self) {
        _x = x
        _y = y

        _color = (color !== undefined && color !== null) ? color : '#666'

        if (diameter !== undefined && diameter !== null) {
            _diameter = clamp(diameter, 0)
            _radius = _diameter / 2
        } else if (radius !== undefined && radius !== null) {
            _radius = clamp(radius, 0)
            _diameter = _radius * 2
        } else {
            _diameter = 5
            _radius = _diameter / 2
        } 

        _snapRadius = (snapRadius !== undefined && snapRadius !== null) ? snapRadius : _radius * 3 // distance at which other points are able to snap onto this (-1 means that it cannot be snapped onto)
        _snapList = (snapList !== undefined && snapList !== null) ? snapList : [] // list of objects that are snapped to this point

        _type = 'point'
        _name = (name !== undefined && name !== null) ? name : 'Point'
        _label = (label !== undefined && label !== null) ? label : ''

        _displayLabel = true

        _id = getUniqueID(_type, id)

        _visible = (visible === true) ? true : false  // if the part is visable on screen
        _opacity = (opacity !== undefined && opacity !== null) ? clamp(opacity, 0, 1) : 0.5 // the amount that this object is visable
        _draggable = (draggable === false) ? false : true // able to be moved

        _parent = (parent !== undefined && parent !== null) ? parent : workbench

        if (_id > 0) workbench.addChild(self)

        draw(self)
    }
    function draw(self) {
        _elmID = (elmID !== undefined && elmID !== null) ? elmID : `${_type}-${(_id > 0) ? _id : 'x' + getUniqueID(_type)}`

        _svg = _parent.getSVG().group()
            .attr('id', _elmID)
            .addClass(_type)
            .opacity(_opacity)

        if (!_visible) _svg.hide()

        var dashes = Math.round(_snapRadius * 2 / workbench.getZoom())

        var snap = _svg
            .circle((_snapRadius > 0) ? _snapRadius * 2 : 0)
            .attr('id', _elmID + '_snap')
            .center(x, y)
            .fill('transparent')
            .stroke({width: workbench.getZoom() * 0.25, 'dasharray': circumference(_snapRadius) / dashes / 2})

        var dot = _svg
            .circle(_diameter)
            .attr('id', _elmID + '_dot')
            .center(x, y)
            .fill(_color)
            .addClass((_draggable) ? 'draggable' : '')

        var str = ((_label != '') ? _label + '\n' : '') + `(${Math.round(x * 100) / 100}, ${Math.round(y * 100) / 100})`
        var txy = self.getTarget(_radius, -45)
        var txt = _svg
            .text(str)
            .attr('id', _elmID + '_text')
            .addClass('label')
            .size(workbench.getZoom() * 3)

        txt.move(txy.x, txy.y)

        if (!_displayLabel) txt.hide()

        _element = document.getElementById(_elmID)
    }
    function getAngleValue(angle) {
    	if (angle < 0) {
            var l = Math.ceil(Math.abs(angle / 360))
            var c = (angle < 0) ? -1 : 1
            var a = (Math.abs(angle) - (l * 360)) * c
    		return a
        } else {
    		return angle % 360
        }
    }

    this.setX = function(x) {
        this.move(x - this.getX(), 0)
    }
    this.getX = function() {
        return _x
    }
    this.setY = function(y) {
        this.move(0, y - this.getY())
    }
    this.getY = function() {
        return _y
    }
    this.setXY = function(x, y) {
        this.move(x - this.getX(), y - this.getY())
    }
    this.getXY = function() {
        return {x: this.getX(), y: this.getY()}
    }
    this.moveTo = function(other) {
        other = getXY(other)
        this.setXY(other.x, other.y)
    }
    this.move = function(x, y) {
        var dist = Math.sqrt(x ** 2 + y ** 2)
        var spd = animationSpeed * dist / 20

        _x += x
        _y += y

        _svg.animate(spd)
            .animate(spd)
            .dmove(x + _radius, y + _radius)

        var str = ((_label != '') ? _label + '\n' : '') + `(${Math.round(_x * 100) / 100}, ${Math.round(_y * 100) / 100})`
        SVG.get(_elmID + '_text')
            .text(str)
    }

    this.getDistanceFrom = function(other) {
        other = getXY(other)

        var dx = this.getX() - other.x
        var dy = this.getY() - other.y

        return Math.sqrt(dx ** 2 + dy ** 2)
    }
    this.getAngleWith = function(other, to360) {
        other = getXY(other)

        var dx = this.getX() - other.x
        var dy = this.getY() - other.y

        var a = Math.atan2(dy, dx) * 180 / Math.PI // range (-180, 180]

        if (to360) {
            if (a < 0) a += 360 // range [0, 360)
        }

        return a
    }
    this.getTarget = function(distance, angle) {
        var degrees = getAngleValue((angle !== undefined) ? angle : 0)
        var radians = degrees * (Math.PI / 180)

        return {
            x: this.getX() + (Math.sin(radians) * distance),
            y: this.getY() + (Math.cos(radians) * distance)
        }
    }

    this.setColor = function(color) {
        _color = color

        SVG.get(_elmID + '_dot')
            .animate(animationSpeed * 3)
            .fill(_color)
    }
    this.getColor = function() {
        return _color
    }

    this.setSnapRadius = function(radius) {
        var elm = SVG.get(_elmID + '_snap')

        if (radius >= 0) {
            var dif = radius - _snapRadius
            var spd = animationSpeed * Math.abs(dif) / 20

            _snapRadius = radius

            var dashes = Math.round(_snapRadius * 2 / workbench.getZoom())

            elm.animate(spd)
                .radius(radius)
                .stroke({width: workbench.getZoom() * 0.5, 'dasharray': circumference(_snapRadius) / dashes / 2})
        } else {
            _snapRadius = radius
            elm.radius(0)
            elm.hide()
        }
    }
    this.getSnapRadius = function() {
        return _snapRadius
    }

    this.fixZoom = function() {
        var dashes = Math.round(_snapRadius * 2 / workbench.getZoom())
        SVG.get(_elmID + '_snap')
            .animate(animationSpeed)
            .stroke({width: workbench.getZoom() * 0.25, 'dasharray': circumference(_snapRadius) / dashes / 2})

        SVG.get(_elmID + '_text')
            .animate(animationSpeed)
            .size(workbench.getZoom() * 3)
    }

    this.setDiameter = function(diameter) {
        diameter = clamp(diameter, 0)

        var dif = diameter - _diameter
        var spd = animationSpeed * Math.abs(dif) / 5

        _diameter = diameter
        _radius = diameter / 2

        SVG.get(_elmID + '_dot')
            .animate(spd)
            .radius(_radius)

        var txy = this.getTarget(_radius, -45)
        SVG.get(_elmID + '_text')
            .animate(spd)
            .move(txy.x, txy.y)
    }
    this.getDiameter = function() {
        return _diameter
    }

    this.setRadius = function(radius) {
        this.setDiameter(radius * 2)
    }
    this.getRadius = function() {
        return _radius
    }

    this.getID = function() {
        return _id
    }

    this.getType = function() {
        return _type
    }

    this.getName = function() {
        return _name
    }

    this.setLabel = function(label) {
        _label = (label !== undefined && label!== null) ? label : ''

        var str = ((_label != '') ? _label + '\n' : '') + `(${Math.round(this.getX() * 100) / 100}, ${Math.round(this.getY() * 100) / 100})`
        SVG.get(_elmID + '_text')
            .text(str)
    }
    this.getLabel = function() {
        return _label
    }

    this.showLabel = function() {
        _displayLabel = true

        SVG.get(_elmID + '_text')
            .show()
    }
    this.hideLabel = function() {
        _displayLabel = false

        SVG.get(_elmID + '_text')
            .hide()
    }

    this.setOpacity = function(opacity) {
        opacity = clamp(opacity, 0, 1, 0.5)

        var dif = _opacity - opacity
        var spd = animationSpeed * Math.abs(dif) * 5

        _opacity = opacity

        _svg.animate(spd)
            .opacity(_opacity)
    }
    this.getOpacity = function() {
        return _opacity
    }

    this.isDraggable = function() {
        return _draggable
    }

    this.show = function() {
        _visible = true
        _svg.show()
    }
    this.hide = function() {
        _visible = false
        _svg.hide()
    }
    this.isVisable = function() {
        return _visible
    }

    this.getParent = function() {
        return _parent
    }

    this.getSVG = function() {
        return _svg
    }
    this.getElement = function() {
        return _element
    }
    this.getElmID = function() {
        return _elmID
    }

    this.toString = function() {
        return `POINT[${this.getID()}] {label: '${this.getLabel()}', xy: (${this.getX()}, ${this.getY()})}`
    }

    construct(this)
}

function PointBuilder(x, y) {
    var _x, _y, _color, _label, _snapRadius, _snapList, _diameter, _radius, _id, elmID, _name, _visible, _opacity, _draggable, _parent

    this.setX = function(value) {_x = value; return this}
    this.setY = function(value) {_y = value; return this}
    this.setColor = function(value) {_color = value; return this}
    this.setLabel = function(value) {_label = value; return this}
    this.setSnapRadius = function(value) {_snapRadius = value; return this}
    this.addSnapAsset = function(value) {_snapList.push(value); return this}
    this.setDiameter = function(value) {_diameter = value; return this}
    this.setRadius = function(value) {_radius = value; return this}
    this.setID = function(value) {_id = value; return this}
    this.setElmID = function(value) {_elmID = value; return this}
    this.setName = function(value) {_name = value; return this}
    this.setVisibility = function(value) {_visible = value; return this}
    this.setOpacity = function(value) {_opacity = value; return this}
    this.setDraggable = function(value) {_draggable = value; return this}
    this.setParent = function(value) {_parent = value; return this}

    _snapList = []

    this.build = function() {
        return new Point(_x, _y, _color, _label, _snapRadius, _snapList, _diameter, _radius, _id, elmID, _name, _visible, _opacity, _draggable, _parent)
    }

    return this.setX(x).setY(y)
}
