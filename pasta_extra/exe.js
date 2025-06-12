
const bibloteca = [2, 2, 3, 4, 5, 2, 5, 6, 7, 5, 2, 7, 8, 9, 2]

function contarOcorrencias (livros, numeroBuscado){
    const contador = livros.filter((num) => num === numeroBuscado).length;

    return contador > 0 ? contador : -1;

}

const result = contarOcorrencias(bibloteca, 2)

console.log(result)