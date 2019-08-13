function isNull(value) {
    /**
     * Checks if the given value is null or undefined.
     *
     * @param {Object} value the value to be checked
     * @returns {boolean}
     */
    return (value === undefined || value === null)
}

function getValue(given, assumed) {
    /**
     * If the given value is not null, then return the assumed value, else return the given value
     */
    return (!isNull(given)) ? given : assumed
}

function clamp(value, min, max, assumed) {
    /**
     * Lock a given value within a range.
     *
     * @param {number} value the value to be looked up (default: assumed)
     * @param {number} min the min value of the range (default: Math.min())
     * @param {number} max the max value of the range (default: Math.max())
     * @param {number} assumed the default value incase the given value is null (default: 0)
     * @returns {number}
     */
    assumed = getValue(assumed, 0)
    value = getValue(value, assumed)
    min = getValue(min, Math.max())
    max = getValue(max, Math.min())

    if (min > max) {
        var temp = min
        min = max
        max = temp
    }

    if (value < min) return min
    if (value > max) return max

    return value
}

function lowerFirst(value) {
    /**
     * Change the first letter in a given string to lower case.
     *
     * @param {string} value the given string
     * @returns {string}
     */
     value = getValue(value, '').toString()
    return value.charAt(0).toLowerCase() + value.slice(1)
}

function upperFirst(value) {
    /**
     * Change the first letter in a given string to upper case.
     *
     * @param {string} value the given string
     * @returns {string}
     */
     value = getValue(value, '').toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
}

function randomInt(min, max) {
    /**
     * Get a random int between two numbers. [min, max]
     *
     * @param {number} min the min value of the range
     * @param {number} max the max value of the range
     * @returns {number} the random int
     */

    if (min > max) {
        var temp = min
        min = max
        max = temp
    }

    min = Math.ceil(min)
    max = Math.floor(max)

    return Math.floor(Math.random() * (max - min + 1)) + min
}

function circumference(radius) {
    /**
     * Get the circumference of a circle given a specific radius.
     *
     * @param {number} radius the radius of the circle
     * @returns {number} the circumference of the circle
     */
    return 2 * Math.PI * radius
}

function get360(angle) {
    if (angle < 0) {
        var l = Math.ceil(Math.abs(angle / 360))
        var c = (angle < 0) ? -1 : 1
        var a = (Math.abs(angle) - (l * 360)) * c
        return a
    } else {
        return angle % 360
    }
}

function getUniqueID(type, id) {
    /**
     * Gets a unique ID for a given asset type.
     *
     * @param {string} type the asset type to check from
     * @param {number} id if user already has ID, then check given id to see if it is unique (default: null)
     * @returns {number}
     */
    if (id < 0) return id

    var typeList = workbench.getTypeList(type)

    if (id > 0) {
        if (typeList == null || !(id in typeList)) return id
        else console.error('Provided id was not unique. A uniquie id was found and returned.');
    }

    var id = randomInt(1, 999999)

    if (typeList === null) return id

    while (true) {
        id = randomInt(1, 999999)
        if (!(id in typeList)) return id
    }
}

function getXY(obj) {
    /**
     * Get just the 'x' and 'y' of a given object
     *
     * @param {Part, Point, Object}
     * @returns {Object}
     */
    if (obj instanceof Point || obj instanceof Part)
        return {x: obj.getX(), y: obj.getY()}

    if (obj instanceof Object && 'x' in obj && 'y' in obj)
        return obj

    return {x: 0, y: 0}
}

function round(number, places) {
    /**
     * Get a number rounded to a given number of places
     *
     * @param {number} number the number to be rounded
     * @param {integer} places the number of places to be rounded (default: 0)
     * @returns {number}
     */
    var mag = 10 ** clamp(places, 0, null, 0)
    return Math.round(number * mag) / mag
}

var animationSpeed = 50 // the speed in ms that things should animate
