function Part (x, y, label, id, type, name, visible, opacity, draggable, parent) {
    var _x, _y, _id, _type, _name, _label, _svg, _asset, _element, _elmID, _visible, _opacity, _draggable, _nodes, _rotation, _parent, _axle, _center
    function construct(self) {
        _nodes = {}

        _x = x
        _y = y

        _type = type.toLowerCase()
        _name = name || type
        _label = ''

        _rotation = 0

        _id = getUniqueID(id, _type)

        _visible = (visible === false) ? false : true  // if the part is visable on screen
        _opacity = (opacity !== undefined && opacity !== null) ? opacity : 1 // the amount that this object is visable
        _draggable = (draggable === true) ? true : false // able to be moved

        _parent = (parent !== undefined && parent !== null) ? _parent : workbench

        if (_id > 0) workbench.addChild(self)

        draw(self)
    }
    function draw(self) {
        _elmID = `${_type}-${(_id > 0) ? _id : 'x' + getUniqueID(_type)}`
        _svg = _parent.getSVG().group()

        _svg.attr('id', _elmID)
            .addClass('part')
            .addClass((_type !== 'part') ? _type : '')
            .addClass((_draggable) ? ' draggable' : '')

        _asset = _svg.group()
            .attr('id', _elmID + '_asset')
            .addClass('asset')

        _svg.text(_label)
            .attr('id', _elmID + '_label')
            .center(x, y)

        _center = NodeBuilder(self, 'Center', 0, 0)
            .setColor('#fcba03')
            .setSnapRadius(-1)
            .setOpacity(1)
            .setVisibility(true)
            .setDraggable(false)
            .build()

        _center.moveTo(self)
        _axle = NodeBuilder(self, 'Axle', 0, 20)
            .setColor('#9d92ad')
            .setSnapRadius(-1)
            .setOpacity(1)
            .setVisibility(true)
            .setDraggable(false)
            .build()
        //_center.showLabel()
        _axle.showLabel()

        /*var dist = 30
        _rotateRight = _svg.path(`M ${_x - dist},${_y} Q ${4},${4} ${4},${4} Z`)
            .attr('id', _elmID + '_rotate-right')
            .addClass('button')
            .addClass('arrow')/**/

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
        var dx = x - this.getX()
        this.move(dx, 0)
    }
    this.getX = function() {
        return _x
    }
    this.setY = function(y) {
        var dy = y - this.getY()
        this.move(0, dy)
    }
    this.getY = function() {
        return _y
    }
    this.setXY = function(x, y) {
        var dx = x - this.getX()
        var dy = y - this.getY()
        this.move(dx, dy)
    }
    this.getXY = function() {
        return {x: this.getX(), y: this.getY()}
    }
    this.move = function(x, y) {
        var dist = Math.sqrt(x ** 2 + y ** 2)
        var spd = animationSpeed * dist / 100

        _x += x
        _y += y

        _svg.animate(spd)
            .dmove(x, y)

        this.fixNodeLabels()
    }
    this.moveTo = function(other) {
        other = getXY(other)
        this.setXY(other.x, other.y)
    }

    this.getNodes = function() {
        return _nodes
    }

    this.getDistanceFrom = function(other) {
        return this.getDistanceFrom(other)
    }
    this.getAngleWith = function(other, to360) {
        return this.getAngleWith(other, to360)
    }

    this.getTarget = function(distance, angle) {
        var degrees = getAngleValue((angle !== undefined) ? angle : 0)
        var radians = degrees * (Math.PI / 180)

        return {
            x: this.getX() + (Math.cos(radians) * distance),
            y: this.getY() + (Math.sin(radians) * distance)
        }
    }

    this.rotate = function(degrees) {
        var spd = animationSpeed * Math.abs(degrees) / 5

        var axle = getXY(_axle)

        /*var newXY = _axle.getTarget(_axle.getDistanceFrom(_center), _rotation + degrees)
        _x = newXY.x
        _y = newXY.y/**/

        _rotation += degrees

        _svg.animate(spd)
            .rotate(_rotation, _axle.getX(), _axle.getY())

        this.fixNodeLabels()
    }
    this.setRotation = function(degrees) {
        this.rotate(_rotation - degrees)
    }
    this.getRotation = function() {
        return _rotation
    }

    var places = 5
    this.getWidth = function() {
        return round(_asset.node.getBoundingClientRect().width / workbench.getDPMM(), places)
    }
    this.getHeight = function() {
        return round(_asset.node.getBoundingClientRect().height / workbench.getDPMM(), places)
    }

    this.fixNodeLabels = function() {
        for (const [name, node] of Object.entries(_nodes)) {
            node.fixMove()
        }
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

        var x = _svg.width()
        var y = _svg.height()

        SVG.get(_elmID + '_label')
            .text(_label)
            .addClass('label')
            .move(x, y)
    }
    this.getLabel = function() {
        return _label
    }

    this.setOpacity = function(opacity) {
        opacity = clamp(opacity, 0, 1, 1)

        var dif = _opacity - opacity
        var spd = animationSpeed * dif / 10

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

    this.getSVG = function() {
        return _svg
    }
    this.getAsset = function() {
        return _asset
    }
    this.getElement = function() {
        return _element
    }
    this.getElmID = function() {
        return _elmID
    }

    this.redraw = function() {}

    this.toString = function() {
        return `${_name.toUpperCase()} [${_id}]`
    }

    construct(this)
}

function PartBuilder(x, y, type) {
    var x, y, _label, _id, _type, _name, _visible, _opacity, _draggable, _parent

    this.setXY = function(x, y) {_x = x; _y = y; return this}
    this.setID = function(value) {_type = value; return this}
    this.setType = function(value) {_type = value; return this}
    this.setName = function(value) {_name = value; return this}
    this.setLabel = function(value) {_label = value; return this}
    this.setVisibility = function(value) {_visible = value; return this}
    this.setOpacity = function(value) {_opacity = value; return this}
    this.setDraggable = function(value) {_draggable = value; return this}
    this.setParent = function(value) {_parent = value; return this}

    this.build = function() {
        return new Part(_x, _y, _label, _id, _type, _name, _visible, _opacity, _draggable, _parent)
    }

    return this.setXY(x, y).setType(type)
}
