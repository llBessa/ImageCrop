const photoFile = document.getElementById('photo-file')
let photoPreview = document.getElementById('photo-preview')

let image = new Image()

// Select & preview image

document.getElementById('select-image')
.onclick = function() {
    photoFile.click()
}

window.addEventListener('DOMContentLoaded', () => {
    photoFile.addEventListener('change',() => {
        let file = photoFile.files.item(0)
        //ler um arquivo
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function (event) {
            image.src = event.target.result
        }
    })
})

// slection tool
let selection = document.getElementById('selection-tool')

let startX, startY, relativeStartX, relativeStartY  //posoções iniciais
let endX, endY, relativeEndX, relativeEndY  //posições finais

let isSelecting = false
const events = {
    mouseover(){
        this.style.cursor = 'crosshair'
    },
    mousedown(){
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
    
            selection.style.width = (endX - startX) + 'px'
            selection.style.height = (endY - startY) + 'px'
        }

    },
    mouseup(){
        isSelecting = false

        relativeEndX = event.layerX
        relativeEndY = event.layerY
    }
}

Object.keys(events)
.forEach(eventName => {
    photoPreview.addEventListener(eventName, events[eventName])
});

// Canvas

let canvas = document.createElement('canvas')
let ctx = canvas.getContext('2d')

image.onload = function() {
    const {width, height} = image
    canvas.width = width
    canvas.height = height
    
    // limpa o contexto
    ctx.clearRect(0,0,width, height)

    // desenha a imagem
    ctx.drawImage(image, 0, 0)

    photoPreview.src = canvas.toDataURL()
}