Point.prototype = Object.create(Asset.prototype)
Point.prototype.constructor = Point
function Point (x, y, color, snapRadius, snapList, diameter, radius, discription, name, displayName, displayDiscription, displayXY, id, elmID, visible, opacity, draggable, parent) {
    Asset.call(this, x, y, 'point', getValue(name, 'Point'), discription, displayName, displayDiscription, displayXY, id, elmID, getValue(visible, false), getValue(opacity, 0.5), getValue(draggable, false), parent)

    var _color, _diameter, _radius, _snapRadius, _snapList
    var _dot, _snap
    function construct(self) {
        _color = getValue(color, '#666')

        if (!isNull(diameter)) {
            _diameter = clamp(diameter, 0)
            _radius = _diameter / 2
        } else if (!isNull(radius)) {
            _radius = clamp(radius, 0)
            _diameter = _radius * 2
        } else {
            _diameter = 5
            _radius = _diameter / 2
        }

        _snapRadius = getValue(snapRadius, _radius * 3) // distance at which other points are able to snap onto this (-1 means that it cannot be snapped onto)
        _snapList = getValue(snapList, []) // list of objects that are snapped to this point

        draw(self)
    }
    function draw(self) {
        var dashes = round(_snapRadius * 2 / workbench.getZoom())
        var x = self.getX(), y = self.getY()

        _snap = self.getItem()
            .circle(clamp(_snapRadius, 0) * 2)
            .attr('id', self.getElmID() + '_snap')
            .center(x, y)
            .fill('transparent')
            .stroke({width: workbench.getZoom() * 0.25, 'dasharray': circumference(_snapRadius) / dashes / 2})

        _dot = self.getItem()
            .circle(_diameter)
            .attr('id', self.getElmID() + '_dot')
            .center(x, y)
            .fill(_color)
            .addClass((self.isDraggable()) ? 'draggable' : '')

        self.getLabel()
            .move(x + _radius, y + _radius)
            .front()
    }

    this.setColor = function(color) {
        _color = color

        _dot.animate(animationSpeed * 3)
            .fill(_color)
    }
    this.getColor = function() {
        return _color
    }

    this.setSnapRadius = function(radius) {
        if (radius >= 0) {
            var dif = radius - _snapRadius
            var spd = animationSpeed * Math.abs(dif) / 20

            _snapRadius = radius

            var dashes = round(_snapRadius * 2 / workbench.getZoom())

            _snap.animate(spd)
                .radius(radius)
                .stroke({width: workbench.getZoom() * 0.5, 'dasharray': circumference(_snapRadius) / dashes / 2})
        } else {
            _snapRadius = radius
            _snap.radius(0)
            _snap.hide()
        }
    }
    this.getSnapRadius = function() {
        return _snapRadius
    }

    this.setDiameter = function(diameter) {
        diameter = clamp(diameter, 0)

        var dif = diameter - _diameter
        var spd = animationSpeed * Math.abs(dif) / 5

        _diameter = diameter
        _radius = diameter / 2

        _dot.animate(spd)
            .radius(_radius)

        this.getLabel()
            .animate(spd)
            .move(x + _radius, y + _radius)
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

    this.fixZoom = function() {
        this.fixLabelSize()

        var dashes = round(_snapRadius * 2 / workbench.getZoom())
        SVG.get(this.getElmID() + '_snap')
            .animate(animationSpeed)
            .stroke({width: workbench.getZoom() * 0.25, 'dasharray': circumference(this.getSnapRadius()) / dashes / 2})
        }

    this.getSnapList = function() {
        return _snapList
    }
    this.snapTo = function(other) {
        _snapList.push(other)
        other.getSnapList().push(this)
    }
    this.unsnap = function(other) {
        for (var i = 0; i < _snapList.length; i++) {
            if (_snapList[i] === other) {
                _snapList.splice(i, 1)
                break
            }
        }

        var list = other.getSnapList()
        for (var j = 0; j < list.length; j++) {
            if (list[j] === this) {
                list.splice(j, 1)
                break
            }
        }
    }

    this.delete = function() {
        for (var i = 0; i < _snapList.length; i++) {
            var list = _snapList[i].getSnapList()
            for (var j = 0; j < list.length; j++) {
                if (list[j] === this) {
                    list.splice(j, 1)
                    break
                }
            }
        }

        workbench.removeChild(this)
        this.getElement().parentNode.removeChild(this.getElement())
    }

    this.toString = function() {
        return `POINT[${this.getID()}] {label: '${this.getLabel()}', xy: ${this.getXY().toString()}}`
    }

    construct(this)
}

function PointBuilder(x, y) {
    /**
     * Use this tool to build a Point object.
     * @param {number} x
     * @param {number} y
     */
    var _x, _y, color, _diameter, _radius, _snapRadius, _snapList, _name, _discription, _displayName, _displayDiscription, _displayXY, _id, _elmID, _visible, _opacity, _draggable, _parent

    this.setXY = function(x, y) {_x = x; _y = y; return this}
    this.setColor = function(value) {_color = value; return this}
    this.setDiameter = function(value) {_diameter = value; _radius = value / 2; return this}
    this.setRadius = function(value) {_radius = value; _diameter = value * 2; return this}
    this.setSnapRadius = function(value) {_snapRadius = value; return this}
    this.addSnapPoint = function(value) {_snapList.push(value); return this}
    this.setName = function(value) {_name = value; return this}
    this.setDiscription = function(value) {_discription = value; return this}
    this.setDisplayName = function(value) {_displayName = value; return this}
    this.setDisplayDiscription = function(value) {_displayDiscription = value; return this}
        this.setDisplayXY = function(value) {_displayXY = value; return this}
    this.setID = function(value) {_id = value; return this}
    this.setElmID = function(value) {_elmID = value; return this}
    this.setVisibility = function(value) {_visible = value; return this}
    this.setOpacity = function(value) {_opacity = value; return this}
    this.setDraggable = function(value) {_draggable = value; return this}
    this.setParent = function(value) {_parent = value; return this}

    _snapList = []

    this.build = function() {
        return new Point(_x, _y, color, _snapRadius, _snapList, _diameter, _radius, _name, _discription, _displayName, _displayDiscription, _displayXY, _id, _elmID, _visible, _opacity, _draggable, _parent)
    }

    return this.setXY(x, y)
}
