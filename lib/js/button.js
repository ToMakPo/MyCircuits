Button.prototype = Object.create(Part.prototype)
Button.prototype.constructor = Button
function Button (onClickCallback, name, id, draggable, clickable) {
    Part.call(this, id, 'Button', name, true, 1, draggable, clickable)

    var _onClickCallback = _onClickCallback
    this.click = _onClickCallback

    this.getSVG().addClass('button')
}
