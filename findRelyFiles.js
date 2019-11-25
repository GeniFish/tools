// 只需要设定好需要检索的依赖文件路径imagePath和项目路径filePath;
// 就能自动发现项目中未使用的依赖文件

let fs = require('fs');
let join = require('path').join;
let imagePath = 'E:/images';    // 需要检索的依赖文件(图片)文件夹路径
let filePath = 'E:/programCode';    // 项目源代码文件夹路径

function findSync (startPath) {
    let result = [];
    function finder(path) {
        let files = fs.readdirSync(path);
        files.forEach((filename, index) => {
            let fPath = join(path, filename);
            let stats = fs.statSync(fPath);
            // 图片文件夹不递归查询子文件夹，因为子文件夹可能有重名文件被使用
            // if(stats.isDirectory()) finder(fPath);
            if (stats.isFile()) {
                result.push(filename);
                // console.log(filename);
            }
        });

    }
    finder(startPath);
    return result;
}

function findCode(startPath) {
    let imageList = findSync(imagePath);
    let flag = 0;
    for(let i = 0;i < imageList.length;i++){
        function finder(path) {
            let files = fs.readdirSync(path);
            files.forEach((filename, index) => {
                let fPath = join(path, filename);
                let stats = fs.statSync(fPath);
                if (stats.isDirectory()) finder(fPath);
                if (stats.isFile()) {
                    let data = fs.readFileSync(fPath,'utf-8');
                    if (data.indexOf(imageList[i]) > -1) {
                        // console.log(imageList[i] + '被使用' + fPath);
                        flag = 1;
                    }
                    else{
                        flag = 0;
                        // console.log(imageList[i] + '没有被使用');
                    }
                    
                }
            });
        }
        finder(startPath);
        if (flag === 0) {
            console.log(imageList[i] + '没有被使用');
        }
    }
}

findCode(filePath);
console.log('--------执行完毕--------');
