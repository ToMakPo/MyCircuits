function isNull(value) {
    return (value === undefined || value === null)
}

function clamp(value, min, max, assumed) {
    assumed = (assumed !== undefined && assumed !== null) ? assumed : 0
    value = (value !== undefined && value !== null) ? value : assumed
    min = (min !== undefined && min !== null) ? min : Math.max()
    max = (max !== undefined && max !== null) ? max : Math.min()

    if (min > max) {
        var temp = min
        min = max
        max = temp
    }

    if (value < min) return min
    if (value > max) return max

    return value
}

function randomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)

    return Math.floor(Math.random() * (max - min + 1)) + min
}

function circumference(r) {
    return 2 * Math.PI * r
}

function getUniqueID(type, id) {
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
    if (obj instanceof Point || obj instanceof Part)
        return {x: obj.getX(), y: obj.getY()}

    if (obj instanceof Object && 'x' in obj && 'y' in obj)
        return obj

    return {x: 0, y: 0}
}

var animationSpeed = 50
