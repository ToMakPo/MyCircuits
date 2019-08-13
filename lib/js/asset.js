function Asset (x, y, type, name, discription, displayName, displayDiscription, displayXY, id, elmID, visible, opacity, draggable, parent) {
    var _xy, _type, _name, _discription, _displayName, _displayDiscription, _displayXY, _id, _elmID, _visible, _opacity, _draggable, _parent
    var _svg, _item, _label, _element

    function construct(self) {
        _xy = new Coordinate(x, y)

        _type = lowerFirst(getValue(type, 'asset'))
        _name = upperFirst(getValue(name, type))
        _discription = getValue(discription, '')

        _displayName = (displayName === true) ? true : false
        _displayDiscription = (displayDiscription === true) ? true : false
        _displayXY = (displayXY === true) ? true : false

        _id = getUniqueID(id, _type)

        _visible = (visible === false) ? false : true  // if the component is visable on screen
        _opacity = clamp(opacity, 0, 1, 1) // the amount that this object is visable
        _draggable = (draggable === true) ? true : false // able to be moved

        _parent = getValue(parent, workbench)

        _elmID = getValue(elmID, `${_type}-${_id}`)

        draw(self)
    }
    function draw(self) {
        _svg = _parent.getSVG()
            .group()
            .attr('id', _elmID)
            .addClass('asset')
            .addClass((_type !== 'asset') ? _type : '')
            .addClass((_draggable) ? ' draggable' : '')
            .opacity(_opacity)

        if (_visible) {
            _svg.show()
        } else {
            _svg.hide()
        }

        _item = _svg
            .group()
            .attr('id', _elmID + '_item')
            .addClass('item')

        _label = _svg
            .text(self.getDiscription())
            .attr('id', self.getElmID() + '_label')
            .addClass('label')

        self.fixLabelSize()

        workbench.addChild(self)
    }

    this.setX = function(x) {
        var dx = x - this.getX()
        this.move(dx, 0)
    }
    this.getX = function() {
        return _xy.getX()
    }
    this.setY = function(y) {
        var dy = y - this.getY()
        this.move(0, dy)
    }
    this.getY = function() {
        return _xy.getY()
    }
    this.setXY = function(x, y) {
        var dx = x - this.getX()
        var dy = y - this.getY()
        this.move(dx, dy)
    }
    this.getXY = function() {
        return _xy
    }
    this.move = function(x, y) {
        var dist = Math.sqrt(x ** 2 + y ** 2)
        var spd = animationSpeed * dist / 100

        _xy.setX(_xy.getX() + x)
        _xy.setY(_xy.getY() + y)

        _svg.animate(spd)
            .dmove(x, y)

        this.setLabel()
    }
    this.moveTo = function(other) {
        this.setXY(other.getX(), other.getY())
    }

    this.getDistanceFrom = function(other) {
        other = getXY(other)

        var dx = this.getX() - other.getX()
        var dy = this.getY() - other.getY()

        return Math.sqrt(dx ** 2 + dy ** 2)
    }
    this.getAngleWith = function(other, to360) {
        other = getXY(other)

        var dx = this.getX() - other.getX()
        var dy = this.getY() - other.getY()

        var a = Math.atan2(dy, dx) * 180 / Math.PI // range (-180, 180]

        if (to360) {
            if (a < 0) a += 360 // range [0, 360)
        }

        return a
    }
    this.getTarget = function(distance, angle) {
        var degrees = get360((angle !== undefined) ? angle : 0)
        var radians = degrees * (Math.PI / 180)

        return new Coordinate(
            this.getX() + (Math.cos(radians) * distance),
            this.getY() + (Math.sin(radians) * distance)
        )
    }

    this.getSVG = function() {
        return _svg
    }
    this.getItem = function() {
        return _item
    }
    this.getElement = function() {
        return _element
    }

    this.getType = function() {
        return _type
    }
    this.getName = function() {
        return _name
    }

    this.getID = function() {
        return _id
    }
    this.getElmID = function() {
        return _elmID
    }

    this.setOpacity = function(opacity) {
        opacity = clamp(opacity, 0, 1)

        var dif = _opacity - opacity
        var spd = animationSpeed * dif / 10

        _opacity = opacity

        _svg.animate(spd)
            .opacity(_opacity)
    }
    this.getOpacity = function() {
        return _opacity
    }

    this.setDraggable = function(draggable) {
        _draggable = (draggable === true) ? true : false

        if (_draggable) {
            if (!_svg.hasClass('draggable')) _svg.addClass('draggable')
        } else {
            if (_svg.hasClass('draggable')) _svg.removeClass('draggable')
        }
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

    this.setDiscription = function(discription) {
        _discription = discription
        this.setLabel()
    }
    this.getDiscription = function() {
        return _discription
    }
    this.showDiscription = function() {
        _displayDiscription = true
        this.setLabel()
    }
    this.hideDiscription = function() {
        _displayDiscription = false
        this.setLabel()
    }
    this.displayName = function(display) {
        if (isNull(display)) {
            return _displayName
        } else {
            if (display === true) _displayName = true
            if (display === false) _displayName = false

            this.setLabel()
        }
    }
    this.displayDiscription = function(display) {
        if (isNull(display)) {
            return _displayDiscription
        } else {
            if (display === true) _displayDiscription = true
            if (display === false) _displayDiscription = false

            this.setLabel()
        }
    }
    this.displayXY = function(display) {
        if (isNull(display)) {
            return _displayXY
        } else {
            if (display === true) _displayXY = true
            if (display === false) _displayXY = false

            this.setLabel()
        }
    }
    this.getLabel = function() {
        return _label
    }
    this.setLabel = function() {
        var line1 = []
        if (_displayName) line1.push(_name)
        if (_displayDiscription) line1.push(_discription)
        line1 = label.join(': ')

        var label = []
        if (line1 !== '') label.push(line1)
        if (_displayXY) label.push(_xy.toString())
        var text = label.join('\n')

        _label.text(array.join('\n'))

        if (text !== '') {
            _label.show()
        } else {
            _label.hide()
        }
    }
    this.hideLabel = function() {
        _label.hide()
    }
    this.showLabel = function() {
        _label.show()
    }

    this.getParent = function() {
        return _parent
    }

    this.delete = function() {
        workbench.removeChild(this)
        _element.parentNode.removeChild(_element)
    }

    this.fixZoom = function() {
        this.fixLabelSize()
    }
    this.fixLabelSize = function() {
        _label
            .animate(animationSpeed)
            .size(workbench.getZoom() * 3)
    }

    this.toString = function() {
        return `${_name.toUpperCase()} [${_id}]`
    }

    construct(this)
}

function AssetBuilder(x, y, type) {
    var _x, _y, _type, _name, _discription, _displayName, _displayDiscription, _displayXY, _id, _elmID, _visible, _opacity, _draggable, _parent

    this.setXY = function(x, y) {_x = x; _y = y; return this}
    this.setType = function(value) {_type = value; return this}
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

    this.build = function() {
        return new Asset(_x, _y, _type, _name, _discription, _displayName, _displayDiscription, _displayXY, _id, _elmID, _visible, _opacity, _draggable, _parent)
    }

    return this.setXY(x, y).setType(type)
}
