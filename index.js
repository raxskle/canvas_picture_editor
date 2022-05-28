const canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");
canvasMaxWidth = 800;
canvasMaxHeight = 600;
context.fillStyle = "rgb(240, 240, 240)";
context.fillRect(0, 0, 800, 600);

let image;

let frame;

function upload() {
  canvas.width = canvasMaxWidth;
  canvas.height = canvasMaxHeight;
  let file = document.querySelector("input[type=file]").files[0]; // 获取选择的文件，这里是图片类型
  let reader = new FileReader();
  reader.readAsDataURL(file); //读取文件并将文件以URL的形式保存在resulr属性中 base64格式
  reader.onload = function (e) {
    // 文件读取完成时触发
    let result = e.target.result; // base64格式图片地址

    let f = document.querySelector(".f");
    frame = new Image();
    frame.src = f.src;
    image = new Image();
    image.src = result; // 设置image的地址为base64的地址
    image.onload = function () {
      let rate = image.width / image.height;
      if (image.width > image.height) {
        if (image.width > canvas.width) {
          image.width = canvas.width;
          image.height = image.width / rate;
        }
      } else if (image.width <= image.height) {
        if (image.height > canvas.width) {
          image.height = canvas.height;
          image.width = image.height * rate;
        }
      }

      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0, image.width, image.height); // 在canvas上绘制图片
      let dataUrl = canvas.toDataURL("image/jpeg", 1); // 0.92为压缩比，可根据需要设置，设置过小会影响图片质量
      // dataUrl 为压缩后的图片资源，可将其上传到服务器
    };
  };
}

// 下载
//
let url;
let downloadBtn = document.querySelector(".download");
downloadBtn.onclick = () => {
  url = canvas.toDataURL();
  console.log(url);
  let dd = document.createElement("a");
  dd.href = url;
  dd.download = "downImg";
  dd.click();
};

// 拖拽
const move = document.querySelector(".move");
let rect = canvas.getBoundingClientRect();
let flag = false;
let ox;
let oy;
let px = 0;
let py = 0;
move.addEventListener("click", () => {
  flag = !flag;
  if (flag && image) {
    move.className = "btnactive move";
    canvas.onmousedown = (e) => {
      if (image) {
        ox = e.clientX - rect.left;
        oy = e.clientY - rect.top;

        console.log("px" + px);
        console.log("py" + py);

        canvas.onmousemove = (e) => {
          let x = e.clientX - rect.left;
          let y = e.clientY - rect.top;
          console.log(x);
          console.log(y);
          context.clearRect(0, 0, canvas.width, canvas.height);
          let dx = x - ox;
          let dy = y - oy;

          context.drawImage(image, px + dx, py + dy, image.width, image.height);

          canvas.onmouseup = (e) => {
            px = px + dx;
            py = py + dy;
            canvas.onmousemove = null;
          };
        };
      }
    };
  } else if (image) {
    image.src = canvas.toDataURL();
    move.className = "btn move";
    canvas.onmousedown = null;
    canvas.onmousemove = null;
    canvas.onmouseup = null;
  }
});

// 复位
const back = document.querySelector(".back");
back.onclick = () => {
  if (image) {
    px = 0;
    py = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, image.width, image.height);
  }
};

// 旋转
// const rotate = document.querySelector(".rotate");

// // rotate.onclick = () => {
// //   context.clearRect(0, 0, canvas.width, canvas.height);
// //   let temp = canvas.width;
// //   canvas.width = canvas.height;
// //   canvas.height = temp;
// //   context.save(); //保存状态
// //   context.translate(canvas.width, 0);

// //   context.rotate(Math.PI / 2);
// //   context.drawImage(image, 0, 0, image.width, image.height); //把图片绘制在旋转的中心点，
// //   context.restore(); //恢复状态
// //   // image.src = canvas.toDataURL();
// // };

// rotate.onclick = () => {
//   image.src = canvas.toDataURL();
//   context.clearRect(0, 0, canvas.width, canvas.height);
//   let temp = canvas.width;
//   canvas.width = canvas.height;
//   canvas.height = temp;
//   context.translate(canvas.width / 2, canvas.height / 2);
//   // 2.3 画布旋转90°
//   context.rotate((Math.PI * 1) / 2);
//   // 2.4 绘制图像 图像起始点需偏移负宽高
//   context.drawImage(image, -image.width / 2, -image.height / 2);
//   context.clearRect(0, 0, canvas.width, canvas.height);
// };

