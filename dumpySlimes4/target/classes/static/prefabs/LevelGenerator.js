class LevelGenerator {
    constructor(scene)
    {
        // Arrays de datos
        this.platformBlocks = []; // Matriz donde se van a guardar los distintos bloques de plataformas
        this.objectBlocks = []; // Matriz donde se van a guardar los distintos bloques de objetos
        this.tilemapIds = [ // Tilemaps usados para construir el nivel
            'cima', 
            'bloque01', 'bloque02', 'bloque03', 'bloque04', 'bloque05', 'bloque06', 'bloque07', 'bloque08', 'bloque09', 'bloque10',
            'bloque11', 'bloque12', 'bloque13', 'bloque14', 'bloque15', 'bloque16', 'bloque17', 'bloque18', 'bloque19', 'bloque20',
            'bloque21', 'bloque22', 'bloque23', 'bloque24', 'bloque25', 'bloque26', 'bloque27', 'bloque28', 'bloque29', 'bloque30',
            'base'
        ];

        // Transferencia de los json a los arrays
        let block;
        for(let i = 0; i < this.tilemapIds.length; i++)
        {
            block = scene.cache.json.get(this.tilemapIds[i]);
            this.platformBlocks.push(this.jsonToMatrix(block, 0).slice(0));
            this.objectBlocks.push(this.jsonToMatrix(block, 1).slice(0));
        }

        this.levelSize = 5; // Tamaño del nivel
    }

    generateLevel() // Devuelve dos matrices (24, 24*levelSize), una con la información de las plataformas y otra con la de los objetos
    {
        let platformArray = [];
        let objectArray = [];
        let platformBlock;
        let objectBlock;
        let random = 0;

        // Creación de la cima
        platformBlock = this.platformBlocks[0];
        objectBlock = this.objectBlocks[0];
        for(let j = 0; j < platformBlock.length; j++)
        {
            platformArray.push(platformBlock[j]);
            objectArray.push(objectBlock[j]);
        }
        // Creación del nivel intermedio
        for(let i = 1; i < this.levelSize - 1; i++)
        {
            random++;
            //random = Math.floor(Math.random()*(this.platformBlocks.length - 2)) + 1;
            platformBlock = this.platformBlocks[random];
            objectBlock = this.objectBlocks[random];
            for(let j = 0; j < platformBlock.length; j++)
            {
                platformArray.push(platformBlock[j]);
                objectArray.push(objectBlock[j]);
            }
        }
        // Creación de la base
        platformBlock = this.platformBlocks[this.platformBlocks.length - 1];
        objectBlock = this.objectBlocks[this.platformBlocks.length - 1];
        for(let j = 0; j < platformBlock.length; j++)
        {
            platformArray.push(platformBlock[j]);
            objectArray.push(objectBlock[j]);
        }

        return {platforms: platformArray, objects: objectArray};
    }

    jsonToMatrix(json, layer) // Devuelve la capa en layers en el índice indiado como una matriz
    {
        let width = json.layers[layer].width;
        let array = json.layers[layer].data;
        let out = [];
        let row = [];

        // Conversión de array a matriz
        for(let i = 0; i < array.length; i++) {
            row.push(array[i]);
            if(row.length == width)
            {
                out.push(row.slice(0));
                row = [];
            }
        }

        // Cuando phaser carga un mapa desde un json interpreta el índice 0 como transparente, pero al cargarlo desde un array el transparente es -1, 
        // por lo que hay que restar 1 a todos los elementos del array
        for(let y = 0; y < out.length; y++) {
            for(let x = 0; x < width; x++) {
                out[y][x] -= 1;
            }
        }

        return out;
    }
}