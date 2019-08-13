Box.prototype = Object.create(Component.prototype)
Box.prototype.constructor = Box
function Box (width, height, x, y, color, rotation, discription, displayDiscription, displayXY, id, elmID, visible, opacity, draggable, parent) {
    Component.call(this, width, height, x, y, rotation, 'box', 'Box', discription, displayDiscription, displayXY, id, elmID, visible, opacity, draggable, parent)
    var _color

    function construct(self) {
        _color = color

        draw(self)
    }
    function draw(self) {
        var box = self.getItem()
            .rect(self.getWidth(), self.getHeight())
            .center(self.getX(), self.getY())
            .fill(_color)
            .attr('id', self.getElmID() + '_box')
            .addClass('box')
    }

    construct(this)
}

function BoxBuilder(width, height, x, y, color) {
    var _width, _height, _x, _y, _color, _rotation, _type, _name, _discription, _displayName, _displayDiscription, _displayXY, _id, _elmID, _visible, _opacity, _draggable, _parent

    this.setWidthHeight = function(width, height) {_width = width; _height = height; return this}
    this.setXY = function(x, y) {_x = x; _y = y; return this}
    this.setColor = function(value) {_color = value; return this}
    this.setRotation = function(value) {_rotation = value; return this}
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
        return new Box(_width, _height, _x, _y, _color, _rotation, _type, _name, _discription, _displayName, _displayDiscription, _displayXY, _id, _elmID, _visible, _opacity, _draggable, _parent)
    }

    return this.setWidthHeight(width, height).setXY(x, y).setColor(color)
}
