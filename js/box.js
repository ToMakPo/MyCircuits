Box.prototype = Object.create(Part.prototype)
Box.prototype.constructor = Box
function Box (width, height, x, y, color, label, id, type, name, visible, opacity, draggable, parent) {
    Part.call(this, x, y, label, id, 'box', name, visible, opacity, draggable, parent)
    var _width, _height, _color

    function construct(self) {
        _width = clamp(width, 0)
        _height = clamp(height, 0, null, width)
        _color = color

        drawx(self)
    }
    function drawx(self) {
        var box = self.getAsset()
            .rect(_width, _height)
            .center(x, y)
            .fill(_color)
            .attr('id', self.getElmID() + '_box')
            .addClass(type)

        var sr = Math.min(_width, _height) * 0.2
        var r = sr / 2
        NodeBuilder(self, 'CornerTL', -_width / 2, -_height / 2)
            .setColor('#6cad7d')
            .setOpacity(1)
            .setVisibility(true)
            .setDraggable(false)
            .setSnapRadius(sr)
            .setRadius(r)
            .build()
        NodeBuilder(self, 'CornerTR', _width / 2, -_height / 2)
            .setColor('#6cad7d')
            .setOpacity(1)
            .setVisibility(true)
            .setDraggable(false)
            .setSnapRadius(sr)
            .setRadius(r)
            .build()
        NodeBuilder(self, 'CornerBL', -_width / 2, _height / 2)
            .setColor('#6cad7d')
            .setOpacity(1)
            .setVisibility(true)
            .setDraggable(false)
            .setSnapRadius(sr)
            .setRadius(r)
            .build()
        NodeBuilder(self, 'CornerBR', _width / 2, _height / 2)
            .setColor('#6cad7d')
            .setOpacity(1)
            .setVisibility(true)
            .setDraggable(false)
            .setSnapRadius(sr)
            .setRadius(r)
            .build()

        NodeBuilder(self, 'SideT', 0, -_height / 2)
            .setColor('#6c97ad')
            .setOpacity(1)
            .setVisibility(true)
            .setDraggable(false)
            .setSnapRadius(sr)
            .setRadius(r)
            .build()
        NodeBuilder(self, 'SideB', 0, _height / 2)
            .setColor('#6c97ad')
            .setOpacity(1)
            .setVisibility(true)
            .setDraggable(false)
            .setSnapRadius(sr)
            .setRadius(r)
            .build()
        NodeBuilder(self, 'SideL', -_width / 2, 0)
            .setColor('#6c97ad')
            .setOpacity(1)
            .setVisibility(true)
            .setDraggable(false)
            .setSnapRadius(sr)
            .setRadius(r)
            .build()
        NodeBuilder(self, 'SideR', _width / 2, 0)
            .setColor('#6c97ad')
            .setOpacity(1)
            .setVisibility(true)
            .setDraggable(false)
            .setSnapRadius(sr)
            .setRadius(r)
            .build()
    }

    construct(this)
}

function BoxBuilder(width, height, x, y) {
    var _width, _height, _x, _y, _color, _label, _id, _type, _name, _visible, _opacity, _draggable, _parent

    this.setWidthHeight = function(widht, height) {_width = width; _height = height; return this}
    this.setXY = function(x, y) {_x = x; _y = y; return this}
    this.setColor = function(value) {_color = value; return this}
    this.setID = function(value) {_type = value; return this}
    this.setType = function(value) {_type = value; return this}
    this.setName = function(value) {_name = value; return this}
    this.setLabel = function(value) {_label = value; return this}
    this.setVisibility = function(value) {_visible = value; return this}
    this.setOpacity = function(value) {_opacity = value; return this}
    this.setDraggable = function(value) {_draggable = value; return this}
    this.setParent = function(value) {_parent = value; return this}

    this.build = function() {
        return new Box(_width, _height, _x, _y, _color, _label, _id, _type, _name, _visible, _opacity, _draggable, _parent)
    }

    return this.setWidthHeight(width, height).setXY(x, y)
}