// 滤镜
// 反相
const a = document.querySelector(".a");
let aflag = false;
a.onclick = () => {
  if (image) {
    aflag = !aflag;
    if (aflag) {
      a.className = "btnactive a";
    } else {
      a.className = "btn a";
    }
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i]; // red
      data[i + 1] = 255 - data[i + 1]; // green
      data[i + 2] = 255 - data[i + 2]; // blue
    }
    context.putImageData(imageData, 0, 0);
    image.src = canvas.toDataURL();
  }
};
// 黑白
const b = document.querySelector(".b");
let bflag = false;
let bhistoryImage; //回退
b.onclick = () => {
  if (image) {
    bflag = !bflag;
    if (bflag) {
      b.className = "btnactive b";
      bhistoryImage = canvas.toDataURL();
      let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      let data = imageData.data;
      for (var i = 0; i < data.length; i += 4) {
        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
      }
      context.putImageData(imageData, 0, 0);
      image.src = canvas.toDataURL();
    } else {
      b.className = "btn b";
      image.src = bhistoryImage;
    }
  }
};
// 浮雕
let c = document.querySelector(".c");
let cflag = false;
let chistoryImage;
c.onclick = () => {
  if (image) {
    cflag = !cflag;
    if (cflag) {
      c.className = "btnactive c";
      chistoryImage = canvas.toDataURL();
      let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      (pixelData = imageData.data), (precolor = {});
      for (var i = 0; i < canvas.width * canvas.height; i++) {
        if (i == 0) {
          precolor = {
            r: pixelData[i * 4 + 0],
            g: pixelData[i * 4 + 1],
            b: pixelData[i * 4 + 2],
          };
        } else {
          var r = pixelData[i * 4 + 0] - precolor.r + 128;
          var g = pixelData[i * 4 + 1] - precolor.g + 128;
          var b = pixelData[i * 4 + 2] - precolor.b + 128;
          precolor = {
            r: pixelData[i * 4 + 0],
            g: pixelData[i * 4 + 1],
            b: pixelData[i * 4 + 2],
          };
          pixelData[i * 4 + 0] = r;
          pixelData[i * 4 + 1] = g;
          pixelData[i * 4 + 2] = b;
        }
        var r = pixelData[i * 4 + 0],
          g = pixelData[i * 4 + 1],
          b = pixelData[i * 4 + 2];
        var grey = 0.3 * r + 0.59 * g + 0.11 * b;
        pixelData[i * 4 + 0] = grey;
        pixelData[i * 4 + 1] = grey;
        pixelData[i * 4 + 2] = grey;
      }
      context.putImageData(imageData, 0, 0);
      image.src = canvas.toDataURL();
    } else {
      c.className = "btn c";
      image.src = chistoryImage;
    }
  }
};

// 裁剪
//
const cut = document.querySelector(".cut");
const cutmenu = document.querySelector(".cutmenu");
let cutflag = false;
cut.onclick = () => {
  if (image) {
    cutflag = !cutflag;
    let ax;
    let bx;
    let ay;
    let by;

    if (cutflag) {
      image.src = canvas.toDataURL();
      cutmenu.style.display = "block";
      cut.className = "btnactive cut";
      context.fillStyle = "rgba(0, 0, 0, 0.6)";
      // context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, image.width, image.height);
      canvas.onmousedown = (e) => {
        context.drawImage(image, 0, 0, image.width, image.height);
        context.fillRect(0, 0, canvas.width, canvas.height);
        let rect = canvas.getBoundingClientRect();
        ax = e.clientX - rect.left;
        ay = e.clientY - rect.top;
        console.log(ax);
        console.log(ay);
        canvas.onmousemove = (e) => {
          context.fillStyle = "rgba(0, 0, 0, 0.6)";
          context.drawImage(image, 0, 0, image.width, image.height);
          context.fillRect(0, 0, canvas.width, canvas.height);
          bx = e.clientX - rect.left;
          by = e.clientY - rect.top;
          let width = bx - ax;
          let height = by - ay;

          let imgx = (image.width * ax) / canvas.width;
          let imgy = (image.height * ay) / canvas.height;

          context.drawImage(
            image,
            imgx,
            imgy,
            width,
            height,
            ax,
            ay,
            width,
            height
          );

          canvas.onmouseup = () => {
            // let width = bx - ax;
            // let height = by - ay;

            canvas.onmousemove = null;
          };
        };
      };
    } else {
      console.log("再次点击了“裁剪”取消 ");
      context.drawImage(image, 0, 0, image.width, image.height);
      cutmenu.style.display = "none";
      cut.className = "btn cut";
      canvas.onmousemove = null;
      canvas.onmousedown = null;
      canvas.onmouseup = null;
    }

    cutmenu.onclick = (e) => {
      // e.stopPropagation();
      console.log("点击了“截取”");
      context.clearRect(0, 0, canvas.width, canvas.height);
      // canvas.width = bx - ax;
      // canvas.height = by - ay;
      context.drawImage(
        image,
        ax,
        ay,
        bx - ax,
        by - ay,
        ax,
        ay,
        bx - ax,
        by - ay
      );
      image.src = canvas.toDataURL();

      // context.drawImage(image, 0, 0, bx - ax, by - ay);

      // context.drawImage(image, 0, 0, image.width, image.height);
    };
  }
};

