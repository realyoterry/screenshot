
var startX, startY, endX, endY;
var selectionBox = document.createElement("div");

selectionBox.style.position = "fixed";
selectionBox.style.border = "2px dashed red";
selectionBox.style.background = "rgba(255, 0, 0, 0.2)";
selectionBox.style.zIndex = "9999";
selectionBox.style.pointerEvents = "none";

document.body.appendChild(selectionBox);
document.addEventListener("mousedown", mouseDown);
document.addEventListener("mousemove", mouseMove);
document.addEventListener("mouseup", mouseUp);

function mouseDown(e) {
    document.body.style.userSelect = "none";

    startX = e.clientX;
    startY = e.clientY;
    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;
    selectionBox.style.width = "0px";
    selectionBox.style.height = "0px";
    selectionBox.style.display = "block";
}

function mouseMove(e) {
    if (startX === undefined) return;

    endX = e.clientX;
    endY = e.clientY;
    selectionBox.style.left = `${Math.min(startX, endX)}px`;
    selectionBox.style.top = `${Math.min(startY, endY)}px`;
    selectionBox.style.width = `${Math.abs(endX - startX)}px`;
    selectionBox.style.height = `${Math.abs(endY - startY)}px`;
}

function mouseUp() {
    if (startX === undefined) return;

    const selection = {
        x: Math.min(startX, endX),
        y: Math.min(startY, endY),
        width: Math.abs(endX - startX),
        height: Math.abs(endY - startY),
    };

    document.body.contains(selectionBox) && document.body.removeChild(selectionBox);
    startX = startY = endX = endY = undefined;
    document.body.style.userSelect = "";
    document.removeEventListener("mousedown", mouseDown);
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);

    setTimeout(() => {
        chrome.runtime.sendMessage({ action: "screenshotArea" }, (response) => {
            let img = new Image();
            img.src = response.image;
            img.onload = () => {
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");
                let scaleX = img.naturalWidth / window.innerWidth;
                let scaleY = img.naturalHeight / window.innerHeight;
                let cropX = selection.x * scaleX;
                let cropY = selection.y * scaleY;
                let cropWidth = selection.width * scaleX;
                let cropHeight = selection.height * scaleY;

                canvas.width = cropWidth;
                canvas.height = cropHeight;

                ctx.drawImage(
                    img,
                    cropX, cropY, cropWidth, cropHeight,
                    0, 0, cropWidth, cropHeight,
                );

                chrome.runtime.sendMessage({ action: 'download', image: canvas.toDataURL("image/png") });
            };
        });
    }, 100);
}
