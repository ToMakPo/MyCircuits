function Coordinate (x, y, lx, ly) {
    /**
     * The x and y of an asset
     */
    var _x = x
    var _y = y
    var _lx = getValue(lx, 'x')
    var _ly = getValue(ly, 'y')

    this['set' + upperFirst(_lx)] = function(value) {
        _x = value
    }
    this['get' + upperFirst(_lx)] = function() {
        return _x
    }

    this['set' + upperFirst(_ly)] = function(value) {
        _y = value
    }
    this['get' + upperFirst(_ly)] = function() {
        return _y
    }

    this.toString = function(withLabels) {
        if (withLabels === true) {
            return `(${_lx}: ${_x}, ${_ly}: ${_y})`
        } else {
            return `(${_x}, ${_y})`
        }
    }
}
