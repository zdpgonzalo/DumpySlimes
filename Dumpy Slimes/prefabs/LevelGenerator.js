class LevelGenerator {
    constructor(scene)
    {
        this.platformBlocks = [];
        this.objectBlocks = [];
        this.tilemapIds = ['cima', 'tilemap1', 'tilemap2', 'base'];
        let block;
        for(let i = 0; i < this.tilemapIds.length; i++)
        {
            block = scene.cache.json.get(this.tilemapIds[i]);
            this.platformBlocks.push(this.jsonToMatrix(block, 0).slice(0));
            this.objectBlocks.push(this.jsonToMatrix(block, 1).slice(0));
        }

        this.levelSize = 2;
    }

    generateLevel()
    {
        let platformArray = [];
        let random;
        let block;

        block = this.platformBlocks[0];
        for(let j = 0; j < block.length; j++)
        {
            platformArray.push(block[j]);
        }
        for(let i = 1; i < this.levelSize - 1; i++)
        {
            random = Math.floor(Math.random()*(this.platformBlocks.length - 2)) + 1;
            block = this.platformBlocks[random];
            for(let j = 0; j < block.length; j++)
            {
                platformArray.push(block[j]);
            }
        }
        block = this.platformBlocks[this.platformBlocks.length - 1];
        for(let j = 0; j < block.length; j++)
        {
            platformArray.push(block[j]);
        }

        return platformArray;
    }

    generateObjects()
    {
        let objectArray = [];
        let random;
        let block;

        block = this.objectBlocks[0];
        for(let j = 0; j < block.length; j++)
        {
            objectArray.push(block[j]);
        }
        for(let i = 1; i < this.levelSize - 1; i++)
        {
            random = Math.floor(Math.random()*(this.platformBlocks.length - 2)) + 1;
            block = this.objectBlocks[random];
            for(let j = 0; j < block.length; j++)
            {
                objectArray.push(block[j]);
            }
        }
        block = this.objectBlocks[this.objectBlocks.length - 1];
        for(let j = 0; j < block.length; j++)
        {
            objectArray.push(block[j]);
        }
        
        return objectArray;
    }

    jsonToMatrix(json, layer)
    {
        let width = json.layers[layer].width;
        let array = json.layers[layer].data;
        let out = [];
        let row = [];
        let value;

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
                out[y][x] -= 1;
            }
        }

        return out;
    }
}