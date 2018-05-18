var fs = require('fs');

function copyFile(source, target, cb) {
    if (fs.exists(target)) {
        fs.unlinkSync(target);
    }
    fs.createReadStream(source).pipe(fs.createWriteStream(target));
}

copyFile(process.argv[2], process.argv[3]);