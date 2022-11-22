class LevelGenerator {
    constructor(scene)
    {
        this.blocks = [];
        this.tilemapIds = ['tilemap1', 'tilemap1'];
        for(let i = 0; i < this.tilemapIds.length; i++)
        {
            let block = scene.cache.json.get(this.tilemapIds[i]);
            block = this.jsonToMatrix(block);
            this.blocks.push(block);
        }

        this.levelSize = 3;
    }

    generateLevel()
    {
        let mapArray = [];
        let random;
        let block;
        for(let i = 0; i < this.levelSize; i++)
        {
            random = Math.floor(Math.random()*this.blocks.length);
            block = this.blocks[random];
            for(let j = 0; j < block.length; j++)
            {
                mapArray.push(block[j]);
            }
        }
        return mapArray;
    }

    jsonToMatrix(json)
    {
        let width = json.layers[0].width;
        let array = json.layers[0].data;
        let out = [];
        let row = [];

        for (let i = 0; i < array.length; i++) {
            row.push(array[i]);
            if(row.length == width)
            {
                out.push(row.slice(0));
                row = [];
            }
        }

        for (let y = 0; y < out.length; y++) {
            for (let x = 0; x < width; x++) {
                out[y][x] = out[y][x] - 1;
            }
        }
        
        return out;
    }
}