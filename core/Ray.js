class Ray
{
    constructor(origin, direction)
    {
        this.origin = ( origin !== undefined ) ? origin : new Vector3();
        this.direction = ( direction !== undefined ) ? direction : new Vector3();
    }
}