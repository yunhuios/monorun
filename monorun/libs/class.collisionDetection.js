/**
 *
 * @project        monorun
 * @file           class.collisionDetecion.js
 * @description    Handles collisions with box model detection and per pixel detection with resolution
 * @author         Benjamin Horn
 * @version        -
 * @link           http://www.monorun.com
 * 
 */

function collisionDetection() {

	/*
	 * private function initialize()
	 *
	 * Initializes the object
	 *
	 */
	this.initialize = function() {}

	/*
	 * public function hitTest()
	 *
	 * Checks if two objects collide. First with box-model detection
	 * and then on a per-pixel detection.
	 *
	 * Both source and target objects are expected to look like this:
	 *
	 * {
	 *    x: (Number) current x position,
	 *    y: (Number) current y position,
	 *    width: (Number) object height,
	 *    height: (Number) object width,
	 *    pixelmap: (Object) pixel map object generated from buildPixelMap()
	 * }
	 *
	 * @param source (Object) The source object
	 * @param target (Object) The target object
	 *
	 * @return boolean, true on collision
	 *
	 */
	this.hitTest = function( source, target ) {
		var hit = false;
		var start = new Date().getTime();

		if( this.boxHitTest( source, target ) ) {
			if( this.pixelHitTest( source, target ) ) {
				hit = true;
			}
		}

		var end = new Date().getTime();

		if( hit == true ){
			//console.log( 'detection took: ' + (end - start) + 'ms' );
		}

		return hit;
	}

	/*
	 * private function boxHitTest()
	 *
	 * Checks if two objects collide with box-model detection.
	 *
	 * Both source and target objects are expected to look like this:
	 *
	 * {
	 *    x: (Number) current x position,
	 *    y: (Number) current y position,
	 *    width: (Number) object height,
	 *    height: (Number) object width
	 * }
	 *
	 * @param source (Object) The source object
	 * @param target (Object) The target object
	 *
	 * @return boolean, true on collision
	 *
	 */
	this.boxHitTest = function( source, target ) {
		return !( 
			( ( source.y + source.height ) < ( target.y ) ) ||
			( source.y > ( target.y + target.height ) ) ||
			( ( source.x + source.width ) < target.x ) ||
			( source.x > ( target.x + target.width ) ) 
		);
	}

	/*
	 * private function pixelHitTest()
	 *
	 * Checks if two objects collide on a per-pixel detection.
	 *
	 * Both source and target objects are expected to look like this:
	 *
	 * {
	 *    x: (Number) current x position,
	 *    y: (Number) current y position,
	 *    width: (Number) object height,
	 *    height: (Number) object width,
	 *    height: (Number) object width,
	 *    pixelmap: (Object) pixel map object generated from buildPixelMap()
	 * }
	 *
	 * @param source (Object) The source object
	 * @param target (Object) The target object
	 *
	 * @return boolean, true on collision
	 *
	 */
	this.pixelHitTest = function( source, target ) {
		for( var s = 0; s < source.pixelMap.data.length; s++ ) {
			var sourcePixel = source.pixelMap.data[s];
			var sourceArea = {
				x: sourcePixel.x + source.x,
				y: sourcePixel.y + source.y,
				width: source.pixelMap.resolution,
				height: source.pixelMap.resolution
			};
			for( var t = 0; t < target.pixelMap.data.length; t++ ) {
				var targetPixel = target.pixelMap.data[t];
				var targetArea = {
					x: targetPixel.x + target.x,
					y: targetPixel.y + target.y,
					width: target.pixelMap.resolution,
					height: target.pixelMap.resolution
				};

				if( this.boxHitTest( sourceArea, targetArea ) ) {
					return true;
				}
			}
		}
	}

	/*
	 * public function buildPixelMap()
	 *
	 * Creates a pixel map on a canvas image. Everything
	 * with a opacity above 0 is treated as a collision point.
	 * Lower resolution (higher number) will generate a faster
	 * but less accurate map.
	 *
	 *
	 * @param source (Object) The canvas object
	 * @param resolution (int) The resolution of the map
	 *
	 * @return object, a pixelMap object
	 *
	 */
	this.buildPixelMap = function( source, resolution ) {
		var resolution = resolution || 1;
		var ctx = source.getContext("2d");
		var pixelMap = [];

		for( var y = 0; y < source.width; y = y+resolution ) {
			for( var x = 0; x < source.height; x = x+resolution ) {
				var pixel = ctx.getImageData(x,y,resolution,resolution);
				if( pixel.data[3] != 0 ) {
					pixelMap.push( { x:x, y:y } );
				}
			}
		}
		return {
			data: pixelMap,
			resolution: resolution
		};
	}

	// Initialize the collider
	this.initialize();

	// Return our outward facing interface.
	return {
		hitTest: this.hitTest.bind( this ),
		buildPixelMap: this.buildPixelMap.bind( this )
	}
}