// 缩放
let changeSize = document.querySelector(".changeSize");
let dflag = false;
changeSize.onclick = () => {
  if (image) {
    dflag = !dflag;
    if (dflag) {
      changeSize.className = "btnactive changeSize";
      let obj = {
        fontX: 0,
        fontY: 0,
        fontZoom: 1,
        curZoom: 1,
        translateX: 0,
        translateY: 0,
        draw() {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, image.width, image.height);
        },
        zoom(offsetX, offsetY, z) {
          context.save();
          context.clearRect(0, 0, canvas.width, canvas.height);
          this.curZoom = this.fontZoom + z;
          this.translateX =
            offsetX -
            ((offsetX - this.translateX) * this.curZoom) / this.fontZoom;
          this.translateY =
            offsetY -
            ((offsetY - this.translateY) * this.curZoom) / this.fontZoom;
          context.translate(this.translateX, this.translateY);
          context.scale(this.curZoom, this.curZoom);
          this.draw();
          context.restore();
          this.fontY = offsetY;
          this.fontX = offsetX;
          this.fontZoom = this.curZoom;
        },
      };
      // obj.draw();
      canvas.onmousewheel = (e) => {
        let z = e.deltaY > 0 ? -0.1 : 0.1;
        obj.zoom(e.offsetX, e.offsetY, z);
      };
    } else {
      image.src = canvas.toDataURL();
      changeSize.className = "btn changeSize";
      canvas.onmousewheel = null;
    }
  }
};

// 放大镜
//
const div = document.querySelector(".container");
let canvas2 = document.querySelector("#canvas2");
let ctx2 = canvas2.getContext("2d");
let big = document.querySelector(".big");

let bigflag = false;
big.onclick = () => {
  if (image) {
    bigflag = !bigflag;
    if (bigflag) {
      big.className = "btnactive big";
      canvas.onmousemove = (e) => {
        // 利用 e.clientX,e.clientY 改变canvas2的相对位置
        let rect = canvas.getBoundingClientRect();
        canvas2.style.display = "block";

        console.log(e.clientX - rect.left, e.clientY - rect.top);
        canvas2.style.left = e.clientX - 80 + "px";
        canvas2.style.top = e.clientY - 80 + "px";
        // 清除ctx2矩形区域
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        // 参数1将img加载到画布中，参数2和3，设置裁切的起始位置坐标，参数4和5设置裁切的宽高，参数6和7设置图片裁切后放置的位置，参数8和9设置图片放置后的缩放宽高
        ctx2.drawImage(
          image,
          (e.clientX - rect.left - 26) * (image.width / canvas.width),
          (e.clientY - rect.top - 26) * (image.height / canvas.height),
          (canvas2.width * 1) / 3,
          (canvas2.height * 1) / 3,
          0,
          0,
          canvas2.width,
          canvas2.height
        );
      };
      // 将加载的图片放在画布canvas1中，因为监听事件时异步的不会影响图片的放入
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      image.src = canvas.toDataURL();
    } else {
      ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
      canvas2.style.display = "none";
      canvas.onmousemove = null;
      big.className = "btn big";
    }
  }
};

canvas.onmouseout = () => {
  canvas2.style.display = "none";
};
canvas.onmouseover = () => {
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  canvas2.style.display = "block";
};

//画框
let setframe = document.querySelector(".setframe");
let sflag = false;
let historyimg;
setframe.onclick = () => {
  if (image) {
    sflag = !sflag;
    if (sflag) {
      setframe.className = "btnactive setframe";
      historyimg = canvas.toDataURL();

      context.drawImage(frame, 0, 0, canvas.width, canvas.height);
    } else {
      setframe.className = "btn setframe";
      image.src = historyimg;
    }
  }
};

//
// 画笔

const draw = document.querySelector(".draw");
const drawmenu = document.querySelector(".drawmenu");
const thick = document.querySelector(".thickness");

let drawflag = false;
let thickness = 2;
let isthick = false;
let strokeStyle = "black";
draw.onclick = () => {
  if (!image) {
    image = new Image();
  }
  drawflag = !drawflag;
  if (drawflag) {
    draw.className = "btnactive draw";
    drawmenu.style.display = "block";
    let rect = canvas.getBoundingClientRect();
    canvas.onmousedown = (e) => {
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      context.beginPath();
      context.moveTo(x, y);
      context.strokeStyle = strokeStyle;
      context.lineWidth = thickness;
      context.lineCap = "round";
      context.lineJoin = "round";

      canvas.onmousemove = (e) => {
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        context.lineTo(x, y);
        context.stroke();
        canvas.onmouseup = () => {
          context.closePath();
          canvas.onmousemove = null;
          image.src = canvas.toDataURL();
        };
      };
    };
  } else {
    draw.className = "btn draw";
    drawmenu.style.display = "none";
    canvas.onmousedown = null;
  }
};

thick.onclick = () => {
  isthick = !isthick;
  if (isthick) {
    thick.className = "btnactive thickness";
    thickness = 8;
  } else {
    thick.className = "btn thickness";
    thickness = 2;
  }
};
