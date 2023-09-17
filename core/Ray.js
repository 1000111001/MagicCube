class Ray {
	constructor(origin, direction) {
		this.origin = (origin !== undefined) ? origin : new Vector3();
		this.direction = (direction !== undefined) ? direction : new Vector3();
	}
	intersectCube(cube) {
		// ray : r(t) = o + t * dir
		// plane : X * N = D
		// (o + t * dir) * N = D
		let matrix = [];
		matIV.inverse(cube.getMatrix(), matrix);
		let start = this.origin.slice();
		let end = [this.origin[0] + this.direction[0], this.origin[1] + this.direction[1], this.origin[2] + this.direction[2]];
		start = matIV.multiplyVec3(matrix, start); // 变换到cube坐标系下
		end = matIV.multiplyVec3(matrix, end);

		return this.intersectBox(start, end, cube.box, cube);
	}
	intersectBox(start, end, box, target) {

		var tmin, tmax, tymin, tymax, tzmin, tzmax;

		let dir = {
			x: end[0] - start[0],
			y: end[1] - start[1],
			z: end[2] - start[2],
		};
		var invdirx = 1 / dir.x, invdiry = 1 / dir.y, invdirz = 1 / dir.z;

		var origin = {
			x: start[0],
			y: start[1],
			z: start[2],
		};

		if (invdirx >= 0) {

			tmin = (box.min.x - origin.x) * invdirx;
			tmax = (box.max.x - origin.x) * invdirx;

		} else {

			tmin = (box.max.x - origin.x) * invdirx;
			tmax = (box.min.x - origin.x) * invdirx;

		}

		if (invdiry >= 0) {

			tymin = (box.min.y - origin.y) * invdiry;
			tymax = (box.max.y - origin.y) * invdiry;

		} else {

			tymin = (box.max.y - origin.y) * invdiry;
			tymax = (box.min.y - origin.y) * invdiry;

		}

		if ((tmin > tymax) || (tymin > tmax)) return null;

		// These lines also handle the case where tmin or tmax is NaN
		// (result of 0 * Infinity). x !== x returns true if x is NaN
		if (tymin > tmin || tmin !== tmin) tmin = tymin;

		if (tymax < tmax || tmax !== tmax) tmax = tymax;

		if (invdirz >= 0) {

			tzmin = (box.min.z - origin.z) * invdirz;
			tzmax = (box.max.z - origin.z) * invdirz;

		} else {

			tzmin = (box.max.z - origin.z) * invdirz;
			tzmax = (box.min.z - origin.z) * invdirz;

		}

		if ((tmin > tzmax) || (tzmin > tmax)) return null;

		if (tzmin > tmin || tmin !== tmin) tmin = tzmin;

		if (tzmax < tmax || tmax !== tmax) tmax = tzmax;

		//return point closest to the ray (positive side)
		if (tmax < 0) return null;

		let t = tmin >= 0 ? tmin : tmax;
		return { t: t, obj: target };

	}
}

