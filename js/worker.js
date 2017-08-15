Number.prototype.formatBytes = function formatBytes(decimals) {
 if (this == 0) return '0 Bytes';
   var k = 1000,
       dm = decimals || 2,
       sizes = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
       i = Math.floor(Math.log(this) / Math.log(k));
   return parseFloat((this / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function inspectFile(file) {
	var reader = new FileReader(),
			res = {};
	
	reader.onprogress = function() {
		postMessage("Worker is reading the file...");
	};
	
	reader.onload = function() {
		if (!res.url) {
			res.name = file.name;
			res.size = file.size.formatBytes();
			res.type = file.type;
			res.url = reader.result;
			
			reader.readAsBinaryString(file);
			return;
		} 
		
		res.data = reader.result;
		
		postMessage(res);
		return;
	};
	
	reader.readAsDataURL(file);
}

onmessage = function(e) {
		inspectFile(e.data);
}
