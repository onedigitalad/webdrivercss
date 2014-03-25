/**
 * crop image according to user arguments and its position on screen and save it
 */

var gm = require('gm'),
    exclude = require('./exclude.js'),
    logWarning = require('./logWarning.js');

module.exports = function(res, done) {

    var excludeRect = res.value ? res.value.excludeRect : [],
        shot = gm(this.screenshot).quality(100);

    /**
     * crop image with given arguments
     */
    if(this.args.x && this.args.y && this.args.width && this.args.height) {

        var cropDim = {
            x:      this.args.x,
            y:      this.args.y,
            width:  this.args.width,
            height: this.args.height
        }

        exclude(shot,excludeRect);
        shot.crop(cropDim.width, cropDim.height, cropDim.x, cropDim.y);
    
    /**
     * or use boundary of specific CSS element
     */
    } else if(res.value && res.value.elemBounding) {

        var cropDim = {
            x:      res.value.elemBounding.left + (res.value.elemBounding.width  / 2),
            y:      res.value.elemBounding.top  + (res.value.elemBounding.height / 2),
            width:  typeof this.args.width  !== 'undefined' ? this.args.width  : res.value.elemBounding.width,
            height: typeof this.args.height !== 'undefined' ? this.args.height : res.value.elemBounding.height
        }

        exclude(shot,excludeRect);    
        shot.crop(cropDim.width, cropDim.height, cropDim.x - (cropDim.width / 2), cropDim.y - (cropDim.height / 2));

    } else {

    /**
     * else save whole screenshot
     * TODO return error that image wasn't found
     */
        logWarning.call(this.instance, this.args.elem ? 'NoElementFound' : 'ArgumentsMailformed');
        exclude(shot,excludeRect);

    }

    shot.write(this.filename, done.bind(null, null));

};