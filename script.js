const photoFile = document.getElementById('photo-file')
let photoPreview = document.getElementById('photo-preview')

let image;
let photoName;  // nome do arquivo aberto
// Select & preview image

document.getElementById('select-image')
.onclick = function() {
    photoFile.click()
}

window.addEventListener('DOMContentLoaded', () => {
    photoFile.addEventListener('change',() => {
        let file = photoFile.files.item(0)

        photoName = file.name.split('.')[0]

        //ler um arquivo
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function (event) {
            image = new Image();
            image.src = event.target.result;
            image.onload = onLoadImage;
        }
    })
})

// slection tool
let selection = document.getElementById('selection-tool')

let startX, startY, relativeStartX, relativeStartY  //posoções iniciais
let endX, endY, relativeEndX, relativeEndY  //posições finais

let isSelecting = false
const events = {
    mouseenter(){
        this.style.cursor = 'crosshair'
    },
    mousedown(){
        console.log(event)
        selection.style.display = 'none'
        const {clientX, clientY, offsetX, offsetY} = event
        
        startX = clientX
        startY = clientY
        relativeStartX = offsetX
        relativeStartY = offsetY
        
        isSelecting = true
    },
    mousemove(){
        endX = event.clientX
        endY = event.clientY

        if(isSelecting){
            selection.style.display = 'initial'
            selection.style.top = startY + 'px'
            selection.style.left = startX + 'px'

            if(startX > endX || startY > endY){
                selection.style.top = endY + 'px'
                selection.style.left = endX + 'px'
            }
    
            selection.style.width = Math.abs(endX - startX) + 'px'
            selection.style.height = Math.abs(endY - startY) + 'px'
        }
    },
    mouseup(){
        console.log(event)
        isSelecting = false

        console.log()

        if(startX > endX || startY > endY){
            let auxX, auxY
                auxX = startX
                auxY = startY
    
                startX = endX
                startY = endY
                endX = auxX
                endY = auxY
        }
        // relativeEndX = event.layerX
        // relativeEndY = event.layerY

        // mostrar o botão de corte
        cropButton.style.display = 'initial'
    },
    mouseout(){
        console.log('mouseOut')
        isSelecting = false;

        // mostrar o botão de corte
        cropButton.style.display = 'initial'
    }
}


Object.keys(events)
.forEach(eventName => {
    photoPreview.addEventListener(eventName, events[eventName])
});

// Canvas

let canvas = document.createElement('canvas')
let ctx = canvas.getContext('2d')

function onLoadImage() {
    const {width, height} = image
    canvas.width = width
    canvas.height = height
    
    // limpa o contexto
    ctx.clearRect(0,0, width, height)

    // desenha a imagem
    ctx.drawImage(image, 0, 0)

    photoPreview.src = canvas.toDataURL()
}

//Crop
const cropButton = document.getElementById('crop-image')
cropButton.onclick = () => {
    const {width : imgW, height: imgH} = image;
    const {width : previewW, height : previewH} = photoPreview;

    // guarda os fatores de altura e largura
    const [widthFactor, heightFactor] = [
        +(imgW / previewW),
        +(imgH / previewH)
    ]

    // altura e largura da seleção
    const [selectionW, selectionH] = [
        +(selection.style.width).replace('px',''),
        +(selection.style.height).replace('px','')
    ]

    // altura e largura do corte real
    const [croppedW, croppedH] = [
        +(selectionW*widthFactor),
        +(selectionH*heightFactor)
    ]

    // posições X e Y da seleção
    const [actualX, actualY] = [
        +(relativeStartX*widthFactor),
        +(relativeStartY*heightFactor)
    ]

    // pegar imagem cortada do contexto do canvas
    const croppedImage = ctx.getImageData(actualX, actualY, croppedW, croppedH)

    // limpar o contexto
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // ajuste de proporção
    image.width = canvas.width = croppedW;
    image.height = canvas.height = croppedH;

    //adicionar imagem cortada ao ctx
    ctx.putImageData(croppedImage, 0, 0)

    //esconder a ferramenta de seleção
    selection.style.display = 'none'

    // atualizar o preview da imagem
    photoPreview.src = canvas.toDataURL()

    //exibir botão de download
    downloadButton.style.display = 'initial'
}

// Download
const downloadButton = document.getElementById('download')

// funcionalidade de download
downloadButton.onclick = () => {
    const a = document.createElement('a')
    a.download = photoName + '-cropped.png'
    a.href = canvas.toDataURL()
    a.click()
}